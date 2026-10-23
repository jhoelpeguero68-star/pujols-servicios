// PUJOLS Servicios - Módulo Servicios, Agenda y Órdenes de Trabajo

const ServiciosModule = {
  currentTab: 'agenda', // 'agenda' | 'ordenes' | 'historial'
  selectedDate: '14 oct 2025',

  render(container) {
    const servicios = window.store.getServicios();

    container.innerHTML = `
      <!-- Cabecera de Servicios -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Servicios, agenda y órdenes</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Planificación diaria de visitas técnicas, instalaciones y reparaciones</p>
        </div>
        <button class="btn btn-primary" onclick="App.openModal('modalNuevaOrden')">
          <span class="icon">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </span>
          + Nueva orden de servicio
        </button>
      </div>

      <!-- Pestañas y Selector de Fecha -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
        <div class="tabs-container">
          <button class="tab-btn ${this.currentTab === 'agenda' ? 'active' : ''}" onclick="ServiciosModule.setTab('agenda')">
            Agenda
          </button>
          <button class="tab-btn ${this.currentTab === 'ordenes' ? 'active' : ''}" onclick="ServiciosModule.setTab('ordenes')">
            Órdenes
          </button>
          <button class="tab-btn ${this.currentTab === 'historial' ? 'active' : ''}" onclick="ServiciosModule.setTab('historial')">
            Historial
          </button>
        </div>

        <!-- Selector de Día Navegable -->
        <div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 4px 12px; box-shadow: var(--shadow-xs);">
          <button class="btn btn-icon btn-sm btn-outline" style="border: none; width: 28px; height: 28px;" onclick="ServiciosModule.changeDate(-1)">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></span>
          </button>
          <span style="font-size: 13px; font-weight: 700; color: var(--color-primary); min-width: 130px; text-align: center;">
            📅 ${this.selectedDate}
          </span>
          <button class="btn btn-icon btn-sm btn-outline" style="border: none; width: 28px; height: 28px;" onclick="ServiciosModule.changeDate(1)">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></span>
          </button>
        </div>
      </div>

      <!-- Contenido según la pestaña activa -->
      <div id="serviciosTabContent">
        ${this.renderTabContent(servicios)}
      </div>
    `;
  },

  renderTabContent(servicios) {
    if (this.currentTab === 'agenda') {
      return this.renderAgenda(servicios);
    } else if (this.currentTab === 'ordenes') {
      return this.renderOrdenes(servicios);
    } else {
      return this.renderHistorial(servicios);
    }
  },

  renderAgenda(servicios) {
    // Filtrados para la agenda del día seleccionado
    const agendaItems = servicios.slice(0, 4);

    return `
      <div class="list-container">
        ${agendaItems.map(item => {
          let badgeClass = 'badge-programado';
          if (item.estado === 'En proceso') badgeClass = 'badge-en-proceso';
          if (item.estado === 'Completado') badgeClass = 'badge-completado';

          return `
            <div class="service-item-card">
              <div class="service-item-time">
                ${item.hora}
              </div>
              <div class="service-item-content">
                <div class="service-item-title">${item.titulo}</div>
                <div class="service-item-client">
                  👤 ${item.clienteNombre} &nbsp;•&nbsp; 🔧 Técnico: ${item.tecnico}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge ${badgeClass}">${item.estado}</span>
                <button class="btn btn-outline btn-sm" onclick="ServiciosModule.verDetalleOrden('${item.id}')">
                  Ver orden
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <button class="btn btn-primary btn-lg" onclick="App.openModal('modalNuevaOrden')">
          + Nueva orden de servicio
        </button>
      </div>
    `;
  },

  renderOrdenes(servicios) {
    return `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${servicios.map(s => `
          <div class="card" style="padding: 18px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: var(--color-secondary-blue); background: #E0F2FE; padding: 2px 8px; border-radius: var(--radius-sm);">
                  ${s.ordenId}
                </span>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--color-primary); margin-top: 4px;">
                  ${s.titulo}
                </h3>
                <div style="font-size: 12.5px; color: var(--text-muted);">
                  Cliente: <strong>${s.clienteNombre}</strong> &nbsp;•&nbsp; Equipo: <strong>${s.equipoNombre}</strong>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <select class="form-select" style="padding: 4px 8px; font-size: 12px; width: auto;" onchange="ServiciosModule.cambiarEstado('${s.id}', this.value)">
                  <option value="Programado" ${s.estado === 'Programado' ? 'selected' : ''}>Programado</option>
                  <option value="En proceso" ${s.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
                  <option value="Completado" ${s.estado === 'Completado' ? 'selected' : ''}>Completado</option>
                </select>
              </div>
            </div>

            <p style="font-size: 13px; color: var(--text-main); background: #F8FAFC; padding: 10px 14px; border-radius: var(--radius-md); border-left: 3px solid var(--color-accent); margin-bottom: 12px;">
              ${s.descripcion}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 12.5px; color: var(--text-muted);">
              <div>
                📅 ${s.fechaFormato} a las ${s.hora} &nbsp;|&nbsp; 👨‍🔧 ${s.tecnico}
              </div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <strong style="font-size: 15px; color: var(--color-primary);">RD$ ${s.costo.toLocaleString('en-US')}</strong>
                <button class="btn btn-sm btn-outline" style="border-color: #25D366; color: #15803D;" onclick="ServiciosModule.enviarWhatsAppCita('${s.id}')" title="Enviar confirmación de cita por WhatsApp">
                  💬 WhatsApp
                </button>
                <button class="btn btn-sm btn-primary" onclick="ServiciosModule.facturarOrden('${s.id}')">
                  Facturar
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderHistorial(servicios) {
    const terminados = servicios.filter(s => s.estado === 'Completado' || s.estado === 'Programado').slice(0, 5);

    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Historial de Órdenes Realizadas</div>
          <span style="font-size: 12px; color: var(--text-muted);">Últimas semanas</span>
        </div>
        <div class="list-container">
          ${terminados.map(s => `
            <div style="padding: 12px 14px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
              <div>
                <strong style="color: var(--color-primary);">${s.ordenId} - ${s.titulo}</strong>
                <div style="font-size: 12px; color: var(--text-muted);">${s.clienteNombre} &nbsp;•&nbsp; ${s.fechaFormato}</div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-completado">Completada con éxito</span>
                <div style="font-size: 12px; font-weight: 700; color: var(--color-primary); margin-top: 2px;">RD$ ${s.costo.toLocaleString('en-US')}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.currentTab = tab;
    const container = document.getElementById('view-servicios');
    if (container) this.render(container);
  },

  changeDate(direction) {
    // Demo date toggle
    const dates = ['13 oct 2025', '14 oct 2025', '15 oct 2025', '16 oct 2025'];
    let idx = dates.indexOf(this.selectedDate);
    if (idx === -1) idx = 1;
    let nextIdx = idx + direction;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= dates.length) nextIdx = dates.length - 1;
    this.selectedDate = dates[nextIdx];
    const container = document.getElementById('view-servicios');
    if (container) this.render(container);
  },

  cambiarEstado(servicioId, nuevoEstado) {
    window.store.updateServicioEstado(servicioId, nuevoEstado);
    const container = document.getElementById('view-servicios');
    if (container) this.render(container);
  },

  verDetalleOrden(servicioId) {
    this.setTab('ordenes');
  },

  facturarOrden(servicioId) {
    const srv = window.store.getServicios().find(s => s.id === servicioId);
    if (!srv) return;
    App.openModal('modalGenerarFactura', {
      clienteId: srv.clienteId,
      monto: srv.costo,
      concepto: srv.descripcion
    });
  },

  enviarWhatsAppCita(servicioId) {
    const srv = window.store.getServicios().find(s => s.id === servicioId);
    if (!srv) return;
    const cliente = window.store.getClienteById(srv.clienteId);
    const phone = cliente ? (cliente.whatsapp || cliente.telefono).replace(/\D/g, '') : '8095550100';
    const tratamiento = srv.clienteNombre.includes('&') || srv.clienteNombre.toLowerCase().includes('s.r.l') || srv.clienteNombre.toLowerCase().includes('constructora')
      ? 'Estimados señores de'
      : 'Estimado/a Sr./Sra.';
    const msg = `${tratamiento} ${srv.clienteNombre}, reciba un cordial saludo de PUJOLS Servicios.\n\nLe confirmamos su cita de servicio técnico programada:\n📅 Fecha: ${srv.fechaFormato}\n⏰ Hora: ${srv.hora}\n🔧 Trabajo: ${srv.titulo} (${srv.equipoNombre})\n👨‍🔧 Técnico: ${srv.tecnico}\n\nPor favor indíquenos si este horario le resulta conveniente. ¡Gracias por confiar en PUJOLS Servicios!`;
    window.open(`https://wa.me/1${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }
};

window.ServiciosModule = ServiciosModule;
