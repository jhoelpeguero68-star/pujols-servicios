// PUJOLS Servicios - Módulo Recordatorios de Mantenimiento y WhatsApp

const RecordatoriosModule = {
  render(container) {
    const rec = window.store.getRecordatorios() || {};
    const eqDestacado = rec.equipoDestacado || {
      id: "REC-DEF",
      titulo: "Seguimiento Preventivo",
      especificaciones: "Mantenimiento Periódico PUJOLS Servicios",
      clienteNombre: "Cliente",
      clienteTelefono: "829-725-4450",
      timeline: []
    };
    const timeline = Array.isArray(eqDestacado.timeline) ? eqDestacado.timeline : [];
    const otros = Array.isArray(rec.otrosRecordatorios) ? rec.otrosRecordatorios : [];

    container.innerHTML = `
      <!-- Cabecera de Recordatorios -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Recordatorios</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Planificación de retención y alertas de mantenimientos preventivos</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="RecordatoriosModule.abrirModalNuevo()">
            <span class="icon">
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </span>
            + Nuevo Recordatorio
          </button>
          <button class="btn btn-outline" onclick="RecordatoriosModule.abrirMensaje(0)">
            <span class="icon">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </span>
            Ver mensajes
          </button>
        </div>
      </div>

      <!-- Tarjeta de Equipo Destacado -->
      <div class="reminder-header-card">
        <div class="reminder-device-icon">
          <span class="icon" style="width: 28px; height: 28px;">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
          </span>
        </div>
        <div>
          <div class="reminder-device-title">${eqDestacado.titulo}</div>
          <div class="reminder-device-subtitle">${eqDestacado.especificaciones}</div>
        </div>
      </div>

      <!-- Sección de Próximos Recordatorios (Timeline) -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">
            <span class="icon" style="color: var(--color-accent);"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg></span>
            <span>Secuencia de Mantenimiento Preventivo</span>
          </div>
          <span class="badge badge-programado">Secuencia Automática</span>
        </div>

        <div class="timeline-list">
          ${timeline.length === 0 ? `
            <div style="text-align: center; padding: 28px 16px; color: var(--text-muted); font-size: 13.5px;">
              No hay recordatorios pendientes en la secuencia actualmente.
            </div>
          ` : timeline.map((node, index) => `
            <div class="timeline-item">
              <div class="timeline-node ${node.activo ? 'filled' : ''}"></div>
              <div class="timeline-content-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="cursor: pointer; flex: 1; min-width: 200px;" onclick="RecordatoriosModule.abrirMensaje(${index})">
                  <div class="timeline-interval">${node.tiempo}</div>
                  <div class="timeline-title">${node.titulo}</div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">
                    📅 Fecha prevista: <strong>${node.fecha}</strong>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button type="button" class="btn-action-edit" title="Modificar fecha o mensaje" onclick="RecordatoriosModule.abrirEditarTimeline(${index})" style="background: #F1F5F9; border: 1px solid #CBD5E1; color: var(--color-primary); width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
                    <span class="icon" style="width: 15px; height: 15px;"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></span>
                  </button>
                  <button type="button" class="btn btn-sm btn-primary" onclick="RecordatoriosModule.abrirMensaje(${index})" style="background: #25D366; border-color: #25D366; display: inline-flex; align-items: center; gap: 4px;">
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Caja de Información de WhatsApp -->
        <div class="reminder-info-box">
          <span class="icon" style="flex-shrink: 0; color: #0284C7;"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></span>
          <span>Los mensajes se preparan para abrir en WhatsApp con el texto listo. Debes confirmar su envío.</span>
        </div>
      </div>

      <!-- Otros Recordatorios de la Empresa -->
      <div class="card">
        <div class="card-header" style="flex-wrap: wrap; gap: 10px;">
          <div>
            <div class="card-title">Recordatorios de Mantenimiento por Cliente</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Alertas programadas y avisos personalizados</div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 12px; color: var(--text-muted);">${otros.length} recordatorios</span>
            <button class="btn btn-sm btn-primary" onclick="RecordatoriosModule.abrirModalNuevo()">
              + Agregar
            </button>
          </div>
        </div>

        <div class="list-container">
          ${otros.length === 0 ? `
            <div style="text-align: center; padding: 32px 16px; color: var(--text-muted); font-size: 13.5px;">
              No hay recordatorios adicionales programados.<br>
              <button class="btn btn-sm btn-primary" style="margin-top: 10px;" onclick="RecordatoriosModule.abrirModalNuevo()">
                + Agregar primer recordatorio manual
              </button>
            </div>
          ` : otros.map(item => `
            <div style="padding: 14px 18px; border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; flex-wrap: wrap; gap: 12px;">
              <div style="min-width: 220px; flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <strong style="color: var(--color-primary); font-size: 14.5px;">${item.cliente}</strong>
                  <span class="badge ${item.estado && item.estado.includes('Vencido') ? 'badge-cancelado' : 'badge-programado'}" style="font-size: 10px; padding: 2px 6px;">
                    ${item.estado || 'Programado'}
                  </span>
                </div>
                <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 3px;">
                  ${item.equipo} &nbsp;•&nbsp; <strong>📅 Fecha: ${item.fechaVencimiento}</strong> &nbsp;•&nbsp; 📞 ${item.telefono}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 6px; margin-left: auto;">
                <button class="btn btn-sm btn-outline" style="border-color: #25D366; color: #166534; background: #F0FDF4; font-weight: 700;" onclick="RecordatoriosModule.enviarDirecto('${item.cliente ? item.cliente.replace(/'/g, "\\'") : 'Cliente'}', '${item.telefono || '829-725-4450'}', '${item.mensaje ? item.mensaje.replace(/'/g, "\\'") : ''}')" title="Enviar mensaje de WhatsApp">
                  💬 WhatsApp
                </button>
                <button type="button" class="btn-action-edit" title="Modificar recordatorio o fecha" onclick="RecordatoriosModule.abrirModalEditar('${item.id}')" style="background: #F1F5F9; border: 1px solid #CBD5E1; color: var(--color-primary); width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
                  <span class="icon" style="width: 15px; height: 15px;"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></span>
                </button>
                <button type="button" class="btn-action-delete" title="Eliminar recordatorio" onclick="RecordatoriosModule.confirmarEliminar('${item.id}')" style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
                  <span class="icon" style="width: 15px; height: 15px;"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Modal Visor de Mensaje WhatsApp -->
      <div id="modalMensajeWhatsApp" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Mensaje de Recordatorio WhatsApp</h3>
            <button class="modal-close-btn" onclick="RecordatoriosModule.cerrarMensaje()">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
            </button>
          </div>
          <div class="modal-body" id="whatsappModalBody">
            <!-- Dynamic WhatsApp message box -->
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="RecordatoriosModule.cerrarMensaje()">Cancelar</button>
            <button class="btn btn-primary" id="btnConfirmarWhatsApp" style="background: #25D366; border-color: #25D366;">
              Abrir en WhatsApp Web / App
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Modal para agregar un nuevo recordatorio de forma manual
  abrirModalNuevo() {
    const modalId = 'modalNuevoRecordatorio';
    let modalEl = document.getElementById(modalId);
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = modalId;
      modalEl.className = 'modal-backdrop';
      document.body.appendChild(modalEl);
    }

    const clientes = window.store.getClientes ? window.store.getClientes() : [];
    const hoyISO = window.DateUtil ? window.DateUtil.getISODate() : new Date().toISOString().split('T')[0];

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 520px;">
        <div class="modal-header">
          <h3 class="modal-title">+ Agregar Recordatorio Manual</h3>
          <button class="modal-close-btn" onclick="App.closeModal('${modalId}')">
            <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
          </button>
        </div>
        <form onsubmit="RecordatoriosModule.guardarNuevo(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Cliente:</label>
              ${clientes.length > 0 ? `
                <div style="display: flex; gap: 8px; margin-bottom: 6px;">
                  <select id="newRecClienteSelect" class="form-select" onchange="RecordatoriosModule.onSelectClienteNuevo(this.value)">
                    <option value="">-- Seleccionar cliente existente --</option>
                    ${clientes.map(c => `<option value="${c.nombre}" data-phone="${c.telefono || c.whatsapp || ''}">${c.nombre}</option>`).join('')}
                    <option value="__otro__">Otro (escribir manualmente)...</option>
                  </select>
                </div>
              ` : ''}
              <input type="text" id="newRecCliente" class="form-input" placeholder="Nombre completo del cliente" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Teléfono / WhatsApp:</label>
                <input type="tel" id="newRecTelefono" class="form-input" placeholder="829-725-4450" oninput="window.PhoneUtil && PhoneUtil.formatInput(this)" required>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha del Recordatorio:</label>
                <input type="date" id="newRecFecha" class="form-input" value="${hoyISO}" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Equipo / Trabajo:</label>
                <input type="text" id="newRecEquipo" class="form-input" placeholder="Ej: Aire Inverter 12,000 BTU / Nevera" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estado:</label>
                <select id="newRecEstado" class="form-select">
                  <option value="Programado">Programado</option>
                  <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                  <option value="Revisión General">Revisión General</option>
                  <option value="Limpieza Profunda">Limpieza Profunda</option>
                  <option value="Vencido">Vencido</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Mensaje para WhatsApp:</label>
              <textarea id="newRecMensaje" class="form-textarea" rows="4" placeholder="Mensaje personalizado..."></textarea>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">
                Se abrirá listo en WhatsApp cuando pulses enviar.
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="App.closeModal('${modalId}')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Recordatorio</button>
          </div>
        </form>
      </div>
    `;

    // Actualizar plantilla inicial de mensaje
    this.actualizarMensajePlantillaNuevo();
    document.getElementById('newRecCliente').addEventListener('input', () => this.actualizarMensajePlantillaNuevo());
    document.getElementById('newRecEquipo').addEventListener('input', () => this.actualizarMensajePlantillaNuevo());

    App.openModal(modalId);
  },

  onSelectClienteNuevo(val) {
    if (!val || val === '__otro__') {
      document.getElementById('newRecCliente').value = '';
      return;
    }
    const select = document.getElementById('newRecClienteSelect');
    const opt = select.options[select.selectedIndex];
    const phone = opt ? opt.getAttribute('data-phone') : '';
    document.getElementById('newRecCliente').value = val;
    if (phone) {
      document.getElementById('newRecTelefono').value = phone;
    }
    this.actualizarMensajePlantillaNuevo();
  },

  actualizarMensajePlantillaNuevo() {
    const cliente = (document.getElementById('newRecCliente').value || '').trim() || 'estimado/a cliente';
    const equipo = (document.getElementById('newRecEquipo').value || '').trim() || 'su equipo';
    const msgEl = document.getElementById('newRecMensaje');
    if (msgEl && (!msgEl.value || msgEl.dataset.autogenerated === 'true')) {
      msgEl.value = `Estimado/a ${cliente}, le saludamos de PUJOLS Servicios. Le recordamos con agrado que corresponde coordinar el mantenimiento preventivo de ${equipo}. ¿Le gustaría que coordinemos la visita técnica de George Pujols esta semana?`;
      msgEl.dataset.autogenerated = 'true';
    }
  },

  guardarNuevo(event) {
    event.preventDefault();
    const cliente = document.getElementById('newRecCliente').value.trim();
    const telefono = document.getElementById('newRecTelefono').value.trim();
    const fechaISO = document.getElementById('newRecFecha').value;
    const equipo = document.getElementById('newRecEquipo').value.trim();
    const estado = document.getElementById('newRecEstado').value;
    const mensaje = document.getElementById('newRecMensaje').value.trim();

    if (!cliente || !telefono || !fechaISO) {
      alert('Por favor complete el cliente, teléfono y fecha.');
      return;
    }

    const fechaVencimiento = window.DateUtil
      ? window.DateUtil.getFormatDateText(new Date(fechaISO + 'T12:00:00'))
      : fechaISO;

    window.store.addRecordatorio({
      cliente,
      telefono,
      fechaISO,
      fechaVencimiento,
      equipo,
      estado,
      mensaje
    });

    App.closeModal('modalNuevoRecordatorio');
    const container = document.getElementById('view-recordatorios');
    if (container) this.render(container);
    alert('✅ Recordatorio agregado con éxito.');
  },

  // Modal para editar un recordatorio existente
  abrirModalEditar(id) {
    const rec = window.store.getRecordatorios();
    const item = (rec.otrosRecordatorios || []).find(r => r.id === id);
    if (!item) {
      alert('No se encontró el recordatorio seleccionado.');
      return;
    }

    const modalId = 'modalEditarRecordatorio';
    let modalEl = document.getElementById(modalId);
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = modalId;
      modalEl.className = 'modal-backdrop';
      document.body.appendChild(modalEl);
    }

    const fechaISO = item.fechaISO || (window.DateUtil ? window.DateUtil.getISODate() : '');

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 520px;">
        <div class="modal-header">
          <h3 class="modal-title">Modificar Recordatorio</h3>
          <button class="modal-close-btn" onclick="App.closeModal('${modalId}')">
            <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
          </button>
        </div>
        <form onsubmit="RecordatoriosModule.guardarEdicion(event, '${item.id}')">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Cliente:</label>
              <input type="text" id="editRecCliente" class="form-input" value="${item.cliente ? item.cliente.replace(/"/g, '&quot;') : ''}" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Teléfono / WhatsApp:</label>
                <input type="tel" id="editRecTelefono" class="form-input" value="${item.telefono || ''}" oninput="window.PhoneUtil && PhoneUtil.formatInput(this)" required>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha del Recordatorio:</label>
                <input type="date" id="editRecFecha" class="form-input" value="${fechaISO}" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Equipo / Trabajo:</label>
                <input type="text" id="editRecEquipo" class="form-input" value="${item.equipo ? item.equipo.replace(/"/g, '&quot;') : ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estado:</label>
                <select id="editRecEstado" class="form-select">
                  <option value="Programado" ${item.estado === 'Programado' ? 'selected' : ''}>Programado</option>
                  <option value="Mantenimiento Preventivo" ${item.estado === 'Mantenimiento Preventivo' ? 'selected' : ''}>Mantenimiento Preventivo</option>
                  <option value="Revisión General" ${item.estado === 'Revisión General' ? 'selected' : ''}>Revisión General</option>
                  <option value="Limpieza Profunda" ${item.estado === 'Limpieza Profunda' ? 'selected' : ''}>Limpieza Profunda</option>
                  <option value="Vencido" ${item.estado && item.estado.includes('Vencido') ? 'selected' : ''}>Vencido</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Mensaje para WhatsApp:</label>
              <textarea id="editRecMensaje" class="form-textarea" rows="4">${item.mensaje ? item.mensaje.replace(/</g, '&lt;') : ''}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="App.closeModal('${modalId}')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    `;

    App.openModal(modalId);
  },

  guardarEdicion(event, id) {
    event.preventDefault();
    const cliente = document.getElementById('editRecCliente').value.trim();
    const telefono = document.getElementById('editRecTelefono').value.trim();
    const fechaISO = document.getElementById('editRecFecha').value;
    const equipo = document.getElementById('editRecEquipo').value.trim();
    const estado = document.getElementById('editRecEstado').value;
    const mensaje = document.getElementById('editRecMensaje').value.trim();

    if (!cliente || !telefono || !fechaISO) {
      alert('Por favor complete los campos requeridos.');
      return;
    }

    const fechaVencimiento = window.DateUtil
      ? window.DateUtil.getFormatDateText(new Date(fechaISO + 'T12:00:00'))
      : fechaISO;

    window.store.updateRecordatorio(id, {
      cliente,
      telefono,
      fechaISO,
      fechaVencimiento,
      equipo,
      estado,
      mensaje
    });

    App.closeModal('modalEditarRecordatorio');
    const container = document.getElementById('view-recordatorios');
    if (container) this.render(container);
    alert('✅ Recordatorio actualizado con éxito.');
  },

  confirmarEliminar(id) {
    const rec = window.store.getRecordatorios();
    const item = (rec.otrosRecordatorios || []).find(r => r.id === id);
    if (!item) return;

    if (confirm(`¿Estás seguro de eliminar el recordatorio para "${item.cliente}" (${item.equipo})?`)) {
      window.store.deleteRecordatorio(id);
      const container = document.getElementById('view-recordatorios');
      if (container) this.render(container);
      alert('🗑️ Recordatorio eliminado.');
    }
  },

  // Modal para editar un paso de la secuencia destacada
  abrirEditarTimeline(index) {
    const rec = window.store.getRecordatorios();
    const eq = rec.equipoDestacado;
    if (!eq || !eq.timeline || !eq.timeline[index]) return;

    const node = eq.timeline[index];
    const modalId = 'modalEditarTimeline';
    let modalEl = document.getElementById(modalId);
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = modalId;
      modalEl.className = 'modal-backdrop';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-header">
          <h3 class="modal-title">Editar Secuencia de Mantenimiento</h3>
          <button class="modal-close-btn" onclick="App.closeModal('${modalId}')">
            <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
          </button>
        </div>
        <form onsubmit="RecordatoriosModule.guardarTimeline(event, ${index})">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Intervalo / Etiqueta:</label>
                <input type="text" id="editTlTiempo" class="form-input" value="${node.tiempo || ''}" placeholder="Ej: Próximo servicio / 6 meses" required>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha Programada:</label>
                <input type="text" id="editTlFecha" class="form-input" value="${node.fecha || ''}" placeholder="Ej: 15 nov 2026" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Título del Trabajo:</label>
              <input type="text" id="editTlTitulo" class="form-input" value="${node.titulo ? node.titulo.replace(/"/g, '&quot;') : ''}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Mensaje para WhatsApp:</label>
              <textarea id="editTlMensaje" class="form-textarea" rows="5">${node.mensajeTexto ? node.mensajeTexto.replace(/</g, '&lt;') : ''}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="App.closeModal('${modalId}')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    `;

    App.openModal(modalId);
  },

  guardarTimeline(event, index) {
    event.preventDefault();
    const tiempo = document.getElementById('editTlTiempo').value.trim();
    const fecha = document.getElementById('editTlFecha').value.trim();
    const titulo = document.getElementById('editTlTitulo').value.trim();
    const mensajeTexto = document.getElementById('editTlMensaje').value.trim();

    window.store.updateTimelineRecordatorio(index, {
      tiempo,
      fecha,
      titulo,
      mensajeTexto
    });

    App.closeModal('modalEditarTimeline');
    const container = document.getElementById('view-recordatorios');
    if (container) this.render(container);
    alert('✅ Secuencia de mantenimiento actualizada.');
  },

  abrirMensaje(index) {
    const rec = window.store.getRecordatorios() || {};
    const eq = rec.equipoDestacado || {
      clienteNombre: "Cliente PUJOLS Servicios",
      clienteTelefono: "829-725-4450",
      titulo: "Equipo Climatización",
      especificaciones: "Mantenimiento Preventivo",
      timeline: []
    };
    const timeline = Array.isArray(eq.timeline) ? eq.timeline : [];
    const item = timeline[index] || timeline[0] || {
      mensajeTexto: "Hola, le saludamos de PUJOLS Servicios. Le recordamos con agrado que corresponde coordinar su próximo mantenimiento preventivo de climatización o refrigeración. ¿Podemos coordinar la visita técnica?"
    };

    const bodyEl = document.getElementById('whatsappModalBody');
    const btnSend = document.getElementById('btnConfirmarWhatsApp');

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="margin-bottom: 14px; font-size: 13px; color: var(--text-muted);">
          Destinatario: <strong style="color: var(--color-primary);">${eq.clienteNombre}</strong> &nbsp;(${eq.clienteTelefono})<br>
          Equipo: <strong>${eq.titulo} (${eq.especificaciones})</strong>
        </div>

        <div class="form-group">
          <label class="form-label">Plantilla del Mensaje Personalizado:</label>
          <textarea id="textoMensajeWA" class="form-textarea" rows="6" style="line-height: 1.5; font-size: 13px;">${item.mensajeTexto}</textarea>
        </div>

        <div style="font-size: 11.5px; color: var(--text-light); font-style: italic;">
          Al presionar el botón se abrirá WhatsApp con el texto listo para enviar.
        </div>
      `;
    }

    if (btnSend) {
      btnSend.onclick = () => {
        const textVal = document.getElementById('textoMensajeWA').value;
        const phone = eq.clienteTelefono || '829-725-4450';
        const waUrl = window.PhoneUtil ? window.PhoneUtil.buildWhatsAppUrl(phone, textVal) : `https://wa.me/18297254450?text=${encodeURIComponent(textVal)}`;
        window.open(waUrl, '_blank');
        RecordatoriosModule.cerrarMensaje();
      };
    }

    const modal = document.getElementById('modalMensajeWhatsApp');
    if (modal) modal.classList.add('open');
  },

  cerrarMensaje() {
    const modal = document.getElementById('modalMensajeWhatsApp');
    if (modal) modal.classList.remove('open');
  },

  enviarDirecto(cliente, telefono, mensaje) {
    const phone = telefono || '829-725-4450';
    const waUrl = window.PhoneUtil ? window.PhoneUtil.buildWhatsAppUrl(phone, mensaje) : `https://wa.me/18297254450?text=${encodeURIComponent(mensaje)}`;
    window.open(waUrl, '_blank');
  }
};

window.RecordatoriosModule = RecordatoriosModule;
