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
    this.actualizarFechaCabecera();
    this.navigate('inicio');
    this.updateNavBadges();

    // 3. Suscribirse a cambios del store para re-renderizar la pantalla activa si es necesario
    if (window.store && typeof window.store.subscribe === 'function') {
      window.store.subscribe(() => {
        this.refreshCurrentScreen();
        this.updateNavBadges();
      });
    }

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

    // 8. Verificar si se abrió desde el QR de la factura (Encuesta de Satisfacción e Instagram)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('encuesta') === '1') {
      const facNo = urlParams.get('factura') || '';
      setTimeout(() => {
        this.mostrarModalEncuestaSatisfaccion(facNo);
      }, 400);
    }
  },

  mostrarModalEncuestaSatisfaccion(facturaNo = '') {
    const existing = document.getElementById('modalEncuestaSatisfaccion');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'modalEncuestaSatisfaccion';
    modal.className = 'modal-backdrop open';
    modal.style.zIndex = '1200';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 480px; text-align: center; border-radius: 16px; overflow: hidden; padding: 0;">
        <div style="background: linear-gradient(135deg, #0A2540 0%, #00AEEF 100%); padding: 24px 20px; color: #FFFFFF;">
          <img src="assets/logo.jpg" alt="PUJOLS Servicios" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #FFFFFF; margin-bottom: 10px; background: #FFF;">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px; color: #FFF;">¿Qué tal fue tu experiencia hoy?</h2>
          <p style="font-size: 13px; opacity: 0.9; margin: 0;">PUJOLS Servicios • Aire y Refrigeración</p>
          ${facturaNo ? `<span style="display: inline-block; background: rgba(255,255,255,0.25); padding: 3px 12px; border-radius: 12px; font-size: 11.5px; font-weight: 600; margin-top: 8px;">Comprobante / Factura ${facturaNo}</span>` : ''}
        </div>

        <div class="modal-body" style="padding: 22px 18px;">
          <p style="font-size: 14px; color: #334155; margin-bottom: 12px; font-weight: 600;">
            Califica la calidad de nuestro servicio técnico:
          </p>

          <!-- 5 Estrellas Interactivas -->
          <div id="starsRatingContainer" style="display: flex; justify-content: center; gap: 10px; font-size: 38px; cursor: pointer; margin-bottom: 20px;">
            <span onclick="App.setRating(1)" class="star-item" style="color: #FBBF24;">★</span>
            <span onclick="App.setRating(2)" class="star-item" style="color: #FBBF24;">★</span>
            <span onclick="App.setRating(3)" class="star-item" style="color: #FBBF24;">★</span>
            <span onclick="App.setRating(4)" class="star-item" style="color: #FBBF24;">★</span>
            <span onclick="App.setRating(5)" class="star-item" style="color: #FBBF24;">★</span>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; margin-bottom: 14px;">
            <p style="font-size: 12.5px; color: #475569; margin-bottom: 12px; line-height: 1.4;">
              ¡Tu testimonio es muy valioso para George Pujols y todo el equipo de PUJOLS Servicios! Déjanos un comentario o reseña en nuestras redes oficiales:
            </p>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <!-- Botón Instagram -->
              <a href="https://www.instagram.com/pujols_servicios/" target="_blank" class="btn" style="background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF); color: #FFFFFF; font-weight: 700; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 11px; border-radius: 10px;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                📸 Comentar en Instagram @pujols_servicios
              </a>

              <!-- Botón Facebook -->
              <a href="https://www.facebook.com/search/top?q=Pujols%20servicios" target="_blank" class="btn" style="background: #1877F2; color: #FFFFFF; font-weight: 700; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 11px; border-radius: 10px;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                📘 Comentar en Facebook (Pujols Servicios)
              </a>

              <!-- Botón WhatsApp -->
              <a href="https://wa.me/18297254450?text=${encodeURIComponent('Hola George Pujols / PUJOLS Servicios, quiero felicitarles y dejar mi testimonio por el excelente trabajo en mi factura ' + facturaNo)}" target="_blank" class="btn" style="background: #25D366; color: #FFFFFF; font-weight: 700; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 11px; border-radius: 10px;">
                💬 Enviar mensaje por WhatsApp (829-725-4450)
              </a>

              <!-- Botón Llamar -->
              <a href="tel:8297254450" class="btn" style="background: #0A2540; color: #FFFFFF; font-weight: 700; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 11px; border-radius: 10px;">
                📞 Llamar a PUJOLS Servicios (829-725-4450)
              </a>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: center; background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 14px;">
          <button class="btn btn-outline" onclick="document.getElementById('modalEncuestaSatisfaccion').remove(); window.history.replaceState({}, document.title, window.location.pathname);">
            Volver a la aplicación
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  setRating(stars) {
    const container = document.getElementById('starsRatingContainer');
    if (container) {
      const starSpans = container.querySelectorAll('.star-item');
      starSpans.forEach((s, idx) => {
        s.style.color = idx < stars ? '#FBBF24' : '#CBD5E1';
      });
    }
  },

  actualizarFechaCabecera() {
    const headerMonth = document.getElementById('headerCurrentMonth');
    if (headerMonth && window.DateUtil) {
      headerMonth.textContent = window.DateUtil.getCurrentMonthYearText();
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
    this.updateNavBadges();

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
    this.updateNavBadges();
    const container = document.getElementById(`view-${this.currentScreen}`);
    if (container) {
      this.renderModule(this.currentScreen, container);
    }
  },

  updateNavBadges() {
    const badge = document.getElementById('navBadgeClientes');
    if (!badge) return;
    const count = (window.store && window.store.getClientes) ? window.store.getClientes().length : 0;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
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
      fechaInput.value = window.DateUtil ? window.DateUtil.getISODate() : new Date().toISOString().split('T')[0];
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

    const fechaRegInput = document.getElementById('clienteFechaRegistro');
    if (fechaRegInput) {
      fechaRegInput.value = window.DateUtil ? window.DateUtil.getISODate() : new Date().toISOString().split('T')[0];
    }
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
    const fechaRegistro = document.getElementById('clienteFechaRegistro') ? document.getElementById('clienteFechaRegistro').value : null;

    if (!nombre) {
      alert('Por favor ingrese el nombre del cliente.');
      return;
    }

    const newCliente = window.store.addCliente({
      nombre,
      tipo,
      telefono: window.PhoneUtil ? window.PhoneUtil.normalizeLocal(telefono) : telefono,
      whatsapp: window.PhoneUtil ? window.PhoneUtil.normalizeLocal(whatsapp) : whatsapp,
      direccion,
      lat,
      lng,
      correo,
      fechaRegistro: fechaRegistro || (window.DateUtil ? window.DateUtil.getISODate() : null)
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
    const fechaInstInput = document.getElementById('equipoFechaInstalacion');
    if (fechaInstInput) {
      fechaInstInput.value = window.DateUtil ? window.DateUtil.getISODate() : new Date().toISOString().split('T')[0];
    }
    const proxMantInput = document.getElementById('equipoProximoMantenimiento');
    if (proxMantInput) {
      proxMantInput.value = window.DateUtil ? window.DateUtil.calcularFechaMeses(3) : '';
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
    const proximoMantenimiento = document.getElementById('equipoProximoMantenimiento') ? document.getElementById('equipoProximoMantenimiento').value : '';

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
      fechaInstalacion,
      proximoMantenimiento: proximoMantenimiento || (window.DateUtil ? window.DateUtil.calcularFechaMeses(3, fechaInstalacion) : '')
    });

    this.closeModal('modalNuevoEquipo');
    this.navigate('equipos');
    alert('Equipo registrado y asociado al cliente.');
  },

  // Formulario: Generar Factura
  setupGenerarFacturaForm(context = {}) {
    const form = document.getElementById('formGenerarFactura');
    if (form) form.reset();

    const clientes = (window.store && window.store.getClientes) ? (window.store.getClientes() || []) : [];
    const select = document.getElementById('facturaClienteSelect');
    if (select) {
      select.innerHTML = `
        <option value="">Seleccione el cliente...</option>
        ${clientes.map(c => `
          <option value="${c.id}" ${context.clienteId === c.id ? 'selected' : ''}>
            ${c.nombre}
          </option>
        `).join('')}
        <option value="__nuevo__">➕ Cliente nuevo (escribir nombre)</option>
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

    this.onFacturaClienteChange(select ? select.value : '');
  },

  // Al elegir el cliente, cargar automáticamente su teléfono/WhatsApp para poder enviarle la factura
  onFacturaClienteChange(clienteId) {
    const nuevoFields = document.getElementById('facturaNuevoClienteFields');
    const telInput = document.getElementById('facturaClienteTelefono');
    if (nuevoFields) nuevoFields.style.display = (clienteId === '__nuevo__') ? 'block' : 'none';
    if (!telInput) return;

    if (clienteId && clienteId !== '__nuevo__' && window.store && window.store.getClienteById) {
      const c = window.store.getClienteById(clienteId);
      telInput.value = c ? (c.whatsapp || c.telefono || '') : '';
    } else {
      telInput.value = '';
    }
  },

  submitGenerarFactura(event) {
    event.preventDefault();
    let clienteId = document.getElementById('facturaClienteSelect').value;
    const concepto = document.getElementById('facturaConcepto').value;
    const monto = Number(document.getElementById('facturaMonto').value) || 0;
    const estado = document.getElementById('facturaEstado').value;
    const telInput = document.getElementById('facturaClienteTelefono');
    const telefono = telInput ? telInput.value.trim() : '';

    if (!clienteId || monto <= 0) {
      alert('Por favor complete el cliente y un monto válido.');
      return;
    }

    // Registrar cliente nuevo directamente desde la factura
    if (clienteId === '__nuevo__') {
      const nombreNuevo = (document.getElementById('facturaNuevoClienteNombre').value || '').trim();
      const dirNuevo = (document.getElementById('facturaNuevoClienteDireccion').value || '').trim();
      if (!nombreNuevo) {
        alert('Por favor escriba el nombre del cliente nuevo.');
        return;
      }
      const nuevo = window.store.addCliente({
        nombre: nombreNuevo,
        telefono: telefono,
        whatsapp: telefono,
        direccion: dirNuevo || 'Santo Domingo, RD'
      });
      clienteId = nuevo.id;
    } else if (telefono && window.store.getClienteById) {
      // Si el cliente existente no tenía teléfono (o cambió), guardarlo para futuros envíos
      const c = window.store.getClienteById(clienteId);
      const norm = window.PhoneUtil ? window.PhoneUtil.normalizeLocal(telefono) : telefono;
      if (c && (c.whatsapp || c.telefono || '') !== norm && window.store.updateCliente) {
        window.store.updateCliente(clienteId, { telefono: c.telefono || norm, whatsapp: norm });
      }
    }

    const newFac = window.store.addFactura({
      clienteId,
      concepto,
      total: monto,
      estado,
      clienteTelefono: telefono
    });

    this.closeModal('modalGenerarFactura');
    this.navigate('facturacion');
    // Abrir de inmediato la factura con los botones de enviar por WhatsApp / PDF y el código QR
    setTimeout(() => {
      FacturacionModule.openInvoicePreview(newFac.numero);
    }, 150);
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
    // 1. Registrar Service Worker y forzar actualizaci?n si hay nueva versi?n
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('Service Worker de PUJOLS Servicios registrado con alcance:', reg.scope);
            reg.update(); // Forzar chequeo de nueva versi?n de sw.js inmediatamente
          })
          .catch(err => {
            console.warn('Error al registrar Service Worker:', err);
          });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Si el Service Worker fue reemplazado por uno nuevo, recargar en silencio para usar la versi?n fresca
          console.log('Nueva versi?n de la app activada');
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
