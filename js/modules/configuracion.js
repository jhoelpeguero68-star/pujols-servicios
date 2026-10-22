// PUJOLS Servicios - Módulo Configuración

const ConfiguracionModule = {
  render(container) {
    const empresa = window.store.getEmpresa();

    container.innerHTML = `
      <!-- Cabecera de Configuración -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Configuración</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Preferencias del sistema, datos del negocio e integraciones de demostración</p>
        </div>
      </div>

      <!-- Sección Mi Empresa (Idéntica al Mockup de Referencia) -->
      <div class="config-group">
        <div class="config-group-title">Mi empresa</div>

        <!-- PUJOLS Servicios -->
        <div class="config-item">
          <div class="config-item-left">
            <div class="config-icon" style="background: #E0F2FE; color: var(--color-secondary-blue);">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg></span>
            </div>
            <div>
              <div class="config-item-label">${empresa.nombre}</div>
              <div class="config-item-desc">${empresa.subtitulo} • ${empresa.rnc}</div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="ConfiguracionModule.abrirEditarEmpresa()">
            Editar
          </button>
        </div>

        <!-- Google Drive (Demo) -->
        <div class="config-item">
          <div class="config-item-left">
            <div class="config-icon" style="background: #E8F5E9; color: #2E7D32;">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg></span>
            </div>
            <div>
              <div class="config-item-label">Google Drive ${empresa.driveUrl || empresa.gmail ? '<span style="font-size:11px;background:#DCFCE7;color:#166534;padding:2px 7px;border-radius:20px;font-weight:700;margin-left:6px;">✓ Vinculado</span>' : ''}</div>
              <div class="config-item-desc">${empresa.gmail ? 'Cuenta: ' + empresa.gmail : 'Respaldo y guardado de facturas PDF en carpetas'}</div>
            </div>
          </div>
          <button class="btn btn-sm ${empresa.driveUrl || empresa.gmail ? 'btn-primary' : 'btn-outline'}" onclick="ConfiguracionModule.abrirConfigGoogle()">
            ${empresa.driveUrl || empresa.gmail ? 'Editar' : 'Configurar'}
          </button>
        </div>

        <!-- Google Sheets (Demo) -->
        <div class="config-item">
          <div class="config-item-left">
            <div class="config-icon" style="background: #E8F5E9; color: #1B5E20;">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></span>
            </div>
            <div>
              <div class="config-item-label">Google Sheets ${empresa.sheetsUrl || empresa.gmail ? '<span style="font-size:11px;background:#DCFCE7;color:#166534;padding:2px 7px;border-radius:20px;font-weight:700;margin-left:6px;">✓ Vinculado</span>' : ''}</div>
              <div class="config-item-desc">${empresa.whatsappNumero ? 'WhatsApp: ' + empresa.whatsappNumero + ' • ' : ''}Base de datos de clientes, servicios y finanzas</div>
            </div>
          </div>
          <button class="btn btn-sm ${empresa.sheetsUrl || empresa.gmail ? 'btn-primary' : 'btn-outline'}" onclick="ConfiguracionModule.abrirConfigGoogle()">
            ${empresa.sheetsUrl || empresa.gmail ? 'Editar' : 'Configurar'}
          </button>
        </div>

        <!-- Recordatorios -->
        <div class="config-item" onclick="App.navigate('recordatorios')" style="cursor: pointer;">
          <div class="config-item-left">
            <div class="config-icon" style="background: #FEF3C7; color: #D97706;">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg></span>
            </div>
            <div>
              <div class="config-item-label">Recordatorios</div>
              <div class="config-item-desc">Personalizar mensajes y ciclos de mantenimiento</div>
            </div>
          </div>
          <span class="icon" style="color: var(--text-light);"><svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg></span>
        </div>

        <!-- Sincronización -->
        <div class="config-item">
          <div class="config-item-left">
            <div class="config-icon" style="background: #F1F5F9; color: var(--color-primary);">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg></span>
            </div>
            <div>
              <div class="config-item-label">Sincronización</div>
              <div class="config-item-desc">Última: ${empresa.ultimaSincronizacion}</div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="ConfiguracionModule.sincronizarAhora()">
            Sincronizar
          </button>
        </div>

        <!-- Seguridad -->
        <div class="config-item">
          <div class="config-item-left">
            <div class="config-icon" style="background: #EDE9FE; color: #6D28D9;">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></span>
            </div>
            <div>
              <div class="config-item-label">Seguridad</div>
              <div class="config-item-desc">Cambiar contraseña y accesos de técnicos</div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="alert('Función de seguridad demostrativa. Puede cambiar su contraseña en cualquier momento.')">
            Cambiar
          </button>
        </div>

        <!-- Ayuda y soporte -->
        <div class="config-item">
          <div class="config-item-left">
            <div class="config-icon" style="background: #F0FDF4; color: #16A34A;">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg></span>
            </div>
            <div>
              <div class="config-item-label">Ayuda y soporte</div>
              <div class="config-item-desc">Centro de ayuda y manual de operación</div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="ConfiguracionModule.mostrarAyuda()">
            Ver guía
          </button>
        </div>
      </div>

      <!-- Opciones de Sistema y Demo -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">Mantenimiento de la Aplicación</div>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="App.promptInstallPWA()">
            📲 Instalar PUJOLS Servicios (PWA)
          </button>
          <button class="btn btn-outline" style="border-color: #EF4444; color: #DC2626;" onclick="ConfiguracionModule.limpiarParaProduccion()">
            🗑️ Limpiar datos de demostración (Empezar de cero)
          </button>
          <button class="btn btn-outline" onclick="ConfiguracionModule.restablecerDatos()">
            🔄 Restaurar datos de ejemplo
          </button>
          <button class="btn btn-navy" onclick="AuthModule.logout()">
            🔒 Cerrar Sesión
          </button>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 14px;">
          PUJOLS Servicios App v1.0.0 • Diseñada para instalación y servicio técnico de Aire Acondicionado, Neveras y Lavadoras.
        </div>
      </div>

      <!-- Modal Editar Empresa -->
      <div id="modalEditarEmpresa" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Datos de la Empresa</h3>
            <button class="modal-close-btn" onclick="ConfiguracionModule.cerrarEditarEmpresa()">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nombre Comercial:</label>
              <input type="text" id="cfgNombre" class="form-input" value="${empresa.nombre}">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">RNC / Cédula:</label>
                <input type="text" id="cfgRnc" class="form-input" value="${empresa.rnc}">
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono / WhatsApp:</label>
                <input type="text" id="cfgTelefono" class="form-input" value="${empresa.telefono}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Dirección Fiscal y Taller:</label>
              <input type="text" id="cfgDireccion" class="form-input" value="${empresa.direccion}">
            </div>
            <div class="form-group">
              <label class="form-label">Eslogan / Lema:</label>
              <input type="text" id="cfgLema" class="form-input" value="${empresa.lema}">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="ConfiguracionModule.cerrarEditarEmpresa()">Cancelar</button>
            <button class="btn btn-primary" onclick="ConfiguracionModule.guardarEmpresa()">Guardar Cambios</button>
          </div>
        </div>
      </div>
    `;
  },

  abrirEditarEmpresa() {
    const modal = document.getElementById('modalEditarEmpresa');
    if (modal) modal.classList.add('open');
  },

  cerrarEditarEmpresa() {
    const modal = document.getElementById('modalEditarEmpresa');
    if (modal) modal.classList.remove('open');
  },

  guardarEmpresa() {
    const nombre = document.getElementById('cfgNombre').value;
    const rnc = document.getElementById('cfgRnc').value;
    const telefono = document.getElementById('cfgTelefono').value;
    const direccion = document.getElementById('cfgDireccion').value;
    const lema = document.getElementById('cfgLema').value;

    window.store.updateEmpresa({ nombre, rnc, telefono, direccion, lema });
    this.cerrarEditarEmpresa();
    const container = document.getElementById('view-configuracion');
    if (container) this.render(container);
    alert('Datos de la empresa actualizados exitosamente.');
  },

  // ============================================================
  // Modal Configuración Google Drive / Sheets
  // ============================================================
  abrirConfigGoogle() {
    const empresa = window.store.getEmpresa();
    const existing = document.getElementById('modalConfigGoogle');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'modalConfigGoogle';
    modal.className = 'modal-backdrop open';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 520px;">
        <div class="modal-header">
          <h3 class="modal-title">⚙️ Configurar Google Drive &amp; Sheets</h3>
          <button class="modal-close-btn" onclick="document.getElementById('modalConfigGoogle').remove()">
            <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
          </button>
        </div>
        <div class="modal-body">

          <!-- Aviso demo -->
          <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 10px; padding: 12px 14px; margin-bottom: 18px; font-size: 13px; color: #92400E;">
            <strong>📌 Fase de demostración:</strong> Estos datos se guardan en el dispositivo. La conexión real con Google se activará en la versión de producción.
          </div>

          <div class="form-group">
            <label class="form-label">📧 Correo de Google (Gmail):</label>
            <input type="email" id="cfgGmail" class="form-input" placeholder="ejemplo@gmail.com"
              value="${empresa.gmail || ''}" />
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Con esta cuenta se vinculará Google Drive y Google Sheets.</div>
          </div>

          <div class="form-group">
            <label class="form-label">📱 Número de WhatsApp / teléfono:</label>
            <input type="tel" id="cfgWaNumero" class="form-input" placeholder="8095551234"
              value="${empresa.whatsappNumero || empresa.telefono || ''}" />
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Número con código de área, sin espacios ni guiones. Ej: 8095551234</div>
          </div>

          <div class="form-group">
            <label class="form-label">📊 URL de Google Sheets (base de datos):</label>
            <input type="url" id="cfgSheetsUrl" class="form-input" placeholder="https://docs.google.com/spreadsheets/d/..."
              value="${empresa.sheetsUrl || ''}" />
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Pegue aquí el enlace de su hoja de Google Sheets (debe ser pública o compartida con la cuenta de Google).</div>
          </div>

          <div class="form-group">
            <label class="form-label">📁 URL de carpeta en Google Drive:</label>
            <input type="url" id="cfgDriveUrl" class="form-input" placeholder="https://drive.google.com/drive/folders/..."
              value="${empresa.driveUrl || ''}" />
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Carpeta donde se guardarán las facturas en PDF por cliente.</div>
          </div>

          <!-- Estado de vinculación -->
          <div style="background: #F1F5F9; border-radius: 10px; padding: 12px 14px; margin-top: 6px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-primary); margin-bottom: 8px;">Estado de integración</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="font-size: 16px;">${empresa.gmail ? '✅' : '⚪'}</span>
                <span>Google Account: ${empresa.gmail ? '<strong>' + empresa.gmail + '</strong>' : 'No configurada'}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="font-size: 16px;">${empresa.sheetsUrl ? '✅' : '⚪'}</span>
                <span>Google Sheets: ${empresa.sheetsUrl ? 'Vinculado' : 'No vinculado'}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="font-size: 16px;">${empresa.driveUrl ? '✅' : '⚪'}</span>
                <span>Google Drive: ${empresa.driveUrl ? 'Vinculado' : 'No vinculado'}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="font-size: 16px;">ℹ️</span>
                <span style="color: var(--text-muted);">Última sincronización: ${empresa.ultimaSincronizacion || 'Nunca'}</span>
              </div>
            </div>
          </div>

          <!-- Cola offline -->
          <div id="colaOfflineInfo" style="margin-top: 12px;"></div>
        </div>
        <div class="modal-footer" style="flex-wrap: wrap; gap: 8px;">
          <button class="btn btn-outline" onclick="document.getElementById('modalConfigGoogle').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="ConfiguracionModule.guardarConfigGoogle()">💾 Guardar configuración</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Mostrar cola offline
    const cola = window.store.getColaSincronizacion ? window.store.getColaSincronizacion() : [];
    const colaDiv = modal.querySelector('#colaOfflineInfo');
    if (colaDiv && cola.length > 0) {
      colaDiv.innerHTML = `<div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;padding:10px 12px;font-size:12px;color:#92400E;">
        ⏳ <strong>${cola.length} registro(s) pendiente(s)</strong> guardados sin conexión. Se sincronizarán automáticamente al conectarse a internet.
      </div>`;
    }
  },

  guardarConfigGoogle() {
    const gmail = (document.getElementById('cfgGmail').value || '').trim();
    const whatsappNumero = (document.getElementById('cfgWaNumero').value || '').replace(/\D/g, '');
    const sheetsUrl = (document.getElementById('cfgSheetsUrl').value || '').trim();
    const driveUrl = (document.getElementById('cfgDriveUrl').value || '').trim();

    window.store.updateEmpresa({ gmail, whatsappNumero, sheetsUrl, driveUrl });
    document.getElementById('modalConfigGoogle').remove();

    const container = document.getElementById('view-configuracion');
    if (container) this.render(container);

    alert(`✅ Configuración guardada exitosamente.\n\n${gmail ? '• Gmail: ' + gmail + '\n' : ''}${whatsappNumero ? '• WhatsApp: ' + whatsappNumero + '\n' : ''}${sheetsUrl ? '• Google Sheets: Vinculado\n' : ''}${driveUrl ? '• Google Drive: Vinculado\n' : ''}\nEn la versión de producción, la app se conectará con su cuenta de Google automáticamente.`);
  },

  toggleSync(tipo, enabled) {
    console.log(`Sync ${tipo}: ${enabled ? 'Activada' : 'Pausada'} (Demostración)`);
  },

  sincronizarAhora() {
    const now = new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
    window.store.updateEmpresa({ ultimaSincronizacion: now });
    const container = document.getElementById('view-configuracion');
    if (container) this.render(container);
    alert(`Sincronización simulada completada exitosamente a las ${now}.`);
  },

  mostrarAyuda() {
    alert(`PUJOLS Servicios - Manual Rápido:
1. Clientes y Equipos: Registre sus clientes y asocie aires acondicionados, neveras o lavadoras.
2. Servicios: Programe mantenimientos e instalaciones en la agenda.
3. Facturación: Emita comprobantes profesionales e imprímalos o guárdelos en PDF con el logo oficial.
4. Recordatorios: Fidelice a sus clientes enviando recordatorios directos por WhatsApp.`);
  },

  restablecerDatos() {
    if (confirm('¿Desea restablecer los datos de demostración a su estado inicial?')) {
      window.store.resetToDefaults();
      alert('Datos de demostración restablecidos.');
      location.reload();
    }
  },

  limpiarParaProduccion() {
    if (confirm('¿Está seguro de que desea limpiar todos los clientes, órdenes y facturas de prueba para empezar a usar la aplicación con sus clientes reales?')) {
      window.store.limpiarDatosFicticios();
      alert('✅ Todos los datos ficticios han sido eliminados. La app está lista en blanco para sus datos reales.');
      location.reload();
    }
  }
};

window.ConfiguracionModule = ConfiguracionModule;
