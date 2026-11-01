// PUJOLS Servicios - Módulo Facturación y Vista Previa PDF

const FacturacionModule = {
  activeFilter: 'todas', // 'todas' | 'pagadas' | 'pendientes'
  searchQuery: '',

  render(container) {
    const facturas = window.store.getFacturas();

    const filtered = facturas.filter(f => {
      // Estado filter
      if (this.activeFilter === 'pagadas' && f.estado !== 'Pagada') return false;
      if (this.activeFilter === 'pendientes' && f.estado !== 'Pendiente') return false;

      // Search filter
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        return f.numero.toLowerCase().includes(q) ||
               f.clienteNombre.toLowerCase().includes(q);
      }
      return true;
    });

    container.innerHTML = `
      <!-- Cabecera de Facturación -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Facturas</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Comprobantes de servicios, cobros realizados y cuentas por cobrar</p>
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
            placeholder="Buscar factura por cliente o número..."
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

      <!-- Listado de Facturas -->
      <div class="list-container">
        ${filtered.length === 0 ? `
          <div class="card" style="text-align: center; padding: 40px 20px;">
            <p style="font-size: 16px; color: var(--text-muted); margin-bottom: 12px;">No se encontraron facturas con los filtros seleccionados.</p>
            <button class="btn btn-outline btn-sm" onclick="FacturacionModule.setFilter('todas'); FacturacionModule.onSearch('');">Ver todas</button>
          </div>
        ` : filtered.map(f => `
          <div class="invoice-item-card" onclick="FacturacionModule.openInvoicePreview('${f.numero}')">
            <div class="invoice-left">
              <div class="invoice-number">${f.numero}</div>
              <div class="invoice-client">${f.clienteNombre}</div>
              <div class="invoice-date">${f.fechaTexto || f.fecha}</div>
            </div>
            <div class="invoice-right" style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
              <div class="invoice-amount">RD$ ${f.total.toLocaleString('en-US')}</div>
              <button 
                class="badge ${f.estado === 'Pagada' ? 'badge-pagada' : 'badge-pendiente'}" 
                style="cursor: pointer; border: none; padding: 4px 10px; font-weight: 600;"
                title="Clic para cambiar estado a ${f.estado === 'Pagada' ? 'Pendiente' : 'Pagada'}"
                onclick="event.stopPropagation(); FacturacionModule.toggleEstadoRapido('${f.numero}')">
                ${f.estado === 'Pagada' ? '✅ Pagada' : '⏳ Pendiente'} ⇄
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Modal Visor de Factura PDF -->
      <div id="modalVisorFactura" class="modal-backdrop">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3 class="modal-title">Vista Previa de Factura</h3>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="btn btn-primary btn-sm" onclick="FacturacionModule.printInvoice()">
                🖨️ Imprimir / PDF
              </button>
              <button class="modal-close-btn" onclick="FacturacionModule.closeInvoicePreview()">
                <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
              </button>
            </div>
          </div>
          <div class="modal-body" id="facturaPreviewContent">
            <!-- Dynamic PDF Paper Content -->
          </div>
          <div class="modal-footer" id="facturaPreviewFooter">
            <!-- Dynamic footer actions (Marcar Pagada, WhatsApp, Cerrar) -->
          </div>
        </div>
      </div>
    `;
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

  openInvoicePreview(numero) {
    const factura = window.store.getFacturas().find(f => f.numero === numero);
    if (!factura) return;

    const empresa = window.store.getEmpresa();
    const contentEl = document.getElementById('facturaPreviewContent');
    const footerEl = document.getElementById('facturaPreviewFooter');

    if (contentEl) {
      contentEl.innerHTML = `
        <div class="invoice-paper" id="printableInvoiceArea">
          <!-- Encabezado de Factura con Logo Oficial PUJOLS -->
          <div class="invoice-header-row">
            <div class="invoice-logo-box">
              <img src="assets/logo.jpg" alt="PUJOLS Servicios" class="invoice-logo-img">
            </div>
            <div class="invoice-meta-right">
              <div class="invoice-big-title">FACTURA</div>
              <div class="invoice-num-text">No. ${factura.numero}</div>
              <div class="invoice-date-text">Fecha: ${factura.fecha}</div>
              <div style="margin-top: 4px;">
                <span class="badge ${factura.estado === 'Pagada' ? 'badge-pagada' : 'badge-pendiente'}" style="font-size: 12px; padding: 4px 12px;">
                  Estado: ${factura.estado}
                </span>
              </div>
            </div>
          </div>

          <!-- Datos de la Empresa y del Cliente -->
          <div class="invoice-client-section">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-light); font-weight: 700; margin-bottom: 4px;">Emisor:</div>
              <strong style="font-size: 14px; color: var(--color-primary);">${empresa.nombre}</strong><br>
              <span>RNC: ${empresa.rnc}</span><br>
              <span>Tel: ${empresa.telefono}</span><br>
              <span>${empresa.direccion}</span>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-light); font-weight: 700; margin-bottom: 4px;">Facturado a:</div>
              <strong style="font-size: 14px; color: var(--color-primary);">${factura.clienteNombre}</strong><br>
              <span>Tel: ${factura.clienteTelefono || '809-555-1234'}</span><br>
              <span>Dirección: ${factura.clienteDireccion || 'Santo Domingo, RD'}</span>
            </div>
          </div>

          <!-- Tabla de Ítems / Servicios -->
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cant.</th>
                <th>Precio Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${(factura.items || []).map(item => `
                <tr>
                  <td><strong>${item.descripcion}</strong></td>
                  <td>${item.cantidad}</td>
                  <td>RD$ ${Number(item.precioUnitario).toLocaleString('en-US')}</td>
                  <td><strong>RD$ ${Number(item.total).toLocaleString('en-US')}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Totales -->
          <div class="invoice-totals-row">
            <div class="invoice-totals-table">
              <div class="line">
                <span>Subtotal:</span>
                <span>RD$ ${(factura.subtotal || factura.total).toLocaleString('en-US')}</span>
              </div>
              <div class="line">
                <span>Descuento:</span>
                <span>RD$ ${(factura.descuento || 0).toLocaleString('en-US')}</span>
              </div>
              <div class="line grand-total">
                <span>Total:</span>
                <span>RD$ ${factura.total.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          <!-- Pie y Agradecimiento con onda decorativa -->
          <div class="invoice-footer-decorative" style="display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap;">
            <div class="invoice-thanks-text">
              <strong>¡Gracias por confiar en PUJOLS Servicios!</strong><br>
              Servicio confiable, equipos en buenas manos.<br>
              <span style="font-size: 11px; color: var(--text-light);">Especialistas en Aires Acondicionados, Neveras y Lavadoras</span><br>
              <div style="margin-top: 6px; font-size: 11px; color: var(--color-primary); font-weight: 600;">
                📸 Instagram: <strong>@pujols_servicios</strong> &nbsp;•&nbsp; 📘 Facebook: <strong>Pujols Servicios</strong>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center;">
              <a href="https://jhoelpeguero68-star.github.io/pujols-servicios/?encuesta=1&factura=${factura.numero}" target="_blank" style="text-decoration: none;">
                <div class="invoice-qr-box" style="width: 82px; height: 82px; min-width: 82px; background: #ffffff; padding: 4px; border: 1.5px solid #00AEEF; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.06); cursor: pointer;" title="Haz clic o escanea para opinar en Instagram">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('https://jhoelpeguero68-star.github.io/pujols-servicios/?encuesta=1&factura=' + factura.numero)}" 
                    alt="QR Encuesta de Satisfacción en Instagram y Facebook" 
                    style="width: 100%; height: 100%; object-fit: contain; display: block;"
                    onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';"
                  />
                  <div style="display: none; text-align: center; font-size: 8px; color: #0A2540; font-weight: 700; line-height: 1.1;">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#0A2540" stroke-width="2" style="margin: 0 auto 2px auto; display: block;"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    ⭐ Encuesta
                  </div>
                </div>
              </a>
              <span style="font-size: 9px; font-weight: 700; color: #0A2540; line-height: 1.15;">
                ⭐ Escanea para opinar<br><span style="color: #DD2A7B;">Instagram</span> y <span style="color: #1877F2;">Facebook</span>
              </span>
            </div>
          </div>

          <div class="invoice-bottom-wave"></div>
        </div>
      `;
    }

    if (footerEl) {
      footerEl.innerHTML = `
        ${factura.estado === 'Pagada' ? `
          <button class="btn btn-outline" style="border-color: #F59E0B; color: #B45309; background: #FFFBEB;" onclick="FacturacionModule.cambiarEstado('${factura.numero}', 'Pendiente')">
            🔄 Cambiar a Pendiente
          </button>
        ` : `
          <button class="btn btn-soft" style="background: #D1FAE5; color: #065F46; font-weight: 600;" onclick="FacturacionModule.cambiarEstado('${factura.numero}', 'Pagada')">
            ✅ Marcar como Pagada
          </button>
        `}
        <button class="btn btn-outline" onclick="FacturacionModule.compartirWhatsApp('${factura.numero}')">
          💬 Compartir por WhatsApp
        </button>
        <button class="btn btn-primary" onclick="FacturacionModule.printInvoice()">
          🖨️ Imprimir / Guardar PDF
        </button>
      `;
    }

    const modal = document.getElementById('modalVisorFactura');
    if (modal) modal.classList.add('open');
  },

  closeInvoicePreview() {
    const modal = document.getElementById('modalVisorFactura');
    if (modal) modal.classList.remove('open');
  },

  printInvoice() {
    window.print();
  },

  cambiarEstado(numero, nuevoEstado) {
    window.store.cambiarEstadoFactura(numero, nuevoEstado);
    this.openInvoicePreview(numero);
    const container = document.getElementById('view-facturacion');
    if (container) this.render(container);
    if (window.DashboardModule && document.getElementById('view-inicio')) {
      const dbContainer = document.getElementById('view-inicio');
      window.DashboardModule.render(dbContainer);
    }
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
    const factura = window.store.getFacturas().find(f => f.numero === numero);
    if (!factura) return;
    const phone = (factura.clienteTelefono || '8095550100').replace(/\D/g, '');
    const tratamiento = factura.clienteNombre.includes('&') || factura.clienteNombre.toLowerCase().includes('s.r.l') || factura.clienteNombre.toLowerCase().includes('constructora')
      ? 'Estimados señores de'
      : 'Estimado/a Sr./Sra.';
    const msg = `${tratamiento} ${factura.clienteNombre}, reciba un cordial saludo de PUJOLS Servicios.\n\nLe compartimos el detalle de su comprobante/factura ${factura.numero} por un total de RD$ ${factura.total.toLocaleString('en-US')}.\n\n¡Gracias por confiar en nuestros servicios de aire y refrigeración!`;
    window.open(`https://wa.me/1${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }
};

window.FacturacionModule = FacturacionModule;
