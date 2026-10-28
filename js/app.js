// PUJOLS Servicios - Aplicación Principal y Enrutador
// Control de navegación, modales y lógica PWA

const App = {
  currentScreen: 'inicio',
  deferredInstallPrompt: null,

  init() {
    console.log('Iniciando PUJOLS Servicios App...');

    // 1. Inicializar autenticación / login si no ha iniciado sesión
    if (!AuthModule.isLoggedIn()) {
      const loginOverlay = document.getElementById('loginOverlay');
      if (loginOverlay) {
        AuthModule.renderLoginScreen(loginOverlay);
        loginOverlay.style.display = 'flex';
      }
    }

    // 2. Cargar pantalla inicial
    this.navigate('inicio');

    // 3. Suscribirse a cambios del store para re-renderizar la pantalla activa si es necesario
    window.store.subscribe(() => {
      this.refreshCurrentScreen();
    });

    // 4. Inicializar eventos de navegación y menú móvil
    this.setupNavigationEvents();

    // 5. Configurar PWA Service Worker e instalación
    this.setupPWA();

    // 6. Monitoreo de conexión a Internet y sincronización offline
    this.setupOfflineSyncListeners();

    // 7. Inicializar Google Identity & Sheets Sync
    if (window.GoogleSync) {
      window.GoogleSync.init();
    }
  },

  setupOfflineSyncListeners() {
    window.addEventListener('offline', () => {
      const banner = document.getElementById('offlineNoticeBanner');
      if (banner) banner.style.display = 'block';
      const success = document.getElementById('onlineSyncSuccessBanner');
      if (success) success.style.display = 'none';
    });

    window.addEventListener('online', () => {
      const banner = document.getElementById('offlineNoticeBanner');
      if (banner) banner.style.display = 'none';
      const count = window.store.procesarColaSincronizacion();
      const success = document.getElementById('onlineSyncSuccessBanner');
      if (success) {
        success.innerText = count > 0 
          ? `✅ Conexión a internet restablecida: ${count} registro(s) pendientes sincronizados automáticamente con Google Sheets y Drive.`
          : `✅ Conexión a internet activa: Sincronización en línea habilitada con Google Drive.`;
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 6000);
      }
    });
  },

  navigate(screenName, params = {}) {
    this.currentScreen = screenName;

    // Actualizar sidebar desktop
    document.querySelectorAll('.app-sidebar .nav-item').forEach(item => {
      const target = item.getAttribute('data-screen');
      if (target === screenName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Actualizar bottom nav móvil
    document.querySelectorAll('.bottom-nav .bottom-nav-item').forEach(item => {
      const target = item.getAttribute('data-screen');
      if (target === screenName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Ocultar todas las vistas y mostrar la activa
    document.querySelectorAll('.view-section').forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${screenName}`);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Actualizar títulos en el encabezado
    this.updateHeaderTitles(screenName);

    // Renderizar módulo correspondiente
    this.renderModule(screenName, activeView, params);

    // Cerrar drawer móvil si está abierto
    this.closeMobileDrawer();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateHeaderTitles(screenName) {
    const titleEl = document.getElementById('headerTitle');
    const subEl = document.getElementById('headerSubtitle');

    const meta = {
      inicio: { title: 'PUJOLS Servicios', sub: 'Panel de Control y Resumen General' },
      clientes: { title: 'Clientes y equipos', sub: 'Directorio y gestión de cuentas' },
      equipos: { title: 'Equipos Registrados', sub: 'Aires acondicionados, neveras y lavadoras' },
      servicios: { title: 'Servicios, agenda y órdenes', sub: 'Programación de técnicos y visitas' },
      facturacion: { title: 'Facturas', sub: 'Historial y comprobantes de pago' },
      finanzas: { title: 'Finanzas', sub: 'Ingresos, egresos y rentabilidad' },
      recordatorios: { title: 'Recordatorios', sub: 'Mantenimientos preventivos y WhatsApp' },
      configuracion: { title: 'Configuración', sub: 'Datos de la empresa y preferencias' }
    };

    const cur = meta[screenName] || meta.inicio;
    if (titleEl) titleEl.innerText = cur.title;
    if (subEl) subEl.innerText = cur.sub;
  },

  renderModule(screenName, container, params) {
    if (!container) return;

    switch (screenName) {
      case 'inicio':
        DashboardModule.render(container);
        break;
      case 'clientes':
        ClientesModule.render(container);
        break;
      case 'equipos':
        EquiposModule.render(container);
        break;
      case 'servicios':
        ServiciosModule.render(container);
        break;
      case 'facturacion':
        FacturacionModule.render(container);
        break;
      case 'finanzas':
        FinanzasModule.render(container);
        break;
      case 'recordatorios':
        RecordatoriosModule.render(container);
        break;
      case 'configuracion':
        ConfiguracionModule.render(container);
        break;
      default:
        DashboardModule.render(container);
    }
  },

  refreshCurrentScreen() {
    const container = document.getElementById(`view-${this.currentScreen}`);
    if (container) {
      this.renderModule(this.currentScreen, container);
    }
  },

  // ==========================================================================
  // MENÚ MÓVIL Y DRAWER
  // ==========================================================================
  setupNavigationEvents() {
    const menuBtn = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('drawerBackdrop');

    if (menuBtn && sidebar && backdrop) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        backdrop.classList.add('active');
      });

      backdrop.addEventListener('click', () => {
        this.closeMobileDrawer();
      });
    }
  },

  closeMobileDrawer() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('drawerBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  },

  // ==========================================================================
  // GESTIÓN DE MODALES
  // ==========================================================================
  openModal(modalId, context = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'modalNuevaOrden') {
      this.setupNuevaOrdenForm(context);
    } else if (modalId === 'modalNuevoCliente') {
      this.setupNuevoClienteForm();
    } else if (modalId === 'modalNuevoEquipo') {
      this.setupNuevoEquipoForm(context);
    } else if (modalId === 'modalGenerarFactura') {
      this.setupGenerarFacturaForm(context);
    } else if (modalId === 'modalNuevaTransaccion') {
      this.setupNuevaTransaccionForm();
    }

    modal.classList.add('open');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  },

  // Formulario: Nueva Orden de Servicio (Fiel al mockup Vista móvil - Nueva orden)
  setupNuevaOrdenForm(context = {}) {
    const clientes = window.store.getClientes();
    const clienteSelect = document.getElementById('ordenClienteSelect');
    const equipoSelect = document.getElementById('ordenEquipoSelect');

    if (clienteSelect) {
      clienteSelect.innerHTML = `
        <option value="">Seleccione un cliente...</option>
        ${clientes.map(c => `
          <option value="${c.id}" ${context.clienteId === c.id ? 'selected' : ''}>
            ${c.nombre} (${c.telefono})
          </option>
        `).join('')}
      `;

      clienteSelect.onchange = (e) => {
        this.updateEquiposDropdown(e.target.value);
      };
    }

    const initialClientId = context.clienteId || (clientes[0] ? clientes[0].id : '');
    if (clienteSelect && initialClientId) {
      clienteSelect.value = initialClientId;
      this.updateEquiposDropdown(initialClientId, context.equipoId);
    }

    // Reset service type pills
    window.selectedTipoServicio = 'Mantenimiento';
    document.querySelectorAll('.service-type-option').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-type') === 'Mantenimiento');
    });

    const fechaInput = document.getElementById('ordenFecha');
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().split('T')[0];
    }
  },

  updateEquiposDropdown(clienteId, selectedEquipoId = null) {
    const equipoSelect = document.getElementById('ordenEquipoSelect');
    if (!equipoSelect) return;

    const equipos = window.store.getEquiposByCliente(clienteId);
    let optionsHtml = '';

    if (equipos.length > 0) {
      optionsHtml = equipos.map(eq => {
        let icon = '❄️';
        const t = (eq.tipo || '').toLowerCase();
        if (t.includes('nevera') || t.includes('refrig')) icon = '🧊';
        else if (t.includes('lavadora')) icon = '🧺';
        return `
          <option value="${eq.id}" ${selectedEquipoId === eq.id ? 'selected' : ''}>
            ${icon} ${eq.tipo} - ${eq.capacidad} (${eq.ubicacion})
          </option>
        `;
      }).join('');
    } else {
      optionsHtml = `<option value="">No hay equipos registrados previamente para este cliente</option>`;
    }

    // Opción explícita para registrar o especificar equipo directamente
    optionsHtml += `
      <option value="custom" ${selectedEquipoId === 'custom' ? 'selected' : ''}>
        ➕ + Registrar / Especificar otro equipo para esta orden
      </option>
    `;

    equipoSelect.innerHTML = optionsHtml;

    // Sincronizar estado del panel de configuración de equipo
    const panel = document.getElementById('ordenCustomEquipoPanel');
    if (panel) {
      panel.style.display = (equipoSelect.value === 'custom') ? 'block' : 'none';
    }
  },

  onOrdenEquipoChange(val) {
    const panel = document.getElementById('ordenCustomEquipoPanel');
    if (panel) {
      panel.style.display = (val === 'custom') ? 'block' : 'none';
    }
  },

  toggleCustomEquipoOrden() {
    const panel = document.getElementById('ordenCustomEquipoPanel');
    const equipoSelect = document.getElementById('ordenEquipoSelect');
    if (panel && equipoSelect) {
      if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        equipoSelect.value = 'custom';
      } else {
        panel.style.display = 'none';
        if (equipoSelect.options.length > 1) {
          equipoSelect.selectedIndex = 0;
        }
      }
    }
  },

  // Controles de Equipos en Nueva Orden
  setOrdenTipoEquipo(tipo) {
    window.ordenCustomTipo = tipo;
    document.querySelectorAll('#pillsTipoEquipoOrden .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === tipo);
    });

    const subAire = document.getElementById('subpanelAireOrden');
    const subNev = document.getElementById('subpanelNeveraOrden');
    const subLav = document.getElementById('subpanelLavadoraOrden');

    if (subAire) subAire.style.display = (tipo === 'Aire Acondicionado') ? 'block' : 'none';
    if (subNev) subNev.style.display = (tipo === 'Nevera') ? 'block' : 'none';
    if (subLav) subLav.style.display = (tipo === 'Lavadora') ? 'block' : 'none';
  },

  setCapacidadAireOrden(btu) {
    window.ordenCapacidadAire = btu;
    document.querySelectorAll('#pillsCapacidadAireOrden .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === btu);
    });

    const customInput = document.getElementById('customAireBtuInputOrden');
    if (customInput) {
      if (btu === 'otro') {
        customInput.style.display = 'block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
      }
    }
  },

  setSubtipoAireOrden(sub) {
    window.ordenSubtipoAire = sub;
    document.querySelectorAll('#pillsSubtipoAireOrden .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === sub);
    });
  },

  setTipoNeveraOrden(tipo) {
    window.ordenTipoNevera = tipo;
    document.querySelectorAll('#pillsTipoNeveraOrden .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === tipo);
    });

    const customInput = document.getElementById('customNeveraTipoInputOrden');
    if (customInput) {
      if (tipo === 'otro') {
        customInput.style.display = 'block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
      }
    }
  },

  setCapacidadNeveraOrden(cap) {
    window.ordenCapacidadNevera = cap;
    document.querySelectorAll('#pillsCapacidadNeveraOrden .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === cap);
    });

    const customInput = document.getElementById('customNeveraCapInputOrden');
    if (customInput) {
      if (cap === 'otro') {
        customInput.style.display = 'block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
      }
    }
  },

  setTipoLavadoraOrden(tipo) {
    window.ordenTipoLavadora = tipo;
    document.querySelectorAll('#pillsTipoLavadoraOrden .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === tipo);
    });

    const customInput = document.getElementById('customLavadoraTipoInputOrden');
    if (customInput) {
      if (tipo === 'otro') {
        customInput.style.display = 'block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
      }
    }
  },

  setCapacidadLavadoraOrden(cap) {
    window.ordenCapacidadLavadora = cap;
    document.querySelectorAll('#pillsCapacidadLavadoraOrden .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === cap);
    });

    const customInput = document.getElementById('customLavadoraCapInputOrden');
    if (customInput) {
      if (cap === 'otro') {
        customInput.style.display = 'block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
      }
    }
  },

  selectServiceType(type) {
    window.selectedTipoServicio = type;
    document.querySelectorAll('.service-type-option').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-type') === type);
    });
  },

  submitNuevaOrden(event) {
    event.preventDefault();
    const clienteId = document.getElementById('ordenClienteSelect').value;
    let equipoId = document.getElementById('ordenEquipoSelect').value;
    const fecha = document.getElementById('ordenFecha').value;
    const hora = document.getElementById('ordenHora').value;
    const descripcion = document.getElementById('ordenDescripcion').value;
    const tecnico = document.getElementById('ordenTecnico').value;

    if (!clienteId) {
      alert('Por favor seleccione un cliente.');
      return;
    }

    const panel = document.getElementById('ordenCustomEquipoPanel');
    const isCustom = equipoId === 'custom' || (panel && panel.style.display === 'block');

    if (isCustom) {
      // Registrar nuevo equipo especificado por el usuario
      const tipo = window.ordenCustomTipo || 'Aire Acondicionado';
      let capacidad = '12,000 BTU';
      let subtipo = 'Inverter';

      if (tipo === 'Aire Acondicionado') {
        capacidad = window.ordenCapacidadAire || '12,000 BTU';
        if (capacidad === 'otro') {
          capacidad = document.getElementById('customAireBtuInputOrden').value || '12,000 BTU';
        }
        subtipo = window.ordenSubtipoAire || 'Inverter';
      } else if (tipo === 'Nevera') {
        subtipo = window.ordenTipoNevera || 'No Frost';
        if (subtipo === 'otro') {
          subtipo = document.getElementById('customNeveraTipoInputOrden').value || 'Nevera Especial';
        }
        capacidad = window.ordenCapacidadNevera || '18 Pies Cúbicos';
        if (capacidad === 'otro') {
          capacidad = document.getElementById('customNeveraCapInputOrden').value || '18 Pies Cúbicos';
        }
      } else if (tipo === 'Lavadora') {
        subtipo = window.ordenTipoLavadora || 'Carga Superior';
        if (subtipo === 'otro') {
          subtipo = document.getElementById('customLavadoraTipoInputOrden').value || 'Lavadora Automática';
        }
        capacidad = window.ordenCapacidadLavadora || '18 Kg (40 lbs)';
        if (capacidad === 'otro') {
          capacidad = document.getElementById('customLavadoraCapInputOrden').value || '18 Kg';
        }
      }

      const ubicacion = document.getElementById('customEquipoUbicacionOrden').value || 'Principal';
      const marca = document.getElementById('customEquipoMarcaOrden').value || 'Estándar';

      // Agregar equipo al store para que quede registrado con el cliente
      const newEq = window.store.addEquipo({
        clienteId,
        tipo,
        subtipo,
        capacidad,
        marca,
        ubicacion,
        modelo: 'Serie 2025'
      });

      equipoId = newEq.id;
    }

    window.store.addServicio({
      clienteId,
      equipoId,
      tipo: window.selectedTipoServicio || 'Mantenimiento',
      fecha,
      hora,
      descripcion,
      tecnico
    });

    this.closeModal('modalNuevaOrden');
    this.navigate('servicios');
    alert('Orden de servicio creada con éxito.');
  },

  // ==========================================================================
  // CONTROLES DE REGISTRO EN MODAL NUEVO EQUIPO
  // ==========================================================================
  setNuevoEquipoTipo(tipo) {
    const inputTipo = document.getElementById('equipoTipo');
    if (inputTipo) inputTipo.value = tipo;

    document.querySelectorAll('#pillsModalNuevoEquipoTipo .quick-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === tipo);
    });

    const subAire = document.getElementById('subseccionNuevoAire');
    const subNev = document.getElementById('subseccionNuevaNevera');
    const subLav = document.getElementById('subseccionNuevaLavadora');

    if (subAire) subAire.style.display = (tipo === 'Aire Acondicionado') ? 'block' : 'none';
    if (subNev) subNev.style.display = (tipo === 'Nevera') ? 'block' : 'none';
    if (subLav) subLav.style.display = (tipo === 'Lavadora') ? 'block' : 'none';

    // Establecer valores sugeridos por defecto
    if (tipo === 'Aire Acondicionado') {
      document.getElementById('equipoCapacidad').value = '12,000 BTU';
      document.getElementById('equipoSubtipo').value = 'Inverter';
      document.getElementById('equipoMarca').value = 'Carrier';
      document.getElementById('equipoUbicacion').value = 'Sala principal';
    } else if (tipo === 'Nevera') {
      document.getElementById('equipoCapacidad').value = '18 Pies Cúbicos';
      document.getElementById('equipoSubtipo').value = 'No Frost';
      document.getElementById('equipoMarca').value = 'Whirlpool';
      document.getElementById('equipoUbicacion').value = 'Cocina';
    } else if (tipo === 'Lavadora') {
      document.getElementById('equipoCapacidad').value = '18 Kg (40 lbs)';
      document.getElementById('equipoSubtipo').value = 'Carga Superior';
      document.getElementById('equipoMarca').value = 'LG Smart';
      document.getElementById('equipoUbicacion').value = 'Área de Lavado';
    }
  },

  setNuevoEquipoCapacidad(cap, btnElement) {
    if (btnElement) {
      btnElement.parentElement.querySelectorAll('.quick-pill-btn').forEach(b => b.classList.remove('active'));
      btnElement.classList.add('active');
    }
    const input = document.getElementById('equipoCapacidad');
    if (input) {
      if (cap === 'otro') {
        input.value = '';
        input.placeholder = 'Escriba la capacidad personalizada (ej: 9,000 BTU)';
        input.focus();
      } else {
        input.value = cap;
      }
    }
  },

  setNuevoEquipoSubtipo(sub, btnElement) {
    if (btnElement) {
      btnElement.parentElement.querySelectorAll('.quick-pill-btn').forEach(b => b.classList.remove('active'));
      btnElement.classList.add('active');
    }
    const input = document.getElementById('equipoSubtipo');
    if (input) input.value = sub;
  },

  // Formulario: Nuevo Cliente
  setupNuevoClienteForm() {
    const form = document.getElementById('formNuevoCliente');
    if (form) form.reset();
    const statusEl = document.getElementById('gpsStatusCliente');
    if (statusEl) {
      statusEl.innerHTML = 'Presione para detectar y guardar las coordenadas satelitales del cliente.';
    }
    const latInput = document.getElementById('clienteLat');
    const lngInput = document.getElementById('clienteLng');
    if (latInput) latInput.value = '';
    if (lngInput) lngInput.value = '';
  },

  capturarGpsCliente() {
    const statusEl = document.getElementById('gpsStatusCliente');
    const latInput = document.getElementById('clienteLat');
    const lngInput = document.getElementById('clienteLng');

    if (!navigator.geolocation) {
      if (statusEl) statusEl.innerHTML = `<span style="color: var(--color-danger);">⚠️ Su navegador no tiene acceso a GPS.</span>`;
      return;
    }

    if (statusEl) statusEl.innerHTML = `<span>⏳ Obteniendo coordenadas satelitales del cliente...</span>`;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: var(--color-success); font-weight: 700;">✅ Coordenadas GPS guardadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>`;
        }
      },
      (err) => {
        // Coordenadas de prueba en Santo Domingo si el usuario deniega o está en PC sin chip GPS
        const demoLat = 18.4735;
        const demoLng = -69.9360;
        if (latInput) latInput.value = demoLat;
        if (lngInput) lngInput.value = demoLng;
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: #0284C7; font-weight: 700;">📍 GPS de referencia registrado (${demoLat}, ${demoLng})</span>`;
        }
      },
      { timeout: 8000 }
    );
  },

  submitNuevoCliente(event) {
    event.preventDefault();
    const nombre = document.getElementById('clienteNombre').value;
    const tipo = document.getElementById('clienteTipo').value;
    const telefono = document.getElementById('clienteTelefono').value;
    const whatsapp = document.getElementById('clienteWhatsapp').value || telefono;
    const direccion = document.getElementById('clienteDireccion').value;
    const correo = document.getElementById('clienteCorreo').value;
    const lat = document.getElementById('clienteLat').value ? Number(document.getElementById('clienteLat').value) : null;
    const lng = document.getElementById('clienteLng').value ? Number(document.getElementById('clienteLng').value) : null;

    if (!nombre) {
      alert('Por favor ingrese el nombre del cliente.');
      return;
    }

    const newCliente = window.store.addCliente({
      nombre,
      tipo,
      telefono,
      whatsapp,
      direccion,
      lat,
      lng,
      correo
    });

    this.closeModal('modalNuevoCliente');
    this.navigate('clientes');
    alert(`Cliente ${newCliente.nombre} registrado con éxito.`);
  },

  // Formulario: Nuevo Equipo
  setupNuevoEquipoForm(context = {}) {
    const clientes = window.store.getClientes();
    const select = document.getElementById('equipoClienteSelect');
    if (select) {
      select.innerHTML = `
        <option value="">Seleccione el cliente dueño...</option>
        ${clientes.map(c => `
          <option value="${c.id}" ${context.clienteId === c.id ? 'selected' : ''}>
            ${c.nombre} (${c.direccion})
          </option>
        `).join('')}
      `;
    }
  },

  submitNuevoEquipo(event) {
    event.preventDefault();
    const clienteId = document.getElementById('equipoClienteSelect').value;
    const tipo = document.getElementById('equipoTipo').value;
    const subtipo = document.getElementById('equipoSubtipo').value;
    const marca = document.getElementById('equipoMarca').value;
    const modelo = document.getElementById('equipoModelo').value;
    const capacidad = document.getElementById('equipoCapacidad').value;
    const ubicacion = document.getElementById('equipoUbicacion').value;
    const fechaInstalacion = document.getElementById('equipoFechaInstalacion').value;

    if (!clienteId) {
      alert('Por favor seleccione un cliente.');
      return;
    }

    window.store.addEquipo({
      clienteId,
      tipo,
      subtipo,
      marca,
      modelo,
      capacidad,
      ubicacion,
      fechaInstalacion
    });

    this.closeModal('modalNuevoEquipo');
    this.navigate('equipos');
    alert('Equipo registrado y asociado al cliente.');
  },

  // Formulario: Generar Factura
  setupGenerarFacturaForm(context = {}) {
    const clientes = window.store.getClientes();
    const select = document.getElementById('facturaClienteSelect');
    if (select) {
      select.innerHTML = `
        <option value="">Seleccione el cliente...</option>
        ${clientes.map(c => `
          <option value="${c.id}" ${context.clienteId === c.id ? 'selected' : ''}>
            ${c.nombre}
          </option>
        `).join('')}
      `;
    }

    if (context.monto) {
      const montoInput = document.getElementById('facturaMonto');
      if (montoInput) montoInput.value = context.monto;
    }

    if (context.concepto) {
      const descInput = document.getElementById('facturaConcepto');
      if (descInput) descInput.value = context.concepto;
    }
  },

  submitGenerarFactura(event) {
    event.preventDefault();
    const clienteId = document.getElementById('facturaClienteSelect').value;
    const concepto = document.getElementById('facturaConcepto').value;
    const monto = Number(document.getElementById('facturaMonto').value) || 0;
    const estado = document.getElementById('facturaEstado').value;

    if (!clienteId || monto <= 0) {
      alert('Por favor complete el cliente y un monto válido.');
      return;
    }

    const newFac = window.store.addFactura({
      clienteId,
      concepto,
      total: monto,
      estado
    });

    this.closeModal('modalGenerarFactura');
    this.navigate('facturacion');
    FacturacionModule.openInvoicePreview(newFac.numero);
  },

  // Formulario: Nueva Transacción (Finanzas)
  setupNuevaTransaccionForm() {
    const form = document.getElementById('formNuevaTransaccion');
    if (form) form.reset();
  },

  submitNuevaTransaccion(event) {
    event.preventDefault();
    const tipo = document.getElementById('txTipo').value;
    const concepto = document.getElementById('txConcepto').value;
    const categoria = document.getElementById('txCategoria').value;
    const monto = Number(document.getElementById('txMonto').value) || 0;

    if (!concepto || monto <= 0) {
      alert('Por favor ingrese el concepto y un monto válido.');
      return;
    }

    window.store.addTransaccion({
      tipo,
      concepto,
      categoria,
      monto
    });

    this.closeModal('modalNuevaTransaccion');
    this.navigate('finanzas');
    alert('Movimiento registrado en finanzas.');
  },

  // ==========================================================================
  // PWA (PROGRESSIVE WEB APP)
  // ==========================================================================
  setupPWA() {
    // 1. Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('Service Worker de PUJOLS Servicios registrado con alcance:', reg.scope);
          })
          .catch(err => {
            console.warn('Error al registrar Service Worker:', err);
          });
      });
    }

    // 2. Manejar evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      const installBtn = document.getElementById('btnInstallPWA');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    // 3. Manejar appinstalled
    window.addEventListener('appinstalled', () => {
      console.log('PUJOLS Servicios instalada como aplicación.');
      this.deferredInstallPrompt = null;
      const installBtn = document.getElementById('btnInstallPWA');
      if (installBtn) installBtn.style.display = 'none';
      alert('¡Gracias por instalar PUJOLS Servicios en tu dispositivo!');
    });
  },

  promptInstallPWA() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó instalar la PWA');
        } else {
          console.log('Usuario declinó la instalación');
        }
        this.deferredInstallPrompt = null;
      });
    } else {
      alert('Para instalar PUJOLS Servicios:\n\n• En Chrome/Edge PC: Haga clic en el ícono de instalación en la barra de direcciones.\n• En iPhone (Safari): Toque "Compartir" y seleccione "Agregar al inicio".\n• En Android: Toque los tres puntos del menú y elija "Instalar aplicación".');
    }
  }
};

window.App = App;

// Auto-arranque al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
