// PUJOLS Servicios - Módulo Finanzas

const FinanzasModule = {
  currentTab: 'resumen', // 'resumen' | 'ingresos' | 'egresos'

  render(container) {
    const fin = window.store.getFinanzas();
    const transacciones = fin.transacciones || [];

    const txFiltered = transacciones.filter(t => {
      if (this.currentTab === 'ingresos') return t.tipo === 'Ingreso';
      if (this.currentTab === 'egresos') return t.tipo === 'Egreso';
      return true;
    });

    container.innerHTML = `
      <!-- Cabecera de Finanzas -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary);">Finanzas</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Control de ingresos, egresos y rentabilidad operativa</p>
        </div>
        <button class="btn btn-primary" onclick="App.openModal('modalNuevaTransaccion')">
          <span class="icon">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </span>
          + Registrar Movimiento
        </button>
      </div>

      <!-- Pestañas y Rango de Fecha -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
        <div class="tabs-container">
          <button class="tab-btn ${this.currentTab === 'resumen' ? 'active' : ''}" onclick="FinanzasModule.setTab('resumen')">
            Resumen
          </button>
          <button class="tab-btn ${this.currentTab === 'ingresos' ? 'active' : ''}" onclick="FinanzasModule.setTab('ingresos')">
            Ingresos
          </button>
          <button class="tab-btn ${this.currentTab === 'egresos' ? 'active' : ''}" onclick="FinanzasModule.setTab('egresos')">
            Egresos
          </button>
        </div>

        <div class="date-selector-pill">
          <span class="icon" style="width: 16px; height: 16px; color: var(--color-accent);"><svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg></span>
          <span>${fin.rangoSeleccionado}</span>
        </div>
      </div>

      <!-- Tarjetas de Balance -->
      <div class="finance-summary-grid">
        <div class="finance-card">
          <div class="finance-card-label ingresos">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg></span>
            <span>Ingresos</span>
          </div>
          <div class="finance-card-amount">RD$ ${fin.ingresos.toLocaleString('en-US')}</div>
          <div class="finance-card-sub text-muted">Mes actual</div>
        </div>

        <div class="finance-card">
          <div class="finance-card-label egresos">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M5 15h4v6h6v-6h4l-7-7-7 7zM5 4h14v2H5V4z"/></svg></span>
            <span>Egresos</span>
          </div>
          <div class="finance-card-amount">RD$ ${fin.egresos.toLocaleString('en-US')}</div>
          <div class="finance-card-sub text-muted">Gastos operativos y repuestos</div>
        </div>

        <div class="finance-card" style="border-left: 3px solid var(--color-accent);">
          <div class="finance-card-label resultado">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg></span>
            <span>Resultado neto</span>
          </div>
          <div class="finance-card-amount highlight">RD$ ${fin.resultadoNeto.toLocaleString('en-US')}</div>
          <div class="finance-card-sub text-success">Rentabilidad +${Math.round((fin.resultadoNeto / (fin.ingresos || 1)) * 100)}%</div>
        </div>
      </div>

      <!-- Gráfico de Resumen Mensual (Exacto al Mockup) -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">Resumen mensual</div>
          <div style="display: flex; gap: 14px; align-items: center; font-size: 12px;">
            <span style="display: flex; align-items: center; gap: 5px;">
              <span style="width: 10px; height: 10px; background: #00AEEF; border-radius: 2px;"></span> Ingresos
            </span>
            <span style="display: flex; align-items: center; gap: 5px;">
              <span style="width: 10px; height: 10px; background: #EF4444; border-radius: 2px;"></span> Egresos
            </span>
            <span style="display: flex; align-items: center; gap: 5px;">
              <span style="width: 10px; height: 10px; background: #0A2540; border-radius: 2px;"></span> Resultado
            </span>
          </div>
        </div>

        <!-- Render SVG Bar Chart -->
        <div style="width: 100%; overflow-x: auto; padding: 10px 0;">
          ${this.renderMonthlyChart(fin.resumenMensual)}
        </div>
      </div>

      <!-- Detalle de Movimientos -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Movimientos Recientes</div>
          <span style="font-size: 12px; color: var(--text-muted);">${txFiltered.length} transacciones</span>
        </div>

        <div class="list-container">
          ${txFiltered.length === 0 ? `
            <div style="text-align: center; padding: 32px 16px; color: var(--text-muted); font-size: 13.5px;">
              No hay movimientos registrados en este filtro.
            </div>
          ` : txFiltered.map(tx => `
            <div style="padding: 12px 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 220px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: ${tx.tipo === 'Ingreso' ? '#ECFDF5' : '#FEF2F2'}; color: ${tx.tipo === 'Ingreso' ? '#10B981' : '#EF4444'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="icon" style="width: 18px; height: 18px;">
                    ${tx.tipo === 'Ingreso'
                      ? '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>'
                      : '<svg viewBox="0 0 24 24"><path d="M5 15h4v6h6v-6h4l-7-7-7 7zM5 4h14v2H5V4z"/></svg>'}
                  </span>
                </div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 700; color: var(--color-primary);">${tx.concepto}</div>
                  <div style="font-size: 11.5px; color: var(--text-muted);">
                    ${tx.fecha} &nbsp;•&nbsp; Categoría: <strong>${tx.categoria}</strong>
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; margin-left: auto;">
                <div style="text-align: right;">
                  <div style="font-size: 15px; font-weight: 800; color: ${tx.tipo === 'Ingreso' ? 'var(--color-success)' : 'var(--color-danger)'};">
                    ${tx.tipo === 'Ingreso' ? '+' : '-'} RD$ ${Number(tx.monto).toLocaleString('en-US')}
                  </div>
                  <span class="badge ${tx.tipo === 'Ingreso' ? 'badge-completado' : 'badge-cancelado'}" style="font-size: 10px; padding: 2px 6px;">
                    ${tx.tipo}
                  </span>
                </div>
                <div style="display: inline-flex; gap: 6px; align-items: center;">
                  <button type="button" class="btn-action-edit" title="Modificar movimiento" onclick="FinanzasModule.abrirEditarTransaccion('${tx.id}')" style="background: #F1F5F9; border: 1px solid #CBD5E1; color: var(--color-primary); width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                    <span class="icon" style="width: 15px; height: 15px;"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></span>
                  </button>
                  <button type="button" class="btn-action-delete" title="Eliminar movimiento" onclick="FinanzasModule.confirmarEliminar('${tx.id}')" style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                    <span class="icon" style="width: 15px; height: 15px;"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></span>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderMonthlyChart(data) {
    const maxVal = 120000;
    const chartHeight = 220;
    const chartWidth = 600;
    const barWidth = 18;
    const groupGap = 120;
    const startX = 80;

    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight + 40}" style="width: 100%; max-width: 650px; height: auto; display: block; margin: 0 auto; font-family: inherit;">
        <!-- Grid horizontal lines -->
        <line x1="60" y1="30" x2="${chartWidth - 20}" y2="30" stroke="#E2E8F0" stroke-dasharray="3,3" />
        <text x="50" y="34" font-size="10" fill="#94A3B8" text-anchor="end">RD$ 120,000</text>

        <line x1="60" y1="90" x2="${chartWidth - 20}" y2="90" stroke="#E2E8F0" stroke-dasharray="3,3" />
        <text x="50" y="94" font-size="10" fill="#94A3B8" text-anchor="end">RD$ 80,000</text>

        <line x1="60" y1="150" x2="${chartWidth - 20}" y2="150" stroke="#E2E8F0" stroke-dasharray="3,3" />
        <text x="50" y="154" font-size="10" fill="#94A3B8" text-anchor="end">RD$ 40,000</text>

        <line x1="60" y1="210" x2="${chartWidth - 20}" y2="210" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="50" y="214" font-size="10" fill="#94A3B8" text-anchor="end">RD$ 0</text>

        <!-- Groups for each month -->
        ${data.map((item, index) => {
          const gx = startX + (index * groupGap);
          const hIngresos = (item.ingresos / maxVal) * 180;
          const hEgresos = (item.egresos / maxVal) * 180;
          const hResultado = (item.resultado / maxVal) * 180;

          const yIngresos = 210 - hIngresos;
          const yEgresos = 210 - hEgresos;
          const yResultado = 210 - hResultado;

          return `
            <g transform="translate(${gx}, 0)">
              <!-- Bar Ingresos -->
              <rect x="0" y="${yIngresos}" width="${barWidth}" height="${hIngresos}" rx="4" fill="#00AEEF">
                <title>${item.mes} - Ingresos: RD$ ${item.ingresos.toLocaleString('en-US')}</title>
              </rect>
              <!-- Bar Egresos -->
              <rect x="${barWidth + 4}" y="${yEgresos}" width="${barWidth}" height="${hEgresos}" rx="4" fill="#EF4444">
                <title>${item.mes} - Egresos: RD$ ${item.egresos.toLocaleString('en-US')}</title>
              </rect>
              <!-- Bar Resultado -->
              <rect x="${(barWidth + 4) * 2}" y="${yResultado}" width="${barWidth}" height="${hResultado}" rx="4" fill="#0A2540">
                <title>${item.mes} - Resultado: RD$ ${item.resultado.toLocaleString('en-US')}</title>
              </rect>
              <!-- Month Label -->
              <text x="${barWidth * 1.5 + 4}" y="232" font-size="12" font-weight="700" fill="#0A2540" text-anchor="middle">${item.mes}</text>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  },

  setTab(tab) {
    this.currentTab = tab;
    const container = document.getElementById('view-finanzas');
    if (container) this.render(container);
  },

  abrirEditarTransaccion(id) {
    const fin = window.store.getFinanzas();
    const tx = (fin.transacciones || []).find(t => t.id === id);
    if (!tx) {
      alert('No se encontró el movimiento seleccionado.');
      return;
    }

    const modalId = 'modalEditarTransaccion';
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
          <h3 class="modal-title">Modificar Movimiento Financiero</h3>
          <button class="modal-close-btn" onclick="App.closeModal('${modalId}')">
            <span class="icon"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
          </button>
        </div>
        <form onsubmit="FinanzasModule.guardarEdicion(event, '${tx.id}')">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tipo de Movimiento:</label>
                <select id="editTxTipo" class="form-select">
                  <option value="Ingreso" ${tx.tipo === 'Ingreso' ? 'selected' : ''}>Ingreso (+)</option>
                  <option value="Egreso" ${tx.tipo === 'Egreso' ? 'selected' : ''}>Egreso (-)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Monto (RD$):</label>
                <input type="number" id="editTxMonto" class="form-input" value="${tx.monto}" min="1" step="any" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Concepto:</label>
              <input type="text" id="editTxConcepto" class="form-input" value="${tx.concepto ? tx.concepto.replace(/"/g, '&quot;') : ''}" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Categoría:</label>
                <select id="editTxCategoria" class="form-select">
                  <option value="Servicios A/C" ${tx.categoria === 'Servicios A/C' ? 'selected' : ''}>Servicios A/C</option>
                  <option value="Refrigeración" ${tx.categoria === 'Refrigeración' ? 'selected' : ''}>Refrigeración</option>
                  <option value="Servicios" ${tx.categoria === 'Servicios' ? 'selected' : ''}>Servicios</option>
                  <option value="Materiales y Repuestos" ${tx.categoria === 'Materiales y Repuestos' ? 'selected' : ''}>Materiales y Repuestos</option>
                  <option value="Combustible y Transporte" ${tx.categoria === 'Combustible y Transporte' ? 'selected' : ''}>Combustible y Transporte</option>
                  <option value="Herramientas" ${tx.categoria === 'Herramientas' ? 'selected' : ''}>Herramientas</option>
                  <option value="Operaciones" ${tx.categoria === 'Operaciones' ? 'selected' : ''}>Operaciones</option>
                  <option value="Otros" ${tx.categoria === 'Otros' ? 'selected' : ''}>Otros</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha:</label>
                <input type="date" id="editTxFecha" class="form-input" value="${tx.fecha || (window.DateUtil ? window.DateUtil.getLocalDateString() : '')}">
              </div>
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

  guardarEdicion(event, txId) {
    event.preventDefault();
    const tipo = document.getElementById('editTxTipo').value;
    const monto = Number(document.getElementById('editTxMonto').value) || 0;
    const concepto = document.getElementById('editTxConcepto').value.trim();
    const categoria = document.getElementById('editTxCategoria').value;
    const fecha = document.getElementById('editTxFecha').value;

    if (!concepto || monto <= 0) {
      alert('Por favor ingrese un concepto y un monto válido mayor a 0.');
      return;
    }

    const exito = window.store.updateTransaccion(txId, {
      tipo,
      monto,
      concepto,
      categoria,
      fecha
    });

    if (exito) {
      App.closeModal('modalEditarTransaccion');
      const container = document.getElementById('view-finanzas');
      if (container) this.render(container);
      if (window.App && window.App.refreshCurrentScreen && window.App.currentScreen !== 'finanzas') {
        window.App.refreshCurrentScreen();
      }
      alert('✅ Movimiento modificado exitosamente. Los balances han sido recalculados.');
    } else {
      alert('No se pudo actualizar el movimiento.');
    }
  },

  confirmarEliminar(txId) {
    const fin = window.store.getFinanzas();
    const tx = (fin.transacciones || []).find(t => t.id === txId);
    if (!tx) return;

    const montoFmt = Number(tx.monto).toLocaleString('en-US');
    if (confirm(`¿Estás seguro de eliminar este movimiento?\n\n"${tx.concepto}"\nMonto: RD$ ${montoFmt} (${tx.tipo})\n\nEl balance de ingresos, egresos y Google Sheets se actualizarán de inmediato.`)) {
      const exito = window.store.deleteTransaccion(txId);
      if (exito) {
        const container = document.getElementById('view-finanzas');
        if (container) this.render(container);
        if (window.App && window.App.refreshCurrentScreen && window.App.currentScreen !== 'finanzas') {
          window.App.refreshCurrentScreen();
        }
        alert('🗑️ Movimiento eliminado correctamente. Los balances se han recalculado.');
      } else {
        alert('No se pudo eliminar el movimiento.');
      }
    }
  }
};

window.FinanzasModule = FinanzasModule;
