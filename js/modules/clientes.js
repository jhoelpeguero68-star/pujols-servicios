// PUJOLS Servicios - Módulo Clientes

const ClientesModule = {
  activeSearch: '',

  render(container) {
    const clientes = window.store.getClientes();
    const filtered = clientes.filter(c => {
      if (!this.activeSearch) return true;
      const term = this.activeSearch.toLowerCase();
      return c.nombre.toLowerCase().includes(term) ||
             c.telefono.toLowerCase().includes(term) ||
             c.direccion.toLowerCase().includes(term);
    });

    container.innerHTML = `
      <!-- Cabecera de Clientes -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Clientes y equipos</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Gestión de cartera de clientes residenciales y comerciales</p>
        </div>
        <button class="btn btn-primary" onclick="App.openModal('modalNuevoCliente')">
          <span class="icon">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </span>
          + Nuevo cliente
        </button>
      </div>

      <!-- Buscador y Toggle Clientes / Equipos -->
      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
        <div class="search-bar-wrapper">
          <span class="search-bar-icon icon">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </span>
          <input
            type="text"
            id="clienteSearchInput"
            class="search-bar-input"
            placeholder="Buscar cliente por nombre, teléfono o dirección..."
            value="${this.activeSearch}"
            oninput="ClientesModule.onSearch(this.value)"
          >
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div class="tabs-container">
            <button class="tab-btn active">Clientes (${filtered.length})</button>
            <button class="tab-btn" onclick="App.navigate('equipos')">Equipos (${window.store.getEquipos().length})</button>
          </div>
          <span style="font-size: 12px; color: var(--text-muted);">
            Mostrando <strong>${filtered.length}</strong> de ${clientes.length} clientes
          </span>
        </div>
      </div>

      <!-- Listado de Clientes -->
      <div class="list-container">
        ${filtered.length === 0 ? `
          <div class="card" style="text-align: center; padding: 40px 20px;">
            <p style="font-size: 16px; color: var(--text-muted); margin-bottom: 12px;">No se encontraron clientes con ese criterio.</p>
            <button class="btn btn-outline btn-sm" onclick="ClientesModule.onSearch('')">Limpiar búsqueda</button>
          </div>
        ` : filtered.map(c => `
          <div class="client-item" onclick="ClientesModule.showDetail('${c.id}')">
            <div class="client-item-left">
              <div class="avatar-initials" style="background-color: ${c.colorBadge || '#0A2540'};">
                ${c.iniciales}
              </div>
              <div class="client-item-info">
                <div class="client-item-name">
                  ${c.nombre}
                  <span style="font-size: 11px; font-weight: 500; color: ${c.tipo === 'Comercial' ? '#0284C7' : '#10B981'}; background: ${c.tipo === 'Comercial' ? '#E0F2FE' : '#ECFDF5'}; padding: 2px 7px; border-radius: 10px; margin-left: 6px;">
                    ${c.tipo}
                  </span>
                </div>
                <div class="client-item-details">
                  <span>
                    <span class="icon" style="width: 14px; height: 14px; color: var(--color-accent);">
                      <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </span>
                    ${c.telefono}
                  </span>
                  <span>
                    <span class="icon" style="width: 14px; height: 14px; color: var(--text-light);">
                      <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </span>
                    ${c.direccion}
                  </span>
                  <span style="color: var(--color-primary); font-weight: 600;">
                    ${c.equiposCount || 0} equipo${c.equiposCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>
            <div class="client-item-chevron">
              <span class="icon">
                <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
              </span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Modal Detalle de Cliente -->
      <div id="modalDetalleCliente" class="modal-backdrop">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3 class="modal-title" id="detalleClienteTitulo">Ficha de Cliente</h3>
            <button class="modal-close-btn" onclick="ClientesModule.closeDetail()">
              <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
            </button>
          </div>
          <div class="modal-body" id="detalleClienteBody">
            <!-- Dynamic content injected by showDetail -->
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="ClientesModule.closeDetail()">Cerrar</button>
            <button class="btn btn-primary" id="btnCrearOrdenCliente">Nueva Orden</button>
          </div>
        </div>
      </div>
    `;
  },

  onSearch(query) {
    this.activeSearch = query;
    const viewContainer = document.getElementById('view-clientes');
    if (viewContainer) {
      this.render(viewContainer);
      const input = document.getElementById('clienteSearchInput');
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
      }
    }
  },

  showDetail(clienteId) {
    const cliente = window.store.getClienteById(clienteId);
    if (!cliente) return;

    const equipos = window.store.getEquiposByCliente(clienteId);
    const servicios = window.store.getServicios().filter(s => s.clienteId === clienteId);
    const facturas = window.store.getFacturas().filter(f => f.clienteId === clienteId);

    const titleEl = document.getElementById('detalleClienteTitulo');
    const bodyEl = document.getElementById('detalleClienteBody');
    const btnOrden = document.getElementById('btnCrearOrdenCliente');

    if (titleEl) titleEl.innerText = cliente.nombre;

    if (btnOrden) {
      btnOrden.onclick = () => {
        ClientesModule.closeDetail();
        App.openModal('modalNuevaOrden', { clienteId: cliente.id });
      };
    }

    if (bodyEl) {
      const mapLink = cliente.mapUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cliente.direccion));

      bodyEl.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="avatar-initials" style="background: ${cliente.colorBadge || '#0A2540'}; width: 50px; height: 50px; font-size: 18px;">
              ${cliente.iniciales}
            </div>
            <div>
              <h4 style="font-size: 17px; color: var(--color-primary);">${cliente.nombre}</h4>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
                ${cliente.tipo} &nbsp;•&nbsp; 📍 ${cliente.direccion}
                ${cliente.lat && cliente.lng ? ` &nbsp;•&nbsp; <span style="color: #0284C7; font-weight: 600; font-size: 11.5px;">GPS: ${cliente.lat.toFixed(4)}, ${cliente.lng.toFixed(4)}</span>` : ''}
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="${mapLink}" target="_blank" class="btn btn-sm btn-outline" style="border-color: #EA4335; color: #EA4335;" title="Abrir en Google Maps">
              📍 Google Maps
            </a>
            <a href="https://wa.me/1${cliente.whatsapp.replace(/\D/g, '')}" target="_blank" class="btn btn-sm btn-primary" style="background: #25D366; border-color: #25D366;">
              WhatsApp
            </a>
            <a href="tel:${cliente.telefono}" class="btn btn-sm btn-outline">
              Llamar
            </a>
          </div>
        </div>

        <!-- Pestañas internas del detalle -->
        <h4 style="font-size: 14px; font-weight: 700; color: var(--color-primary); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span>Equipos Registrados (${equipos.length})</span>
          <button class="btn btn-sm btn-soft" onclick="ClientesModule.openAddEquipoFor('${cliente.id}')">
            + Asociar Equipo
          </button>
        </h4>

        ${equipos.length === 0 ? `
          <p style="font-size: 13px; color: var(--text-muted); font-style: italic; margin-bottom: 20px;">No tiene equipos asociados aún.</p>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
            ${equipos.map(eq => `
              <div style="padding: 12px 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: #FFFFFF; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--color-primary); font-size: 13.5px;">${eq.tipo} - ${eq.capacidad}</strong>
                  <div style="font-size: 12px; color: var(--text-muted);">
                    ${eq.marca} (${eq.modelo}) • Ubicación: <strong>${eq.ubicacion}</strong>
                  </div>
                </div>
                <span class="badge ${eq.estado === 'Operativo' ? 'badge-completado' : 'badge-en-proceso'}">${eq.estado}</span>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Historial de Servicios Recientes -->
        <h4 style="font-size: 14px; font-weight: 700; color: var(--color-primary); margin-bottom: 12px;">Historial de Servicios (${servicios.length})</h4>
        ${servicios.length === 0 ? `
          <p style="font-size: 13px; color: var(--text-muted); font-style: italic; margin-bottom: 20px;">No registra servicios aún.</p>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
            ${servicios.map(s => `
              <div style="padding: 10px 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; font-size: 12.5px;">
                <div>
                  <strong>${s.titulo}</strong>
                  <span style="color: var(--text-muted); margin-left: 8px;">${s.fechaFormato} • ${s.tecnico}</span>
                </div>
                <span class="badge ${s.estado === 'Programado' ? 'badge-programado' : (s.estado === 'En proceso' ? 'badge-en-proceso' : 'badge-completado')}">${s.estado}</span>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Facturas emitidas -->
        <h4 style="font-size: 14px; font-weight: 700; color: var(--color-primary); margin-bottom: 12px;">Facturas (${facturas.length})</h4>
        ${facturas.length === 0 ? `
          <p style="font-size: 13px; color: var(--text-muted); font-style: italic;">No tiene facturas generadas.</p>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${facturas.map(f => `
              <div style="padding: 10px 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; cursor: pointer;" onclick="FacturacionModule.openInvoicePreview('${f.numero}')">
                <div>
                  <strong>${f.numero}</strong> • ${f.fecha}
                </div>
                <div>
                  <strong style="margin-right: 12px; color: var(--color-primary);">RD$ ${f.total.toLocaleString('en-US')}</strong>
                  <span class="badge ${f.estado === 'Pagada' ? 'badge-pagada' : 'badge-pendiente'}">${f.estado}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      `;
    }

    const modal = document.getElementById('modalDetalleCliente');
    if (modal) modal.classList.add('open');
  },

  closeDetail() {
    const modal = document.getElementById('modalDetalleCliente');
    if (modal) modal.classList.remove('open');
  },

  openAddEquipoFor(clienteId) {
    this.closeDetail();
    App.openModal('modalNuevoEquipo', { clienteId });
  }
};

window.ClientesModule = ClientesModule;
