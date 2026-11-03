// PUJOLS Servicios - Modulo Facturacion, Vista Previa PDF, Envio al Cliente y Codigo QR Oficial

const FacturacionModule = {
  activeFilter: 'todas', // 'todas' | 'pagadas' | 'pendientes'
  searchQuery: '',
  currentPreviewNumero: null,

  // Codigo QR oficial que apunta a https://www.instagram.com/pujols_servicios/
  getQrSvgHtml() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 31 31" width="100%" height="100%" shape-rendering="crispEdges"><rect x="-1" y="-1" width="31" height="31" fill="#ffffff"/><path fill="#0A2540" d="M0,0h1v1h-1zM1,0h1v1h-1zM2,0h1v1h-1zM3,0h1v1h-1zM4,0h1v1h-1zM5,0h1v1h-1zM6,0h1v1h-1zM9,0h1v1h-1zM14,0h1v1h-1zM16,0h1v1h-1zM18,0h1v1h-1zM19,0h1v1h-1zM20,0h1v1h-1zM22,0h1v1h-1zM23,0h1v1h-1zM24,0h1v1h-1zM25,0h1v1h-1zM26,0h1v1h-1zM27,0h1v1h-1zM28,0h1v1h-1zM0,1h1v1h-1zM6,1h1v1h-1zM8,1h1v1h-1zM9,1h1v1h-1zM11,1h1v1h-1zM12,1h1v1h-1zM13,1h1v1h-1zM14,1h1v1h-1zM15,1h1v1h-1zM17,1h1v1h-1zM18,1h1v1h-1zM22,1h1v1h-1zM28,1h1v1h-1zM0,2h1v1h-1zM2,2h1v1h-1zM3,2h1v1h-1zM4,2h1v1h-1zM6,2h1v1h-1zM9,2h1v1h-1zM10,2h1v1h-1zM11,2h1v1h-1zM19,2h1v1h-1zM20,2h1v1h-1zM22,2h1v1h-1zM24,2h1v1h-1zM25,2h1v1h-1zM26,2h1v1h-1zM28,2h1v1h-1zM0,3h1v1h-1zM2,3h1v1h-1zM3,3h1v1h-1zM4,3h1v1h-1zM6,3h1v1h-1zM8,3h1v1h-1zM9,3h1v1h-1zM11,3h1v1h-1zM13,3h1v1h-1zM14,3h1v1h-1zM15,3h1v1h-1zM16,3h1v1h-1zM17,3h1v1h-1zM19,3h1v1h-1zM22,3h1v1h-1zM24,3h1v1h-1zM25,3h1v1h-1zM26,3h1v1h-1zM28,3h1v1h-1zM0,4h1v1h-1zM2,4h1v1h-1zM3,4h1v1h-1zM4,4h1v1h-1zM6,4h1v1h-1zM10,4h1v1h-1zM12,4h1v1h-1zM13,4h1v1h-1zM16,4h1v1h-1zM17,4h1v1h-1zM18,4h1v1h-1zM19,4h1v1h-1zM22,4h1v1h-1zM24,4h1v1h-1zM25,4h1v1h-1zM26,4h1v1h-1zM28,4h1v1h-1zM0,5h1v1h-1zM6,5h1v1h-1zM8,5h1v1h-1zM10,5h1v1h-1zM15,5h1v1h-1zM16,5h1v1h-1zM17,5h1v1h-1zM20,5h1v1h-1zM22,5h1v1h-1zM28,5h1v1h-1zM0,6h1v1h-1zM1,6h1v1h-1zM2,6h1v1h-1zM3,6h1v1h-1zM4,6h1v1h-1zM5,6h1v1h-1zM6,6h1v1h-1zM8,6h1v1h-1zM10,6h1v1h-1zM12,6h1v1h-1zM14,6h1v1h-1zM16,6h1v1h-1zM18,6h1v1h-1zM20,6h1v1h-1zM22,6h1v1h-1zM23,6h1v1h-1zM24,6h1v1h-1zM25,6h1v1h-1zM26,6h1v1h-1zM27,6h1v1h-1zM28,6h1v1h-1zM12,7h1v1h-1zM14,7h1v1h-1zM15,7h1v1h-1zM16,7h1v1h-1zM20,7h1v1h-1zM0,8h1v1h-1zM1,8h1v1h-1zM2,8h1v1h-1zM3,8h1v1h-1zM4,8h1v1h-1zM6,8h1v1h-1zM7,8h1v1h-1zM8,8h1v1h-1zM9,8h1v1h-1zM10,8h1v1h-1zM12,8h1v1h-1zM13,8h1v1h-1zM14,8h1v1h-1zM15,8h1v1h-1zM17,8h1v1h-1zM19,8h1v1h-1zM21,8h1v1h-1zM23,8h1v1h-1zM25,8h1v1h-1zM27,8h1v1h-1zM1,9h1v1h-1zM3,9h1v1h-1zM5,9h1v1h-1zM9,9h1v1h-1zM16,9h1v1h-1zM17,9h1v1h-1zM18,9h1v1h-1zM19,9h1v1h-1zM20,9h1v1h-1zM21,9h1v1h-1zM22,9h1v1h-1zM23,9h1v1h-1zM24,9h1v1h-1zM28,9h1v1h-1zM3,10h1v1h-1zM4,10h1v1h-1zM5,10h1v1h-1zM6,10h1v1h-1zM9,10h1v1h-1zM11,10h1v1h-1zM12,10h1v1h-1zM13,10h1v1h-1zM15,10h1v1h-1zM16,10h1v1h-1zM20,10h1v1h-1zM21,10h1v1h-1zM22,10h1v1h-1zM1,11h1v1h-1zM3,11h1v1h-1zM9,11h1v1h-1zM10,11h1v1h-1zM11,11h1v1h-1zM14,11h1v1h-1zM23,11h1v1h-1zM25,11h1v1h-1zM27,11h1v1h-1zM0,12h1v1h-1zM3,12h1v1h-1zM4,12h1v1h-1zM6,12h1v1h-1zM9,12h1v1h-1zM11,12h1v1h-1zM13,12h1v1h-1zM14,12h1v1h-1zM15,12h1v1h-1zM16,12h1v1h-1zM17,12h1v1h-1zM18,12h1v1h-1zM25,12h1v1h-1zM26,12h1v1h-1zM3,13h1v1h-1zM8,13h1v1h-1zM9,13h1v1h-1zM10,13h1v1h-1zM12,13h1v1h-1zM13,13h1v1h-1zM16,13h1v1h-1zM17,13h1v1h-1zM18,13h1v1h-1zM19,13h1v1h-1zM20,13h1v1h-1zM21,13h1v1h-1zM22,13h1v1h-1zM24,13h1v1h-1zM28,13h1v1h-1zM0,14h1v1h-1zM6,14h1v1h-1zM9,14h1v1h-1zM15,14h1v1h-1zM16,14h1v1h-1zM17,14h1v1h-1zM22,14h1v1h-1zM23,14h1v1h-1zM25,14h1v1h-1zM26,14h1v1h-1zM0,15h1v1h-1zM2,15h1v1h-1zM3,15h1v1h-1zM5,15h1v1h-1zM8,15h1v1h-1zM9,15h1v1h-1zM12,15h1v1h-1zM14,15h1v1h-1zM16,15h1v1h-1zM19,15h1v1h-1zM21,15h1v1h-1zM22,15h1v1h-1zM23,15h1v1h-1zM24,15h1v1h-1zM27,15h1v1h-1zM2,16h1v1h-1zM3,16h1v1h-1zM6,16h1v1h-1zM7,16h1v1h-1zM10,16h1v1h-1zM12,16h1v1h-1zM13,16h1v1h-1zM14,16h1v1h-1zM16,16h1v1h-1zM17,16h1v1h-1zM20,16h1v1h-1zM23,16h1v1h-1zM25,16h1v1h-1zM26,16h1v1h-1zM0,17h1v1h-1zM4,17h1v1h-1zM5,17h1v1h-1zM7,17h1v1h-1zM8,17h1v1h-1zM9,17h1v1h-1zM10,17h1v1h-1zM13,17h1v1h-1zM15,17h1v1h-1zM16,17h1v1h-1zM19,17h1v1h-1zM20,17h1v1h-1zM22,17h1v1h-1zM23,17h1v1h-1zM24,17h1v1h-1zM26,17h1v1h-1zM28,17h1v1h-1zM0,18h1v1h-1zM2,18h1v1h-1zM3,18h1v1h-1zM4,18h1v1h-1zM6,18h1v1h-1zM7,18h1v1h-1zM9,18h1v1h-1zM11,18h1v1h-1zM12,18h1v1h-1zM13,18h1v1h-1zM14,18h1v1h-1zM15,18h1v1h-1zM16,18h1v1h-1zM18,18h1v1h-1zM20,18h1v1h-1zM21,18h1v1h-1zM23,18h1v1h-1zM26,18h1v1h-1zM0,19h1v1h-1zM3,19h1v1h-1zM8,19h1v1h-1zM11,19h1v1h-1zM14,19h1v1h-1zM18,19h1v1h-1zM19,19h1v1h-1zM20,19h1v1h-1zM22,19h1v1h-1zM23,19h1v1h-1zM24,19h1v1h-1zM27,19h1v1h-1zM0,20h1v1h-1zM3,20h1v1h-1zM5,20h1v1h-1zM6,20h1v1h-1zM7,20h1v1h-1zM8,20h1v1h-1zM9,20h1v1h-1zM10,20h1v1h-1zM11,20h1v1h-1zM13,20h1v1h-1zM14,20h1v1h-1zM15,20h1v1h-1zM16,20h1v1h-1zM17,20h1v1h-1zM20,20h1v1h-1zM21,20h1v1h-1zM22,20h1v1h-1zM23,20h1v1h-1zM24,20h1v1h-1zM26,20h1v1h-1zM27,20h1v1h-1zM28,20h1v1h-1zM8,21h1v1h-1zM10,21h1v1h-1zM12,21h1v1h-1zM14,21h1v1h-1zM16,21h1v1h-1zM20,21h1v1h-1zM24,21h1v1h-1zM25,21h1v1h-1zM26,21h1v1h-1zM27,21h1v1h-1zM28,21h1v1h-1zM0,22h1v1h-1zM1,22h1v1h-1zM2,22h1v1h-1zM3,22h1v1h-1zM4,22h1v1h-1zM5,22h1v1h-1zM6,22h1v1h-1zM8,22h1v1h-1zM9,22h1v1h-1zM13,22h1v1h-1zM15,22h1v1h-1zM19,22h1v1h-1zM20,22h1v1h-1zM22,22h1v1h-1zM24,22h1v1h-1zM25,22h1v1h-1zM26,22h1v1h-1zM0,23h1v1h-1zM6,23h1v1h-1zM9,23h1v1h-1zM12,23h1v1h-1zM14,23h1v1h-1zM15,23h1v1h-1zM16,23h1v1h-1zM19,23h1v1h-1zM20,23h1v1h-1zM24,23h1v1h-1zM28,23h1v1h-1zM0,24h1v1h-1zM2,24h1v1h-1zM3,24h1v1h-1zM4,24h1v1h-1zM6,24h1v1h-1zM8,24h1v1h-1zM10,24h1v1h-1zM12,24h1v1h-1zM13,24h1v1h-1zM17,24h1v1h-1zM20,24h1v1h-1zM21,24h1v1h-1zM22,24h1v1h-1zM23,24h1v1h-1zM24,24h1v1h-1zM26,24h1v1h-1zM27,24h1v1h-1zM28,24h1v1h-1zM0,25h1v1h-1zM2,25h1v1h-1zM3,25h1v1h-1zM4,25h1v1h-1zM6,25h1v1h-1zM8,25h1v1h-1zM13,25h1v1h-1zM16,25h1v1h-1zM17,25h1v1h-1zM18,25h1v1h-1zM19,25h1v1h-1zM23,25h1v1h-1zM25,25h1v1h-1zM26,25h1v1h-1zM27,25h1v1h-1zM28,25h1v1h-1zM0,26h1v1h-1zM2,26h1v1h-1zM3,26h1v1h-1zM4,26h1v1h-1zM6,26h1v1h-1zM8,26h1v1h-1zM10,26h1v1h-1zM11,26h1v1h-1zM12,26h1v1h-1zM13,26h1v1h-1zM14,26h1v1h-1zM15,26h1v1h-1zM16,26h1v1h-1zM17,26h1v1h-1zM18,26h1v1h-1zM22,26h1v1h-1zM23,26h1v1h-1zM24,26h1v1h-1zM25,26h1v1h-1zM26,26h1v1h-1zM27,26h1v1h-1zM0,27h1v1h-1zM6,27h1v1h-1zM8,27h1v1h-1zM10,27h1v1h-1zM11,27h1v1h-1zM14,27h1v1h-1zM16,27h1v1h-1zM18,27h1v1h-1zM20,27h1v1h-1zM23,27h1v1h-1zM25,27h1v1h-1zM27,27h1v1h-1zM0,28h1v1h-1zM1,28h1v1h-1zM2,28h1v1h-1zM3,28h1v1h-1zM4,28h1v1h-1zM5,28h1v1h-1zM6,28h1v1h-1zM8,28h1v1h-1zM9,28h1v1h-1zM11,28h1v1h-1zM12,28h1v1h-1zM17,28h1v1h-1zM19,28h1v1h-1zM21,28h1v1h-1zM23,28h1v1h-1zM24,28h1v1h-1zM25,28h1v1h-1zM26,28h1v1h-1z"/></svg>`;
  },

  // Obtener datos completos del cliente vinculado a la factura
  resolveClienteFactura(factura) {
    if (!factura) return { telefono: '829-725-4450', whatsapp: '829-725-4450', direccion: 'Santo Domingo, RD', tieneTelefonoCliente: false };
    const clientes = (window.store && window.store.getClientes) ? (window.store.getClientes() || []) : [];
    let cli = null;
    if (factura.clienteId) {
      cli = clientes.find(c => c && c.id === factura.clienteId);
    }
    if (!cli && factura.clienteNombre) {
      const nombreNorm = factura.clienteNombre.trim().toLowerCase();
      cli = clientes.find(c => c && (c.nombre || '').trim().toLowerCase() === nombreNorm);
    }

    const rawPhone = (cli && (cli.whatsapp || cli.telefono)) || factura.clienteTelefono || '';
    const digits = rawPhone.replace(/\D/g, '');
    const tieneTelefonoCliente = digits.length >= 7;

    return {
      telefono: (cli && cli.telefono) || factura.clienteTelefono || '829-725-4450',
      whatsapp: rawPhone || '',
      direccion: (cli && cli.direccion) || factura.clienteDireccion || 'Santo Domingo, RD',
      tieneTelefonoCliente
    };
  },

  render(container) {
    if (!container) return;

    try {
      const facturas = (window.store && window.store.getFacturas) ? (window.store.getFacturas() || []) : [];

      const filtered = facturas.filter(f => {
        if (!f) return false;
        if (this.activeFilter === 'pagadas' && f.estado !== 'Pagada') return false;
        if (this.activeFilter === 'pendientes' && f.estado !== 'Pendiente') return false;

        if (this.searchQuery) {
          const q = this.searchQuery.toLowerCase();
          return (f.numero || '').toLowerCase().includes(q) ||
                 (f.clienteNombre || '').toLowerCase().includes(q);
        }
        return true;
      });

      container.innerHTML = `
        <!-- Cabecera de Facturacion -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Facturas</h2>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Comprobantes de servicios, envio directo al cliente por WhatsApp y codigo QR oficial</p>
          </div>
          <button class="btn btn-primary" onclick="App.openModal('modalGenerarFactura')">
            <span class="icon">
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </span>
            + Generar factura
          </button>
        </div>

        <!-- Buscador y Filtros -->
        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
          <div class="search-bar-wrapper">
            <span class="search-bar-icon icon">
              <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </span>
            <input
              type="text"
              id="facturaSearchInput"
              class="search-bar-input"
              placeholder="Buscar factura por cliente o numero..."
              value="${this.searchQuery}"
              oninput="FacturacionModule.onSearch(this.value)"
            >
          </div>

          <div class="filter-pills">
            <button class="filter-pill ${this.activeFilter === 'todas' ? 'active' : ''}" onclick="FacturacionModule.setFilter('todas')">
              Todas (${facturas.length})
            </button>
            <button class="filter-pill ${this.activeFilter === 'pagadas' ? 'active' : ''}" onclick="FacturacionModule.setFilter('pagadas')">
              Pagadas (${facturas.filter(f => f.estado === 'Pagada').length})
            </button>
            <button class="filter-pill ${this.activeFilter === 'pendientes' ? 'active' : ''}" onclick="FacturacionModule.setFilter('pendientes')">
              Pendientes (${facturas.filter(f => f.estado === 'Pendiente').length})
            </button>
          </div>
        </div>

        <!-- Listado de Facturas con Botones Directos para Enviar al Cliente y Ver QR -->
        <div class="list-container">
          ${facturas.length === 0 ? `
            <div class="card" style="text-align: center; padding: 48px 20px;">
              <span style="font-size: 40px; display: block; margin-bottom: 12px;">📄</span>
              <h3 style="font-size: 17px; font-weight: 700; color: var(--color-primary); margin-bottom: 6px;">No hay facturas registradas</h3>
              <p style="font-size: 14px; color: var(--text-muted); max-width: 460px; margin: 0 auto 20px auto;">
                Genera facturas oficiales y envialas al instante a tus clientes por WhatsApp o PDF con codigo QR de PUJOLS Servicios.
              </p>
              <button class="btn btn-primary" onclick="App.openModal('modalGenerarFactura')">
                <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></span>
                + Generar Primera Factura
              </button>
            </div>
          ` : (filtered.length === 0 ? `
            <div class="card" style="text-align: center; padding: 40px 20px;">
              <p style="font-size: 16px; color: var(--text-muted); margin-bottom: 12px;">No se encontraron facturas con los filtros seleccionados.</p>
              <button class="btn btn-outline btn-sm" onclick="FacturacionModule.setFilter('todas'); FacturacionModule.onSearch('');">Ver todas</button>
            </div>
          ` : filtered.map(f => {
            const concepto = (f.items && f.items[0] && f.items[0].descripcion) ? f.items[0].descripcion : 'Servicio tecnico PUJOLS Servicios';
            return `
              <div class="invoice-item-card" style="flex-direction: column; align-items: stretch; gap: 12px; cursor: pointer;" onclick="FacturacionModule.openInvoicePreview('${f.numero}')">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
                  <div class="invoice-left">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span class="invoice-number">${f.numero}</span>
                      <button 
                        class="badge ${f.estado === 'Pagada' ? 'badge-pagada' : 'badge-pendiente'}" 
                        style="cursor: pointer; border: none; padding: 3px 10px; font-weight: 700;"
                        title="Clic para cambiar estado a ${f.estado === 'Pagada' ? 'Pendiente' : 'Pagada'}"
                        onclick="event.stopPropagation(); FacturacionModule.toggleEstadoRapido('${f.numero}')">
                        ${f.estado === 'Pagada' ? '✅ Pagada' : '⏳ Pendiente'} ⇄
                      </button>
                    </div>
                    <div class="invoice-client" style="font-weight: 700; color: var(--color-primary); margin-top: 2px;">👤 ${f.clienteNombre}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">🔧 ${concepto}</div>
                    <div class="invoice-date">📅 ${f.fecha || f.fechaTexto || 'Hoy'}</div>
                  </div>
                  <div class="invoice-right" style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                    <div class="invoice-amount" style="font-size: 18px;">RD$ ${(Number(f.total) || 0).toLocaleString('en-US')}</div>
                  </div>
                </div>

                <!-- Barra de acciones visibles directamente en cada factura para enviar al cliente -->
                <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; flex-wrap: wrap; padding-top: 10px; border-top: 1px dashed var(--border-color);">
                  <button type="button" class="btn btn-sm" style="background: #25D366; color: #FFFFFF; border-color: #25D366; font-weight: 700;" onclick="event.stopPropagation(); FacturacionModule.compartirWhatsApp('${f.numero}')">
                    💬 Enviar al Cliente (WhatsApp)
                  </button>
                  <button type="button" class="btn btn-sm btn-primary" onclick="event.stopPropagation(); FacturacionModule.openInvoicePreview('${f.numero}')">
                    👁️ Ver Factura y QR
                  </button>
                  <button type="button" class="btn btn-sm btn-outline" onclick="event.stopPropagation(); FacturacionModule.openAndPrint('${f.numero}')">
                    🖨️ PDF
                  </button>
                  <button type="button" class="btn btn-sm btn-outline" style="border-color: #EF4444; color: #EF4444;" onclick="event.stopPropagation(); FacturacionModule.confirmDelete('${f.numero}')" title="Eliminar factura">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join(''))}
        </div>
      `;
    } catch (err) {
      console.error('Error renderizando facturacion:', err);
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px 20px;">
          <p style="color: #EF4444; font-weight: 700; margin-bottom: 8px;">Ocurrio un inconveniente al cargar las facturas.</p>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">${err.message || ''}</p>
          <button class="btn btn-primary btn-sm" onclick="App.refreshCurrentScreen()">Reintentar</button>
        </div>
      `;
    }
  },

  setFilter(filter) {
    this.activeFilter = filter;
    const container = document.getElementById('view-facturacion');
    if (container) this.render(container);
  },

  onSearch(query) {
    this.searchQuery = query;
    const container = document.getElementById('view-facturacion');
    if (container) {
      this.render(container);
      const input = document.getElementById('facturaSearchInput');
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
      }
    }
  },

  openAndPrint(numero) {
    this.openInvoicePreview(numero);
    setTimeout(() => {
      window.print();
    }, 250);
  },

  compartirWhatsAppActual() {
    if (this.currentPreviewNumero) {
      this.compartirWhatsApp(this.currentPreviewNumero);
    }
  },

  openInvoicePreview(numero) {
    try {
      const facturas = (window.store && window.store.getFacturas) ? (window.store.getFacturas() || []) : [];
      const numBuscado = String(numero || '').trim().toLowerCase();
      const factura = facturas.find(f => f && String(f.numero || '').trim().toLowerCase() === numBuscado) ||
                      facturas.find(f => f && f.numero == numero) ||
                      facturas[0];

      if (!factura) {
        alert('No hay facturas disponibles para visualizar.');
        return;
      }

      this.currentPreviewNumero = factura.numero;

      // Eliminar cualquier modal viejo si existe
      const viejo = document.getElementById('modalVisorFactura');
      if (viejo) viejo.remove();

      const empresa = (window.store && typeof window.store.getEmpresa === 'function')
        ? window.store.getEmpresa()
        : ((window.store && window.store.state && window.store.state.empresa) || (window.INITIAL_STATE && window.INITIAL_STATE.empresa) || {
            nombre: "PUJOLS Servicios",
            subtitulo: "AIRE Y REFRIGERACIÓN",
            lema: "Servicio confiable, equipos en buenas manos.",
            rnc: "1-32-45678-9",
            telefono: "829-725-4450",
            whatsapp: "829-725-4450",
            correo: "pujolsservicios@gmail.com",
            direccion: "Av. 27 de Febrero #204, Santo Domingo, Rep. Dominicana",
            moneda: "RD$"
          });

      const datosCli = this.resolveClienteFactura(factura);

      // Crear el modal directamente con todo su contenido inyectado
      const modal = document.createElement('div');
      modal.id = 'modalVisorFactura';
      modal.className = 'modal-backdrop open';
      modal.style.cssText = 'position:fixed !important; inset:0 !important; z-index:99999 !important; display:flex !important; align-items:center !important; justify-content:center !important; background:rgba(10,37,64,0.75) !important; padding:12px !important; opacity:1 !important; visibility:visible !important;';

      modal.innerHTML = `
        <div class="modal-content modal-lg" style="background:#FFFFFF !important; max-width:760px !important; width:100% !important; max-height:92vh !important; display:flex !important; flex-direction:column !important; border-radius:14px !important; overflow:hidden !important; box-shadow:0 12px 36px rgba(0,0,0,0.3) !important;">
          <div class="modal-header" style="padding:14px 18px; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center; background:#F8FAFC;">
            <h3 class="modal-title" style="margin:0; font-size:16px; font-weight:800; color:#0A2540;">Vista Previa de Factura</h3>
            <div style="display:flex; gap:8px; align-items:center;">
              <button class="btn btn-sm btn-primary" onclick="FacturacionModule.printInvoice()">🖨️ Imprimir / PDF</button>
              <button class="modal-close-btn" onclick="FacturacionModule.closeInvoicePreview()" style="background:none; border:none; font-size:20px; font-weight:700; color:#64748B; cursor:pointer; padding:4px 8px;">✕</button>
            </div>
          </div>

          <div class="modal-body" id="facturaPreviewContent" style="padding:16px; overflow-y:auto; flex:1;">
            <!-- Barra Superior de Envio Rapido al Cliente -->
            <div class="no-print" style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:10px; padding:12px 14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
              <div style="font-size:12.5px; color:#166534; font-weight:700;">
                ✅ Factura <strong>${factura.numero}</strong> lista para enviar a <strong>${factura.clienteNombre}</strong>
              </div>
              <button type="button" class="btn btn-sm" style="background:#25D366; color:#FFFFFF; border-color:#25D366; font-weight:700;" onclick="FacturacionModule.compartirWhatsApp('${factura.numero}')">
                💬 Enviar por WhatsApp al Cliente
              </button>
            </div>

            <div class="invoice-paper" id="printableInvoiceArea" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:20px;">
              <!-- Encabezado de Factura -->
              <div class="invoice-header-row" style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #E0F2FE; padding-bottom:14px; margin-bottom:16px;">
                <div class="invoice-logo-box">
                  <img src="assets/logo.jpg" alt="PUJOLS Servicios" class="invoice-logo-img" style="height:80px; max-width:200px; object-fit:contain;">
                </div>
                <div class="invoice-meta-right" style="text-align:right;">
                  <div class="invoice-big-title" style="font-size:20px; font-weight:800; color:#0A2540;">FACTURA</div>
                  <div class="invoice-num-text" style="font-size:15px; font-weight:800; color:#00AEEF;">No. ${factura.numero}</div>
                  <div class="invoice-date-text" style="font-size:12px; color:#64748B;">Fecha: ${factura.fecha}</div>
                  <div style="margin-top:4px;">
                    <span class="badge ${factura.estado === 'Pagada' ? 'badge-pagada' : 'badge-pendiente'}" style="font-size:12px; padding:4px 10px; font-weight:700;">
                      Estado: ${factura.estado}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Datos de la Empresa y del Cliente -->
              <div class="invoice-client-section" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; background:#F8FAFC; padding:12px 14px; border-radius:8px; margin-bottom:16px; font-size:12.5px;">
                <div>
                  <div style="font-size:11px; text-transform:uppercase; color:#94A3B8; font-weight:700; margin-bottom:4px;">Emisor:</div>
                  <strong style="font-size:13.5px; color:#0A2540;">${empresa.nombre || 'PUJOLS Servicios'}</strong><br>
                  <span>RNC: ${empresa.rnc || '1-32-45678-9'}</span><br>
                  <span>Tel / WhatsApp: 829-725-4450</span><br>
                  <span>Técnico: George Pujols</span><br>
                  <span>${empresa.direccion || 'Santo Domingo, Rep. Dominicana'}</span>
                </div>
                <div>
                  <div style="font-size:11px; text-transform:uppercase; color:#94A3B8; font-weight:700; margin-bottom:4px;">Facturado a:</div>
                  <strong style="font-size:13.5px; color:#0A2540;">${factura.clienteNombre}</strong><br>
                  <span>Tel: ${datosCli.telefono}</span><br>
                  <span>Dirección: ${datosCli.direccion}</span>
                </div>
              </div>

              <!-- Tabla de Items -->
              <table class="invoice-table" style="width:100%; border-collapse:collapse; margin-bottom:16px;">
                <thead>
                  <tr style="background:#0A2540; color:#FFFFFF;">
                    <th style="padding:8px 10px; text-align:left; font-size:12px;">Descripción</th>
                    <th style="padding:8px 10px; text-align:right; font-size:12px;">Cant.</th>
                    <th style="padding:8px 10px; text-align:right; font-size:12px;">Precio Unit.</th>
                    <th style="padding:8px 10px; text-align:right; font-size:12px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${(factura.items || []).map(item => `
                    <tr style="border-bottom:1px solid #E2E8F0; font-size:12.5px;">
                      <td style="padding:10px;"><strong>${item.descripcion}</strong></td>
                      <td style="padding:10px; text-align:right;">${item.cantidad}</td>
                      <td style="padding:10px; text-align:right;">RD$ ${Number(item.precioUnitario).toLocaleString('en-US')}</td>
                      <td style="padding:10px; text-align:right;"><strong>RD$ ${Number(item.total).toLocaleString('en-US')}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Totales -->
              <div class="invoice-totals-row" style="display:flex; justify-content:flex-end; margin-bottom:16px;">
                <div class="invoice-totals-table" style="width:240px; font-size:13px;">
                  <div style="display:flex; justify-content:space-between; padding:4px 0; color:#64748B;">
                    <span>Subtotal:</span>
                    <span>RD$ ${(Number(factura.subtotal) || Number(factura.total) || 0).toLocaleString('en-US')}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; padding:4px 0; color:#64748B;">
                    <span>Descuento:</span>
                    <span>RD$ ${(Number(factura.descuento) || 0).toLocaleString('en-US')}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; border-top:2px solid #0A2540; color:#0A2540; font-size:16px; font-weight:800; padding-top:6px; margin-top:4px;">
                    <span>Total:</span>
                    <span>RD$ ${(Number(factura.total) || 0).toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>

              <!-- Pie con QR Oficial -->
              <div class="invoice-footer-decorative" style="display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap; border-top:1px dashed #CBD5E1; padding-top:14px;">
                <div class="invoice-thanks-text" style="font-size:12px; color:#64748B; line-height:1.4;">
                  <strong style="color:#0A2540;">¡Gracias por confiar en PUJOLS Servicios!</strong><br>
                  Servicio confiable, equipos en buenas manos.<br>
                  <span style="font-size:11px; color:#94A3B8;">Especialistas en Aires Acondicionados, Neveras y Lavadoras</span><br>
                  <div style="margin-top:6px; font-size:11px; color:#0A2540; font-weight:600; line-height:1.4;">
                    📸 Instagram: <strong>@pujols_servicios</strong> &nbsp;•&nbsp; 📘 Facebook: <strong>Pujols Servicios</strong><br>
                    📞 Tel / WhatsApp: <strong>829 725 4450</strong> &nbsp;•&nbsp; 👨‍🔧 <strong>George Pujols</strong>
                  </div>
                </div>

                <div style="display:flex; flex-direction:column; align-items:center; gap:4px; text-align:center;">
                  <div 
                    class="invoice-qr-box" 
                    onclick="window.open('https://www.instagram.com/pujols_servicios/', '_blank')"
                    style="width:84px; height:84px; min-width:84px; background:#FFFFFF; padding:4px; border:2px solid #00AEEF; border-radius:8px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.08); cursor:pointer;" 
                    title="Escanea con tu cámara o haz clic para visitar @pujols_servicios en Instagram">
                    ${this.getQrSvgHtml()}
                  </div>
                  <div style="font-size:9.5px; font-weight:700; color:#0A2540; line-height:1.25;">
                    <strong style="color:#0A2540; font-size:10px;">PUJOLS Servicios</strong><br>
                    ⭐ Escanea para opinar<br>
                    <span style="color:#DD2A7B; font-weight:800;">@pujols_servicios</span><br>
                    <span style="display:inline-block; margin-top:2px; color:#166534; font-size:10px; font-weight:800; background:#DCFCE7; padding:1px 6px; border-radius:4px;">
                      📞 829 725 4450
                    </span>
                  </div>
                </div>
              </div>

              <div class="invoice-bottom-wave" style="height:6px; background:linear-gradient(90deg, #0A2540 0%, #00AEEF 100%); margin-top:16px; border-radius:3px;"></div>
            </div>
          </div>

          <div class="modal-footer" id="facturaPreviewFooter" style="padding:12px 18px; border-top:1px solid #E2E8F0; background:#F8FAFC; display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn" style="background:#25D366; color:#FFFFFF; border-color:#25D366; font-weight:700;" onclick="FacturacionModule.compartirWhatsApp('${factura.numero}')">
              💬 Enviar por WhatsApp al Cliente
            </button>
            <button type="button" class="btn btn-primary" onclick="FacturacionModule.printInvoice()">
              🖨️ Imprimir / Guardar PDF
            </button>
            ${factura.estado === 'Pagada' ? `
              <button type="button" class="btn btn-outline" style="border-color:#F59E0B; color:#B45309; background:#FFFBEB;" onclick="FacturacionModule.cambiarEstado('${factura.numero}', 'Pendiente')">
                🔄 Cambiar a Pendiente
              </button>
            ` : `
              <button type="button" class="btn btn-soft" style="background:#D1FAE5; color:#065F46; font-weight:600;" onclick="FacturacionModule.cambiarEstado('${factura.numero}', 'Pagada')">
                ✅ Marcar como Pagada
              </button>
            `}
            <button type="button" class="btn btn-outline" onclick="FacturacionModule.closeInvoicePreview()">
              Cerrar
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
    } catch(err) {
      console.error('Error abriendo visor de factura:', err);
      alert('Inconveniente al abrir factura: ' + err.message);
    }
  },

  closeInvoicePreview() {
    this.currentPreviewNumero = null;
    const modal = document.getElementById('modalVisorFactura');
    if (modal) {
      modal.remove();
    }
    document.body.style.overflow = '';
  },

  printInvoice() {
    window.print();
  },

  cambiarEstado(numero, nuevoEstado) {
    window.store.cambiarEstadoFactura(numero, nuevoEstado);
    const container = document.getElementById('view-facturacion');
    if (container) this.render(container);
    if (window.DashboardModule && document.getElementById('view-inicio')) {
      const dbContainer = document.getElementById('view-inicio');
      window.DashboardModule.render(dbContainer);
    }
    this.openInvoicePreview(numero);
  },

  toggleEstadoRapido(numero) {
    const fac = window.store.getFacturas().find(f => f.numero === numero);
    if (!fac) return;
    const nuevo = fac.estado === 'Pagada' ? 'Pendiente' : 'Pagada';
    window.store.cambiarEstadoFactura(numero, nuevo);
    const container = document.getElementById('view-facturacion');
    if (container) this.render(container);
    if (window.DashboardModule && document.getElementById('view-inicio')) {
      const dbContainer = document.getElementById('view-inicio');
      window.DashboardModule.render(dbContainer);
    }
  },

  marcarPagada(numero) {
    this.cambiarEstado(numero, 'Pagada');
  },

  compartirWhatsApp(numero) {
    const facturas = (window.store && window.store.getFacturas) ? (window.store.getFacturas() || []) : [];
    const numBuscado = String(numero || '').trim().toLowerCase();
    const factura = facturas.find(f => f && String(f.numero || '').trim().toLowerCase() === numBuscado) ||
                    facturas.find(f => f && f.numero == numero);
    if (!factura) return;

    const datosCli = this.resolveClienteFactura(factura);
    const nombreCliente = factura.clienteNombre || 'Cliente';
    const tratamiento = nombreCliente.includes('&') || nombreCliente.toLowerCase().includes('s.r.l') || nombreCliente.toLowerCase().includes('constructora')
      ? 'Estimados señores de'
      : 'Estimado/a Sr./Sra.';

    const itemsDetalle = (factura.items && factura.items.length > 0)
      ? factura.items.map(i => `• ${i.descripcion} (Cant: ${i.cantidad || 1}) — RD$ ${(Number(i.total) || 0).toLocaleString('en-US')}`).join('\n')
      : `• Servicio tecnico — RD$ ${(Number(factura.total) || 0).toLocaleString('en-US')}`;

    const estadoTexto = factura.estado === 'Pagada' ? '✅ PAGADA' : '⏳ PENDIENTE DE PAGO';

    const msg = `${tratamiento} *${nombreCliente}*, reciba un cordial saludo de *PUJOLS Servicios* (Aire y Refrigeración).\n\n` +
      `🧾 *COMPROBANTE / FACTURA DE SERVICIO*\n` +
      `📄 *Factura No.:* ${factura.numero}\n` +
      `📅 *Fecha:* ${factura.fecha}\n` +
      `📌 *Estado:* ${estadoTexto}\n\n` +
      `🔧 *Detalle del Servicio:*\n${itemsDetalle}\n\n` +
      `💰 *TOTAL:* *RD$ ${(Number(factura.total) || 0).toLocaleString('en-US')}*\n\n` +
      `👨‍🔧 *Tecnico:* George Pujols\n` +
      `📞 *Tel / WhatsApp:* 829-725-4450\n` +
      `⭐ *Siguenos y dejanos tu opinion en Instagram:*\nhttps://www.instagram.com/pujols_servicios/\n\n` +
      `¡Gracias por confiar en *PUJOLS Servicios*! Servicio confiable, equipos en buenas manos.`;

    let waUrl = '';
    if (datosCli.tieneTelefonoCliente && window.PhoneUtil) {
      waUrl = window.PhoneUtil.buildWhatsAppUrl(datosCli.whatsapp || datosCli.telefono, msg);
    } else if (datosCli.tieneTelefonoCliente) {
      const digits = (datosCli.whatsapp || datosCli.telefono).replace(/\D/g, '');
      waUrl = `https://wa.me/1${digits}?text=${encodeURIComponent(msg)}`;
    } else {
      waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    }

    window.open(waUrl, '_blank');
  },

  confirmDelete(numero) {
    if (confirm(`¿Esta seguro de eliminar la factura #${numero}?\n\nSi estaba marcada como pagada, se revertira su impacto en los ingresos de finanzas.`)) {
      window.store.deleteFactura(numero);
      this.closeInvoicePreview();
      const container = document.getElementById('view-facturacion');
      if (container) this.render(container);
      if (window.DashboardModule && document.getElementById('view-inicio')) {
        const dbContainer = document.getElementById('view-inicio');
        window.DashboardModule.render(dbContainer);
      }
      alert('Factura eliminada.');
    }
  }
};

window.FacturacionModule = FacturacionModule;
