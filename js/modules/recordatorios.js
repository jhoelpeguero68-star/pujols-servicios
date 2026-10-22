// PUJOLS Servicios - Módulo Recordatorios de Mantenimiento y WhatsApp

const RecordatoriosModule = {
  render(container) {
    const rec = window.store.getRecordatorios();
    const eqDestacado = rec.equipoDestacado;
    const otros = rec.otrosRecordatorios || [];

    container.innerHTML = `
      <!-- Cabecera de Recordatorios -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Recordatorios</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Planificación de retención y alertas de mantenimientos preventivos</p>
        </div>
        <button class="btn btn-primary" onclick="RecordatoriosModule.abrirMensaje(0)">
          <span class="icon">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </span>
          Ver mensajes
        </button>
      </div>

      <!-- Tarjeta de Equipo Destacado (Fiel a la maqueta de referencia) -->
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
            <span>Próximos recordatorios</span>
          </div>
          <span class="badge badge-programado">Secuencia Automática</span>
        </div>

        <div class="timeline-list">
          ${eqDestacado.timeline.map((node, index) => `
            <div class="timeline-item">
              <div class="timeline-node ${node.activo ? 'filled' : ''}"></div>
              <div class="timeline-content-card" style="cursor: pointer;" onclick="RecordatoriosModule.abrirMensaje(${index})">
                <div>
                  <div class="timeline-interval">${node.tiempo}</div>
                  <div class="timeline-title">${node.titulo}</div>
                </div>
                <div style="text-align: right;">
                  <div class="timeline-date">${node.fecha}</div>
                  <span class="badge ${node.activo ? 'badge-programado' : 'badge-pendiente'}" style="margin-top: 4px; font-size: 10px;">
                    ${node.activo ? 'Listo para enviar' : 'Programado'}
                  </span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Caja de Información de WhatsApp -->
        <div class="reminder-info-box">
          <span class="icon" style="flex-shrink: 0; color: #0284C7;"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></span>
          <span>Los mensajes se preparan para abrir en WhatsApp. Debes confirmar su envío.</span>
        </div>

        <div style="text-align: center;">
          <button class="btn btn-primary btn-lg" style="width: 100%; max-width: 400px;" onclick="RecordatoriosModule.abrirMensaje(0)">
            Ver mensajes y Enviar WhatsApp
          </button>
        </div>
      </div>

      <!-- Otros Recordatorios de la Empresa -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Otros Clientes con Mantenimiento Próximo o Vencido</div>
          <span style="font-size: 12px; color: var(--text-muted);">${otros.length} alertas</span>
        </div>

        <div class="list-container">
          ${otros.map(item => `
            <div style="padding: 14px 18px; border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; flex-wrap: wrap; gap: 10px;">
              <div>
                <strong style="color: var(--color-primary); font-size: 14px;">${item.cliente}</strong>
                <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">
                  ${item.equipo} &nbsp;•&nbsp; Vence: <strong>${item.fechaVencimiento}</strong>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge ${item.estado.includes('Vencido') ? 'badge-cancelado' : 'badge-programado'}">
                  ${item.estado}
                </span>
                <button class="btn btn-sm btn-outline" onclick="RecordatoriosModule.enviarDirecto('${item.cliente}', '${item.telefono}', '${item.mensaje}')">
                  WhatsApp
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Modal Visor / Editor de Mensaje de WhatsApp -->
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

  abrirMensaje(index) {
    const rec = window.store.getRecordatorios();
    const eq = rec.equipoDestacado;
    const item = eq.timeline[index] || eq.timeline[0];

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
          Al presionar el botón se abrirá WhatsApp con el texto listo.
        </div>
      `;
    }

    if (btnSend) {
      btnSend.onclick = () => {
        const textVal = document.getElementById('textoMensajeWA').value;
        const phone = eq.clienteTelefono.replace(/\D/g, '');
        window.open(`https://wa.me/1${phone}?text=${encodeURIComponent(textVal)}`, '_blank');
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
    const phone = telefono.replace(/\D/g, '');
    window.open(`https://wa.me/1${phone}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }
};

window.RecordatoriosModule = RecordatoriosModule;
