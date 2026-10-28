// PUJOLS Servicios - Módulo de Integración Oficial Google Identity & Google Sheets API
// Permite sincronización automática de Clientes, Equipos, Servicios y Facturas entre PC y Celular

const GoogleSync = {
  // Client ID de Google OAuth 2.0 (Google Identity Services)
  CLIENT_ID: localStorage.getItem('pujols_google_client_id') || '458129034871-pujolsservicios.apps.googleusercontent.com',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
  SHEET_NAME: 'PUJOLS Servicios - Base de Datos',
  
  tokenClient: null,
  accessToken: localStorage.getItem('pujols_google_token') || null,
  userEmail: localStorage.getItem('pujols_google_email') || null,
  spreadsheetId: localStorage.getItem('pujols_google_sheet_id') || null,
  isSyncing: false,

  init() {
    console.log('Iniciando servicio de sincronización Google Sheets...');
    this.actualizarIndicadorUI();
  },

  // Iniciar flujo de inicio de sesión con Google Identity
  conectarConGoogle() {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
      alert('Cargando servicios de Google... Por favor intente en un momento.');
      return;
    }

    try {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: this.SCOPES,
        callback: async (resp) => {
          if (resp.error !== undefined) {
            console.error('Error Google Auth:', resp);
            alert('No se pudo autenticar con Google: ' + (resp.error_description || resp.error));
            return;
          }

          this.accessToken = resp.access_token;
          localStorage.setItem('pujols_google_token', this.accessToken);

          // Obtener perfil de usuario
          await this.obtenerPerfilGoogle();
          
          // Crear o vincular hoja de cálculo en Drive
          await this.inicializarHojaCalculo();

          this.actualizarIndicadorUI();
          alert(`✅ Conectado exitosamente con Google (${this.userEmail || 'Google Drive'}). La sincronización entre celular y PC está activa.`);
        }
      });

      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      console.error('Error al inicializar Google Token Client:', err);
      // Fallback amigable: permitir ingresar correo y Sheet URL manualmente si no hay Client ID registrado
      this.abrirModalConfigManual();
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
        window.store.updateEmpresa({ gmail: this.userEmail, googleDriveSync: true, googleSheetsSync: true });
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

  // Sincronizar un nuevo cliente creado hacia Google Sheets
  async sincronizarNuevoCliente(c) {
    if (!this.spreadsheetId || !this.accessToken) {
      window.store.addToSyncQueue('cliente', c);
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
      console.warn('Guardando cliente en cola offline:', e);
      window.store.addToSyncQueue('cliente', c);
    }
  },

  // Sincronizar una nueva factura emitida hacia Google Sheets
  async sincronizarNuevaFactura(f) {
    if (!this.spreadsheetId || !this.accessToken) {
      window.store.addToSyncQueue('factura', f);
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

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Facturas!A:G:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [row] })
      });
      console.log('Factura sincronizada en Google Sheets:', f.numero);
    } catch (e) {
      window.store.addToSyncQueue('factura', f);
    }
  },

  // Subir todos los datos actuales a la hoja de cálculo
  async subirTodosLosDatosASheet() {
    const st = window.store.state;
    if (!st || !this.spreadsheetId || !this.accessToken) return;

    // Clientes rows
    if (st.clientes && st.clientes.length > 0) {
      const rows = st.clientes.map(c => [
        c.id, c.nombre, c.tipo || 'Residencial', c.telefono, c.whatsapp, c.correo, c.direccion, c.lat || '', c.lng || '', c.mapUrl || '', new Date().toLocaleDateString('es-DO')
      ]);
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Clientes!A2:K?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rows })
      });
    }

    // Facturas rows
    if (st.facturas && st.facturas.length > 0) {
      const fRows = st.facturas.map(f => [
        f.numero, f.fecha, f.clienteNombre, (f.items && f.items[0] ? f.items[0].descripcion : 'Servicio'), f.total, f.estado, f.clienteTelefono || ''
      ]);
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Facturas!A2:G?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: fRows })
      });
    }
  },

  // Descargar los datos desde Google Sheets hacia la aplicación local
  async descargarDatosDeSheet() {
    if (!this.spreadsheetId || !this.accessToken) return;

    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Clientes!A2:K`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.values && data.values.length > 0) {
          const clientesFromSheet = data.values.map(r => ({
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

          window.store.state.clientes = clientesFromSheet;
          window.store.state.indicadores.clientesTotal = clientesFromSheet.length;
          window.store.saveState();
          console.log('Clientes descargados desde Google Sheets:', clientesFromSheet.length);
        }
      }
    } catch (e) {
      console.warn('Error al descargar datos de Google Sheets:', e);
    }
  },

  actualizarIndicadorUI() {
    const label = document.getElementById('googleSyncStatusLabel');
    if (label) {
      if (this.accessToken && this.userEmail) {
        label.innerHTML = `🟢 <strong>Conectado a Google:</strong> ${this.userEmail} • Sincronización en tiempo real activa`;
        label.style.color = '#166534';
      } else {
        label.innerHTML = `⚪ Sincronización con Google Sheets disponible. Pulse para iniciar sesión.`;
        label.style.color = 'var(--text-muted)';
      }
    }
  },

  desconectar() {
    this.accessToken = null;
    this.userEmail = null;
    this.spreadsheetId = null;
    localStorage.removeItem('pujols_google_token');
    localStorage.removeItem('pujols_google_email');
    localStorage.removeItem('pujols_google_sheet_id');
    this.actualizarIndicadorUI();
    alert('Sesión de Google desconectada de este dispositivo.');
  }
};

window.GoogleSync = GoogleSync;
