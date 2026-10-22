// PUJOLS Servicios - Módulo Equipos

const EquiposModule = {
  currentCategory: 'todos',
  searchQuery: '',

  render(container) {
    const equipos = window.store.getEquipos();
    const clientes = window.store.getClientes();

    const filtered = equipos.filter(eq => {
      // Category filter
      if (this.currentCategory !== 'todos') {
        const tipo = eq.tipo.toLowerCase();
        if (this.currentCategory === 'ac' && !tipo.includes('aire')) return false;
        if (this.currentCategory === 'nevera' && !tipo.includes('nevera')) return false;
        if (this.currentCategory === 'lavadora' && !tipo.includes('lavadora')) return false;
      }
      // Search filter
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        return eq.tipo.toLowerCase().includes(q) ||
               eq.clienteNombre.toLowerCase().includes(q) ||
               eq.marca.toLowerCase().includes(q) ||
               eq.ubicacion.toLowerCase().includes(q) ||
               eq.capacidad.toLowerCase().includes(q);
      }
      return true;
    });

    container.innerHTML = `
      <!-- Cabecera de Equipos -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Equipos por cliente</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Aires acondicionados, neveras y lavadoras instalados y bajo mantenimiento</p>
        </div>
        <button class="btn btn-primary" onclick="App.openModal('modalNuevoEquipo')">
          <span class="icon">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </span>
          + Nuevo equipo
        </button>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
        <div class="search-bar-wrapper">
          <span class="search-bar-icon icon">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </span>
          <input
            type="text"
            id="equipoSearchInput"
            class="search-bar-input"
            placeholder="Buscar por cliente, tipo de equipo, marca o ubicación..."
            value="${this.searchQuery}"
            oninput="EquiposModule.onSearch(this.value)"
          >
        </div>

        <!-- Categorías Pills -->
        <div class="filter-pills">
          <button class="filter-pill ${this.currentCategory === 'todos' ? 'active' : ''}" onclick="EquiposModule.setCategory('todos')">
            Todos (${equipos.length})
          </button>
          <button class="filter-pill ${this.currentCategory === 'ac' ? 'active' : ''}" onclick="EquiposModule.setCategory('ac')">
            ❄️ Aires Acondicionados (${equipos.filter(e => e.tipo.toLowerCase().includes('aire')).length})
          </button>
          <button class="filter-pill ${this.currentCategory === 'nevera' ? 'active' : ''}" onclick="EquiposModule.setCategory('nevera')">
            🧊 Neveras (${equipos.filter(e => e.tipo.toLowerCase().includes('nevera')).length})
          </button>
          <button class="filter-pill ${this.currentCategory === 'lavadora' ? 'active' : ''}" onclick="EquiposModule.setCategory('lavadora')">
            🧺 Lavadoras (${equipos.filter(e => e.tipo.toLowerCase().includes('lavadora')).length})
          </button>
        </div>
      </div>

      <!-- Cuadrícula de Equipos -->
      ${filtered.length === 0 ? `
        <div class="card" style="text-align: center; padding: 40px 20px;">
          <p style="font-size: 16px; color: var(--text-muted); margin-bottom: 12px;">No se encontraron equipos bajo este filtro.</p>
          <button class="btn btn-outline btn-sm" onclick="EquiposModule.setCategory('todos'); EquiposModule.onSearch('');">Ver todos los equipos</button>
        </div>
      ` : `
        <div class="equipment-grid">
          ${filtered.map(eq => {
            const iconSvg = eq.icono === 'refrigerator' 
              ? '<svg viewBox="0 0 24 24"><path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 7H7V4h10v5zm-7-3H8v2h2V6zm7 13H7v-8h10v8zm-7-6H8v3h2v-3z"/></svg>'
              : (eq.icono === 'washer'
                ? '<svg viewBox="0 0 24 24"><path d="M18 2.01L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM18 20H6v-9.02h12V20zm0-11H6V4h12v5zM8 6c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm4 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm0 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
                : '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>');

            return `
              <div class="equipment-card">
                <div>
                  <div class="equipment-header">
                    <div class="equipment-icon-badge">
                      <span class="icon" style="width: 24px; height: 24px;">
                        ${iconSvg}
                      </span>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                      <div class="equipment-title">${eq.tipo} - ${eq.capacidad}</div>
                      <div class="equipment-meta">
                        👤 <strong>${eq.clienteNombre}</strong>
                      </div>
                    </div>
                    <span class="badge ${eq.estado === 'Operativo' ? 'badge-completado' : 'badge-en-proceso'}">${eq.estado}</span>
                  </div>

                  <div class="equipment-details-table">
                    <div class="equipment-detail-row">
                      <span>Marca y Modelo:</span>
                      <strong>${eq.marca} (${eq.modelo})</strong>
                    </div>
                    <div class="equipment-detail-row">
                      <span>Ubicación:</span>
                      <strong>${eq.ubicacion}</strong>
                    </div>
                    <div class="equipment-detail-row">
                      <span>Instalación:</span>
                      <span>${eq.fechaInstalacion}</span>
                    </div>
                    <div class="equipment-detail-row">
                      <span>Próx. Mantenimiento:</span>
                      <strong style="color: var(--color-secondary-blue);">${eq.proximoMantenimiento}</strong>
                    </div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 8px;">
                  <button class="btn btn-primary btn-sm btn-block" onclick="App.openModal('modalNuevaOrden', { clienteId: '${eq.clienteId}', equipoId: '${eq.id}' })">
                    + Crear Orden
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="App.navigate('recordatorios')">
                    Recordatorio
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  },

  setCategory(category) {
    this.currentCategory = category;
    const container = document.getElementById('view-equipos');
    if (container) this.render(container);
  },

  onSearch(query) {
    this.searchQuery = query;
    const container = document.getElementById('view-equipos');
    if (container) {
      this.render(container);
      const input = document.getElementById('equipoSearchInput');
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
      }
    }
  }
};

window.EquiposModule = EquiposModule;
