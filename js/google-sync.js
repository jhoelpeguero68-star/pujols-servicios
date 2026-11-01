// PUJOLS Servicios - Módulo de Integración Oficial Google Identity & Google Sheets API
// Permite sincronización automática de Clientes, Equipos, Servicios y Facturas entre PC y Celular

const GoogleSync = {
  // Client ID Oficial Permanente de Google OAuth 2.0
  CLIENT_ID: '388437967982-knd0vagm1c4h0c5igunsdb4g75iu2a18.apps.googleusercontent.com',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
  SHEET_NAME: 'PUJOLS Servicios - Base de Datos',
  
  tokenClient: null,
  accessToken: localStorage.getItem('pujols_google_token') || null,
  tokenExpiresAt: Number(localStorage.getItem('pujols_google_token_expiry')) || 0,
  userEmail: localStorage.getItem('pujols_google_email') || null,
  spreadsheetId: localStorage.getItem('pujols_google_sheet_id') || null,
  isSyncing: false,

  init() {
    console.log('Iniciando servicio de sincronización Google Sheets...');
    this.actualizarIndicadorUI();

    // Si hay sesión registrada, verificar vigencia o renovar silenciosamente
    if (this.accessToken || this.userEmail) {
      if (this.tokenExpiresAt && Date.now() > this.tokenExpiresAt) {
        console.log('Token de Google expirado. Programando renovación silenciosa...');
        setTimeout(() => this.renovarTokenSilencioso(), 1500);
      } else {
        console.log('Sesión activa con Google:', this.userEmail);
      }
    }
  },

  isTokenValid() {
    return Boolean(this.accessToken && (!this.tokenExpiresAt || Date.now() < this.tokenExpiresAt));
  },

  async asegurarTokenValido() {
    if (!this.isTokenValid() && this.userEmail) {
      console.log('Asegurando token válido para Google API...');
      await this.renovarTokenSilencioso();
    }
    return this.accessToken;
  },

  renovarTokenSilencioso() {
    return new Promise((resolve) => {
      this.conectarConGoogle({ silent: true, prompt: '' }, () => resolve(this.accessToken));
    });
  },

  // Iniciar flujo de sincronización con Google Identity / Google Sheets
  conectarConGoogle(options = {}, onComplete = null) {
    const silent = options.silent === true;
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
      if (!silent) {
        let retries = 0;
        const interval = setInterval(() => {
          retries++;
          if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
            clearInterval(interval);
            this.conectarConGoogle(options, onComplete);
          } else if (retries >= 8) {
            clearInterval(interval);
            alert('Cargando servicios de Google... Por favor compruebe su conexión a internet e inténtelo de nuevo.');
          }
        }, 250);
      }
      if (onComplete) onComplete(null);
      return;
    }

    try {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: this.SCOPES,
        callback: async (resp) => {
          if (resp.error !== undefined) {
            console.warn('Google Auth notice/error:', resp);
            if (!silent) {
              alert('Aviso de Google: ' + (resp.error_description || resp.error));
            }
            if (onComplete) onComplete(null);
            return;
          }

          this.accessToken = resp.access_token;
          const expiresIn = resp.expires_in ? Number(resp.expires_in) : 3600;
          this.tokenExpiresAt = Date.now() + (expiresIn - 60) * 1000;

          localStorage.setItem('pujols_google_token', this.accessToken);
          localStorage.setItem('pujols_google_token_expiry', this.tokenExpiresAt);

          await this.obtenerPerfilGoogle();
          await this.inicializarHojaCalculo();

          this.actualizarIndicadorUI();

          if (!silent) {
            alert(`✅ ¡Conexión con Google Exitosa!\n\nUsuario: ${this.userEmail || 'Google Drive'}\nBase de datos: "PUJOLS Servicios - Base de Datos" en tu Google Drive.\n\nLa sincronización entre celular y PC está activa en tiempo real.`);
          }

          if (onComplete) onComplete(this.accessToken);
        }
      });

      // Si es silencioso en segundo plano usa '', pero si el usuario pulsó el botón usa 'select_account' para abrir la ventana
      const promptParam = silent ? '' : 'select_account';
      this.tokenClient.requestAccessToken({ prompt: promptParam });
    } catch (err) {
      console.error('Error al inicializar Google Token Client:', err);
      if (!silent) {
        alert('Error al iniciar con Google: ' + err.message);
      }
      if (onComplete) onComplete(null);
    }
  },

  // Obtener correo del usuario autenticado
  async obtenerPerfilGoogle() {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        this.userEmail = data.email;
        localStorage.setItem('pujols_google_email', this.userEmail);
        if (window.store && window.store.updateEmpresa) {
          window.store.updateEmpresa({ gmail: this.userEmail, googleDriveSync: true, googleSheetsSync: true });
        }
      }
    } catch (e) {
      console.warn('No se pudo obtener el correo de perfil:', e);
    }
  },

  // Crear o buscar la hoja de cálculo "PUJOLS Servicios - Base de Datos" en el Google Drive del usuario
  async inicializarHojaCalculo() {
    if (!this.accessToken) return;

    try {
      // 1. Buscar si ya existe la hoja en Google Drive
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(this.SHEET_NAME)}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
        { headers: { Authorization: `Bearer ${this.accessToken}` } }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.files && searchData.files.length > 0) {
          this.spreadsheetId = searchData.files[0].id;
          localStorage.setItem('pujols_google_sheet_id', this.spreadsheetId);
          console.log('Hoja de cálculo existente encontrada:', this.spreadsheetId);
          await this.descargarDatosDeSheet();
          return;
        }
      }

      // 2. Si no existe, crear la hoja automáticamente con las pestañas oficiales
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: this.SHEET_NAME },
          sheets: [
            { properties: { title: 'Clientes' } },
            { properties: { title: 'Equipos' } },
            { properties: { title: 'Servicios' } },
            { properties: { title: 'Facturas' } },
            { properties: { title: 'Finanzas' } }
          ]
        })
      });

      if (createRes.ok) {
        const sheetData = await createRes.json();
        this.spreadsheetId = sheetData.spreadsheetId;
        localStorage.setItem('pujols_google_sheet_id', this.spreadsheetId);
        
        // Escribir cabeceras iniciales y subir datos
        await this.crearCabecerasIniciales();
        await this.subirTodosLosDatosASheet();
        console.log('Hoja de cálculo creada automáticamente en Google Drive:', this.spreadsheetId);
      }
    } catch (err) {
      console.error('Error al inicializar hoja en Google Sheets:', err);
    }
  },

  // Crear encabezados limpios en cada pestaña de Google Sheets
  async crearCabecerasIniciales() {
    if (!this.spreadsheetId || !this.accessToken) return;

    const updates = [
      {
        range: 'Clientes!A1:K1',
        values: [['ID', 'Nombre', 'Tipo', 'Teléfono', 'WhatsApp', 'Correo', 'Dirección', 'Latitud', 'Longitud', 'Google Maps', 'Fecha Creación']]
      },
      {
        range: 'Equipos!A1:H1',
        values: [['ID', 'Cliente ID', 'Cliente Nombre', 'Tipo', 'Marca', 'Modelo / Capacidad', 'Ubicación', 'Último Servicio']]
      },
      {
        range: 'Servicios!A1:I1',
        values: [['ID', 'Cliente', 'Equipo', 'Tipo Servicio', 'Fecha', 'Hora', 'Técnico', 'Estado', 'Monto (RD$)']]
      },
      {
        range: 'Facturas!A1:G1',
        values: [['No. Factura', 'Fecha', 'Cliente', 'Concepto', 'Total (RD$)', 'Estado', 'Teléfono']]
      },
      {
        range: 'Finanzas!A1:F1',
        values: [['ID', 'Tipo', 'Fecha', 'Concepto', 'Categoría', 'Monto (RD$)']]
      }
    ];

    for (const item of updates) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(item.range)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: item.values })
      });
    }
  },

  // Sincronizar un nuevo cliente hacia Google Sheets (inserta o actualiza)
  async sincronizarNuevoCliente(c) {
    await this.asegurarTokenValido();
    if (!this.spreadsheetId || !this.accessToken) {
      if (window.store && window.store.addToSyncQueue) window.store.addToSyncQueue('cliente', c);
      return;
    }

    try {
      const row = [
        c.id,
        c.nombre,
        c.tipo || 'Residencial',
        c.telefono || '',
        c.whatsapp || '',
        c.correo || '',
        c.direccion || '',
        c.lat || '',
        c.lng || '',
        c.mapUrl || '',
        new Date().toLocaleDateString('es-DO')
      ];

      // Verificar si ya existe en la columna A
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Clientes!A2:A`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        const existingIndex = checkData.values ? checkData.values.findIndex(r => r[0] === c.id) : -1;
        if (existingIndex !== -1) {
          const rowIndex = existingIndex + 2;
          await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Clientes!A${rowIndex}:K${rowIndex}?valueInputOption=USER_ENTERED`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [row] })
          });
          console.log(`Cliente actualizado en fila ${rowIndex} de Google Sheets:`, c.nombre);
          return;
        }
      }

      // Si no existe, insertar nueva fila
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Clientes!A:K:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [row] })
      });
      console.log('Cliente sincronizado en Google Sheets:', c.nombre);
    } catch (e) {
      console.warn('Error sincronizando cliente, guardando en cola offline:', e);
      if (window.store && window.store.addToSyncQueue) window.store.addToSyncQueue('cliente', c);
    }
  },

  // Sincronizar un nuevo servicio / cita agendada hacia Google Sheets (inserta o actualiza)
  async sincronizarNuevoServicio(s) {
    await this.asegurarTokenValido();
    if (!this.spreadsheetId || !this.accessToken) {
      if (window.store && window.store.addToSyncQueue) window.store.addToSyncQueue('servicio', s);
      return;
    }

    try {
      const srvId = s.ordenId || s.id;
      const row = [
        srvId,
        s.clienteNombre || 'Cliente General',
        s.equipoNombre || 'Equipo General',
        s.tipo || 'Mantenimiento',
        s.fechaFormato || s.fecha || new Date().toLocaleDateString('es-DO'),
        s.hora || '9:00 a. m.',
        s.tecnico || 'Marcos Pujols',
        s.estado || 'Programado',
        s.costo || 0
      ];

      // Verificar si el servicio ya existe en la columna A de la hoja Servicios
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Servicios!A2:A`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        const existingIndex = checkData.values ? checkData.values.findIndex(r => r[0] === srvId) : -1;
        if (existingIndex !== -1) {
          const rowIndex = existingIndex + 2;
          await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Servicios!A${rowIndex}:I${rowIndex}?valueInputOption=USER_ENTERED`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [row] })
          });
          console.log(`Servicio actualizado en fila ${rowIndex} de Google Sheets:`, srvId);
          return;
        }
      }

      // Si no existe, agregar fila a Servicios
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Servicios!A:I:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [row] })
      });
      console.log('Servicio sincronizado en Google Sheets:', srvId);
    } catch (e) {
      console.warn('Error sincronizando servicio en Google Sheets:', e);
      if (window.store && window.store.addToSyncQueue) window.store.addToSyncQueue('servicio', s);
    }
  },

  // Sincronizar una factura emitida o actualizada hacia Google Sheets
  async sincronizarNuevaFactura(f) {
    await this.asegurarTokenValido();
    if (!this.spreadsheetId || !this.accessToken) {
      if (window.store && window.store.addToSyncQueue) window.store.addToSyncQueue('factura', f);
      return;
    }

    try {
      const row = [
        f.numero,
        f.fecha || new Date().toLocaleDateString('es-DO'),
        f.clienteNombre,
        f.items && f.items[0] ? f.items[0].descripcion : 'Servicio técnico',
        f.total,
        f.estado,
        f.clienteTelefono || ''
      ];

      // Verificar si la factura ya existe en Facturas!A2:A para actualizar su estado (Pendiente <-> Pagada)
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Facturas!A2:A`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        const existingIndex = checkData.values ? checkData.values.findIndex(r => r[0] === f.numero) : -1;
        if (existingIndex !== -1) {
          const rowIndex = existingIndex + 2;
          await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Facturas!A${rowIndex}:G${rowIndex}?valueInputOption=USER_ENTERED`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [row] })
          });
          console.log(`Factura ${f.numero} actualizada (Estado: ${f.estado}) en fila ${rowIndex} de Google Sheets`);
          return;
        }
      }

      // Si no existe, agregarla
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Facturas!A:G:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [row] })
      });
      console.log('Factura agregada a Google Sheets:', f.numero);
    } catch (e) {
      console.warn('Error al sincronizar factura:', e);
      if (window.store && window.store.addToSyncQueue) window.store.addToSyncQueue('factura', f);
    }
  },

  // Sincronizar todas las transacciones (ingresos y egresos) con Google Sheets
  async sincronizarTransacciones() {
    await this.asegurarTokenValido();
    if (!this.accessToken || !this.spreadsheetId) return;

    try {
      // 1. Limpiar rango Finanzas!A2:F1000 para que refleje fielmente altas, bajas o modificaciones
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Finanzas!A2:F1000:clear`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' }
      });

      const txs = (window.store && window.store.state && window.store.state.finanzas && window.store.state.finanzas.transacciones) || [];
      if (txs.length > 0) {
        const txRows = txs.map(t => [
          t.id || `TX-${Date.now()}`,
          t.tipo || 'Ingreso',
          t.fecha || (window.DateUtil ? window.DateUtil.getLocalDateString() : new Date().toISOString().split('T')[0]),
          t.concepto || 'Movimiento',
          t.categoria || 'General',
          t.monto || 0
        ]);

        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Finanzas!A2:F?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: txRows })
        });
      }
      console.log('Transacciones de finanzas sincronizadas con Google Sheets exitosamente.');
    } catch (e) {
      console.warn('Error al sincronizar transacciones con Sheets:', e);
    }
  },

  // Subir todos los datos actuales a la hoja de cálculo
  async subirTodosLosDatosASheet() {
    await this.asegurarTokenValido();
    const st = window.store.state;
    if (!st || !this.spreadsheetId || !this.accessToken) return;

    // 1. Clientes
    if (st.clientes && st.clientes.length > 0) {
      const rows = st.clientes.map(c => [
        c.id, c.nombre, c.tipo || 'Residencial', c.telefono || '', c.whatsapp || '', c.correo || '', c.direccion || '', c.lat || '', c.lng || '', c.mapUrl || '', new Date().toLocaleDateString('es-DO')
      ]);
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Clientes!A2:K?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rows })
      });
    }

    // 2. Servicios
    if (st.servicios && st.servicios.length > 0) {
      const sRows = st.servicios.map(s => [
        s.ordenId || s.id,
        s.clienteNombre || 'Cliente',
        s.equipoNombre || 'Equipo',
        s.tipo || 'Mantenimiento',
        s.fechaFormato || s.fecha,
        s.hora || '9:00 a. m.',
        s.tecnico || 'Marcos Pujols',
        s.estado || 'Programado',
        s.costo || 0
      ]);
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Servicios!A2:I?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: sRows })
      });
    }

    // 3. Facturas
    if (st.facturas && st.facturas.length > 0) {
      const fRows = st.facturas.map(f => [
        f.numero, f.fecha, f.clienteNombre, (f.items && f.items[0] ? f.items[0].descripcion : 'Servicio técnico'), f.total, f.estado, f.clienteTelefono || ''
      ]);
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Facturas!A2:G?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: fRows })
      });
    }

    // 4. Finanzas (transacciones)
    if (st.finanzas && Array.isArray(st.finanzas.transacciones) && st.finanzas.transacciones.length > 0) {
      const txRows = st.finanzas.transacciones.map(t => [
        t.id, t.tipo, t.fecha, t.concepto, t.categoria || 'General', t.monto || 0
      ]);
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Finanzas!A2:F?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: txRows })
      });
    }

    console.log('Todos los datos se sincronizaron con Google Sheets exitosamente.');
  },

  // Sincronizar y actualizar todos los datos (Clientes, Servicios, Facturas, Finanzas) desde Google Sheets
  async actualizarTodoDesdeSheet(mostrarAlerta = false) {
    if (!this.userEmail && !this.accessToken) {
      if (confirm('Aún no has conectado tu cuenta de Google en este dispositivo.\n\n¿Deseas conectar Google Sheets ahora para sincronizar tus clientes y servicios?')) {
        this.conectarConGoogle({ silent: false }, async () => {
          await this.descargarDatosDeSheet(mostrarAlerta);
        });
      }
      return;
    }

    await this.asegurarTokenValido();
    if (!this.accessToken) {
      this.conectarConGoogle({ silent: false }, async () => {
        await this.descargarDatosDeSheet(mostrarAlerta);
      });
      return;
    }

    await this.descargarDatosDeSheet(mostrarAlerta);
  },

  // Descargar todos los datos desde Google Sheets hacia la aplicación local
  async descargarDatosDeSheet(mostrarAlerta = false) {
    if (!this.spreadsheetId || !this.accessToken) return;

    try {
      let clientesCount = 0;
      let serviciosCount = 0;
      let facturasCount = 0;

      // 1. Descargar Clientes (Clientes!A2:K)
      const resClientes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Clientes!A2:K`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (resClientes.ok) {
        const data = await resClientes.json();
        if (data.values && data.values.length > 0) {
          // Filtrar cualquier fila demo de Juan Pérez
          const reales = data.values.filter(r => r[0] && r[1] && !(r[0] === 'C-001' && (r[1] || '').includes('Juan Pérez')));
          
          if (reales.length > 0) {
            window.store.state.clientes = reales.map(r => ({
              id: r[0],
              nombre: r[1],
              iniciales: (r[1] || 'NC').substring(0, 2).toUpperCase(),
              tipo: r[2] || 'Residencial',
              telefono: r[3] || '',
              whatsapp: r[4] || r[3] || '',
              correo: r[5] || '',
              direccion: r[6] || '',
              lat: r[7] ? Number(r[7]) : null,
              lng: r[8] ? Number(r[8]) : null,
              mapUrl: r[9] || (r[6] ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r[6])}` : ''),
              equiposCount: 1,
              avatarBg: '#0A2540'
            }));
            clientesCount = window.store.state.clientes.length;
            window.store.state.indicadores.clientesTotal = clientesCount;
          }
        }
      }

      // 2. Descargar Servicios (Servicios!A2:I)
      // ['ID', 'Cliente', 'Equipo', 'Tipo Servicio', 'Fecha', 'Hora', 'Técnico', 'Estado', 'Monto (RD$)']
      const resServicios = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Servicios!A2:I`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (resServicios.ok) {
        const data = await resServicios.json();
        if (data.values && data.values.length > 0) {
          const reales = data.values.filter(r => r[0] && r[1]);
          if (reales.length > 0) {
            window.store.state.servicios = reales.map(r => ({
              id: r[0],
              ordenId: r[0],
              clienteNombre: r[1],
              equipoNombre: r[2] || 'Equipo General',
              tipo: r[3] || 'Mantenimiento',
              titulo: `${r[3] || 'Servicio'} - ${r[1]}`,
              fecha: r[4] || new Date().toISOString().split('T')[0],
              fechaFormato: r[4] || 'Hoy',
              hora: r[5] || '9:00 a. m.',
              tecnico: r[6] || 'Marcos Pujols',
              estado: r[7] || 'Programado',
              costo: Number(r[8]) || 0,
              descripcion: 'Servicio registrado y sincronizado desde Google Sheets.'
            }));
            serviciosCount = window.store.state.servicios.length;
            window.store.state.indicadores.serviciosMes = serviciosCount;
            window.store.state.indicadores.citasPendientes = window.store.state.servicios.filter(s => s.estado !== 'Completado').length;
          }
        }
      }

      // 3. Descargar Facturas (Facturas!A2:G)
      // ['No. Factura', 'Fecha', 'Cliente', 'Concepto', 'Total (RD$)', 'Estado', 'Teléfono']
      const resFacturas = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Facturas!A2:G`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (resFacturas.ok) {
        const data = await resFacturas.json();
        if (data.values && data.values.length > 0) {
          const reales = data.values.filter(r => r[0] && !(r[0] === 'F-000125' && (r[2] || '').includes('Juan Pérez')));
          if (reales.length > 0) {
            window.store.state.facturas = reales.map(r => ({
              numero: r[0],
              fecha: r[1] || new Date().toLocaleDateString('es-DO'),
              fechaISO: new Date().toISOString().split('T')[0],
              fechaTexto: r[1] || 'Hoy',
              clienteNombre: r[2] || 'Cliente',
              clienteTelefono: r[6] || '',
              estado: r[5] || 'Pendiente',
              subtotal: Number(r[4]) || 0,
              descuento: 0,
              total: Number(r[4]) || 0,
              items: [{
                cantidad: 1,
                descripcion: r[3] || 'Servicio técnico PUJOLS Servicios',
                precioUnitario: Number(r[4]) || 0,
                total: Number(r[4]) || 0
              }]
            }));
            facturasCount = window.store.state.facturas.length;
          }
        }
      }

      // 4. Descargar Finanzas (Finanzas!A2:F)
      const resFinanzas = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Finanzas!A2:F`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (resFinanzas.ok) {
        const data = await resFinanzas.json();
        if (data.values && data.values.length > 0) {
          window.store.state.finanzas.transacciones = data.values.map(r => ({
            id: r[0],
            tipo: r[1],
            fecha: r[2],
            concepto: r[3],
            categoria: r[4] || 'General',
            monto: Number(r[5]) || 0
          }));
        } else {
          window.store.state.finanzas.transacciones = [];
        }
      }

      // 5. Recalcular balances reales
      if (window.store && window.store.recalcularFinanzas) {
        window.store.recalcularFinanzas();
      } else {
        const txs = window.store.state.finanzas.transacciones || [];
        const totalIngresos = txs.filter(t => t.tipo === 'Ingreso').reduce((sum, t) => sum + (Number(t.monto) || 0), 0);
        const totalEgresos = txs.filter(t => t.tipo === 'Egreso').reduce((sum, t) => sum + (Number(t.monto) || 0), 0);
        window.store.state.finanzas.ingresos = totalIngresos;
        window.store.state.finanzas.egresos = totalEgresos;
        window.store.state.finanzas.resultadoNeto = totalIngresos - totalEgresos;
        if (window.store.state.indicadores) {
          window.store.state.indicadores.ingresosMes = totalIngresos;
          window.store.state.indicadores.egresosMes = totalEgresos;
          window.store.state.indicadores.resultadoNeto = totalIngresos - totalEgresos;
        }
      }

      // Asegurar que no queden residuos demo
      window.store.state.datosLimpiados = true;
      window.store.saveState();

      if (window.App && window.App.refreshCurrentScreen) {
        window.App.refreshCurrentScreen();
      }

      this.actualizarIndicadorUI();

      if (mostrarAlerta) {
        alert(`✅ ¡Sincronización Exitosa!\n\nSe han actualizado desde Google Sheets:\n• ${clientesCount} clientes\n• ${serviciosCount} órdenes de servicio\n• ${facturasCount} facturas\n\nTus dispositivos están sincronizados en tiempo real.`);
      }
    } catch (e) {
      console.warn('Error al descargar datos de Google Sheets:', e);
      if (mostrarAlerta) {
        alert('Hubo un error al actualizar desde Google Sheets: ' + e.message);
      }
    }
  },

  // Limpiar las filas de prueba en Google Sheets conservando los encabezados (fila 1)
  async limpiarHojasParaProduccion() {
    await this.asegurarTokenValido();
    if (!this.spreadsheetId || !this.accessToken) return;

    try {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values:batchClear`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ranges: [
            'Clientes!A2:K1000',
            'Equipos!A2:H1000',
            'Servicios!A2:I1000',
            'Facturas!A2:G1000',
            'Finanzas!A2:F1000'
          ]
        })
      });
      console.log('Filas de prueba eliminadas de Google Sheets exitosamente.');
    } catch (e) {
      console.warn('Error al limpiar filas en Google Sheets:', e);
    }
  },

  actualizarIndicadorUI() {
    const label = document.getElementById('googleSyncStatusLabel');
    const btn = document.getElementById('btnConectarGoogleTop');

    const email = this.userEmail || localStorage.getItem('pujols_google_email');
    const token = this.accessToken || localStorage.getItem('pujols_google_token');

    if (email) {
      if (label) {
        label.innerHTML = `🟢 <strong>Google Sheets Conectado:</strong> ${email} • Sincronización en tiempo real activa`;
        label.style.color = '#166534';
      }
      if (btn) {
        btn.innerHTML = `✅ Conectado (${email.split('@')[0]})`;
        btn.style.color = '#166534';
        btn.style.borderColor = '#86EFAC';
        btn.style.background = '#F0FDF4';
      }
    } else {
      if (label) {
        label.innerHTML = `⚪ Sincronización con Google Sheets disponible. Pulse para iniciar sesión.`;
        label.style.color = 'var(--text-muted)';
      }
      if (btn) {
        btn.innerHTML = `<span style="display: inline-flex; align-items: center; gap: 6px; pointer-events: none;">
          <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          Conectar Google Sheets
        </span>`;
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.background = '#FFFFFF';
      }
    }
  },

  desconectar() {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.userEmail = null;
    this.spreadsheetId = null;
    localStorage.removeItem('pujols_google_token');
    localStorage.removeItem('pujols_google_token_expiry');
    localStorage.removeItem('pujols_google_email');
    localStorage.removeItem('pujols_google_sheet_id');
    this.actualizarIndicadorUI();
    alert('Sesión de Google desconectada de este dispositivo.');
  }
};

window.GoogleSync = GoogleSync;
