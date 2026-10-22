// PUJOLS Servicios - Módulo Dashboard / Pantalla de Inicio
// Incluye panel con indicadores, gráfico interactivo con filtros por mes y servicio, y próximos mantenimientos.

const DashboardModule = {
  // Filtros activos para el gráfico interactivo
  activeMonth: 'Oct',        // 'Oct' | 'Sep' | 'Ago' | 'Jul' | 'todos'
  activeService: 'todos',    // 'todos' | 'Mantenimiento' | 'Reparación' | 'Instalación'
  activeEquipment: 'todos',  // 'todos' | 'Aire Acondicionado' | 'Nevera' | 'Lavadora'

  render(container) {
    const state = window.store.state;
    const ind = state.indicadores;
    const proximos = state.servicios.slice(4, 7);

    // Obtener estadísticas filtradas según la selección del usuario
    const stats = window.store.getFilteredDashboardStats(this.activeMonth, this.activeService, this.activeEquipment);
    const colaOffline = window.store.getColaSincronizacion ? window.store.getColaSincronizacion() : [];

    container.innerHTML = `
      ${colaOffline.length > 0 ? `
      <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 12px; padding: 12px 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div style="font-size: 13px; color: #92400E;">
          ⏳ <strong>${colaOffline.length} registro(s) guardados sin internet</strong> pendientes de sincronizar con Google Sheets y Drive.
        </div>
        <button class="btn btn-sm btn-primary" onclick="ConfiguracionModule.sincronizarAhora(); DashboardModule.render(document.getElementById('view-inicio'));">
          🔄 Sincronizar ahora
        </button>
      </div>` : ''}
      <!-- Cabecera de bienvenida y acciones rápidas -->
      <div style="margin-bottom: 22px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--color-primary); margin-bottom: 4px;">¡Buenos días!</h2>
          <p style="font-size: 13.5px; color: var(--text-muted);">Aquí tienes un resumen de tu negocio en tiempo real.</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn btn-primary btn-sm" onclick="App.openModal('modalNuevaOrden')">
            <span class="icon">
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </span>
            Nueva Orden
          </button>
          <button class="btn btn-outline btn-sm" onclick="App.openModal('modalNuevoCliente')">
            + Nuevo Cliente
          </button>
        </div>
      </div>

      <!-- Tarjetas de Indicadores Principales (KPIs) -->
      <div class="kpi-grid">
        <!-- Clientes -->
        <div class="kpi-card" onclick="App.navigate('clientes')" style="cursor: pointer;">
          <div class="kpi-top">
            <div class="kpi-icon blue">
              <span class="icon">
                <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </span>
            </div>
            <span>Clientes</span>
          </div>
          <div class="kpi-value">${ind.clientesTotal}</div>
          <div class="kpi-change positive">
            <span>+${ind.clientesNuevosMes} este mes</span>
          </div>
        </div>

        <!-- Servicios -->
        <div class="kpi-card" onclick="App.navigate('servicios')" style="cursor: pointer;">
          <div class="kpi-top">
            <div class="kpi-icon turquoise">
              <span class="icon">
                <svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
              </span>
            </div>
            <span>Servicios</span>
          </div>
          <div class="kpi-value">${ind.serviciosMes}</div>
          <div class="kpi-change positive">
            <span>+${ind.serviciosNuevos} este mes</span>
          </div>
        </div>

        <!-- Citas Pendientes -->
        <div class="kpi-card" onclick="App.navigate('servicios')" style="cursor: pointer;">
          <div class="kpi-top">
            <div class="kpi-icon navy">
              <span class="icon">
                <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
              </span>
            </div>
            <span>Citas pendientes</span>
          </div>
          <div class="kpi-value" style="font-size: 26px;">
            ${ind.citasPendientes} <span style="font-size: 16px; font-weight: 500; color: var(--text-muted);">de ${ind.citasTotalHoy}</span>
          </div>
          <div class="kpi-change neutral">
            <span>Para hoy y mañana</span>
          </div>
        </div>
      </div>

      <!-- Resumen Financiero Rápido -->
      <div class="finance-summary-grid">
        <div class="finance-card">
          <div class="finance-card-label ingresos">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg></span>
            <span>Ingresos</span>
          </div>
          <div class="finance-card-amount">RD$ ${ind.ingresosMes.toLocaleString('en-US')}</div>
          <div class="finance-card-sub text-danger">${ind.ingresosVariacion}% vs. mes anterior</div>
        </div>

        <div class="finance-card">
          <div class="finance-card-label egresos">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M5 15h4v6h6v-6h4l-7-7-7 7zM5 4h14v2H5V4z"/></svg></span>
            <span>Egresos</span>
          </div>
          <div class="finance-card-amount">RD$ ${ind.egresosMes.toLocaleString('en-US')}</div>
          <div class="finance-card-sub text-danger">+${ind.egresosVariacion}% vs. mes anterior</div>
        </div>

        <div class="finance-card" style="border-left: 3px solid #00AEEF;">
          <div class="finance-card-label resultado">
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg></span>
            <span>Resultado neto</span>
          </div>
          <div class="finance-card-amount highlight">RD$ ${ind.resultadoNeto.toLocaleString('en-US')}</div>
          <div class="finance-card-sub text-success">+${ind.resultadoVariacion}% vs. mes anterior</div>
        </div>
      </div>

      <!-- ====================================================================
           GRÁFICO INTERACTIVO DEL DASHBOARD CON FILTROS POR MES Y SERVICIO
           ==================================================================== -->
      <div class="card" style="margin-bottom: 24px; padding: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 18px;">
          <div>
            <div class="card-title" style="font-size: 17px;">
              <span class="icon" style="color: var(--color-accent);"><svg viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg></span>
              <span>Rendimiento de Servicios y Operaciones</span>
            </div>
            <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 3px;">
              Gráfico interactivo con filtros dinámicos por mes, tipo de servicio y equipo
            </div>
          </div>

          <!-- Filtros Interactivos -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <!-- Selector de Mes -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <label style="font-size: 10.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Mes:</label>
              <select class="form-select" style="padding: 6px 12px; font-size: 12px; font-weight: 600;" onchange="DashboardModule.setMonth(this.value)">
                <option value="Oct" ${this.activeMonth === 'Oct' ? 'selected' : ''}>Octubre 2025</option>
                <option value="Sep" ${this.activeMonth === 'Sep' ? 'selected' : ''}>Septiembre 2025</option>
                <option value="Ago" ${this.activeMonth === 'Ago' ? 'selected' : ''}>Agosto 2025</option>
                <option value="Jul" ${this.activeMonth === 'Jul' ? 'selected' : ''}>Julio 2025</option>
                <option value="todos" ${this.activeMonth === 'todos' ? 'selected' : ''}>Todo el Trimestre (Jul-Oct)</option>
              </select>
            </div>

            <!-- Selector de Tipo de Servicio -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <label style="font-size: 10.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Servicio:</label>
              <select class="form-select" style="padding: 6px 12px; font-size: 12px; font-weight: 600;" onchange="DashboardModule.setService(this.value)">
                <option value="todos" ${this.activeService === 'todos' ? 'selected' : ''}>Todos los Servicios</option>
                <option value="Mantenimiento" ${this.activeService === 'Mantenimiento' ? 'selected' : ''}>🛠️ Mantenimiento</option>
                <option value="Reparación" ${this.activeService === 'Reparación' ? 'selected' : ''}>🔧 Reparación</option>
                <option value="Instalación" ${this.activeService === 'Instalación' ? 'selected' : ''}>⚡ Instalación</option>
              </select>
            </div>

            <!-- Selector de Tipo de Equipo -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <label style="font-size: 10.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Equipo:</label>
              <select class="form-select" style="padding: 6px 12px; font-size: 12px; font-weight: 600;" onchange="DashboardModule.setEquipment(this.value)">
                <option value="todos" ${this.activeEquipment === 'todos' ? 'selected' : ''}>Todos los Equipos</option>
                <option value="Aire Acondicionado" ${this.activeEquipment === 'Aire Acondicionado' ? 'selected' : ''}>❄️ Aire Acondicionado</option>
                <option value="Nevera" ${this.activeEquipment === 'Nevera' ? 'selected' : ''}>🧊 Nevera</option>
                <option value="Lavadora" ${this.activeEquipment === 'Lavadora' ? 'selected' : ''}>🧺 Lavadora</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Métricas Rápidas del Filtro Actual -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px;">
          <div>
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Servicios Filtrados</span>
            <div style="font-size: 20px; font-weight: 800; color: var(--color-primary);">${stats.totalServicios} <span style="font-size: 12px; font-weight: 500; color: var(--text-muted);">órdenes</span></div>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Facturación Estimada</span>
            <div style="font-size: 20px; font-weight: 800; color: #0284C7;">RD$ ${stats.totalIngresos.toLocaleString('en-US')}</div>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Ticket Promedio</span>
            <div style="font-size: 20px; font-weight: 800; color: var(--color-success);">RD$ ${stats.ticketPromedio.toLocaleString('en-US')}</div>
          </div>
        </div>

        <!-- Renderizado del Gráfico SVG Interactivo -->
        <div style="width: 100%; overflow-x: auto; padding: 6px 0;">
          ${this.renderChartSVG(stats)}
        </div>

        <!-- Leyenda y Desglose Visual por Equipos y Servicios -->
        <div style="margin-top: 18px; border-top: 1px dashed var(--border-color); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Desglose por Equipos -->
          <div>
            <div style="font-size: 12px; font-weight: 700; color: var(--color-primary); margin-bottom: 8px;">
              Distribución por Equipos Atendidos:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${stats.distribucionEquipos.map(eq => `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <span>${eq.icon}</span> <strong>${eq.nombre}</strong>
                  </span>
                  <span style="color: var(--text-muted); font-weight: 600;">
                    ${eq.porcentaje}% (${eq.count} serv.)
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Desglose por Servicios -->
          <div>
            <div style="font-size: 12px; font-weight: 700; color: var(--color-primary); margin-bottom: 8px;">
              Distribución por Tipo de Trabajo:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${stats.distribucionServicios.map(sv => `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                  <span>${sv.nombre}</span>
                  <span style="color: var(--color-primary); font-weight: 700;">
                    ${sv.porcentaje}% (${sv.count})
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Próximos Mantenimientos -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <span class="icon" style="color: var(--color-accent);"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg></span>
            <span>Próximos mantenimientos</span>
          </div>
          <div class="card-action-link" onclick="App.navigate('recordatorios')">
            Ver todos
            <span class="icon" style="width: 16px; height: 16px;"><svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg></span>
          </div>
        </div>

        <div class="list-container">
          ${proximos.map(item => `
            <div class="service-item-card" onclick="App.navigate('servicios')" style="cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: #E0F2FE; color: #0284C7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="icon">
                    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                  </span>
                </div>
                <div>
                  <div style="font-size: 14.5px; font-weight: 700; color: var(--color-primary);">${item.titulo}</div>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                    📅 ${item.fechaFormato} &nbsp;•&nbsp; ⏰ ${item.hora} &nbsp;•&nbsp; 👤 ${item.clienteNombre}
                  </div>
                </div>
              </div>
              <div>
                <span class="badge badge-programado">${item.estado}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderChartSVG(stats) {
    const chartWidth = 620;
    const chartHeight = 210;
    const items = stats.series;
    
    // Calcular escala máxima de servicios y de ingresos
    const maxServicios = Math.max(...items.map(i => i.servicios), 10);
    const maxIngresos = Math.max(...items.map(i => i.ingresos), 30000);

    const groupWidth = chartWidth / items.length;
    const barWidth = 26;

    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight + 40}" style="width: 100%; max-width: 700px; height: auto; display: block; margin: 0 auto; font-family: inherit;">
        <!-- Líneas guía horizontales -->
        <line x1="45" y1="20" x2="${chartWidth - 20}" y2="20" stroke="#E2E8F0" stroke-dasharray="3,3" />
        <line x1="45" y1="80" x2="${chartWidth - 20}" y2="80" stroke="#E2E8F0" stroke-dasharray="3,3" />
        <line x1="45" y1="140" x2="${chartWidth - 20}" y2="140" stroke="#E2E8F0" stroke-dasharray="3,3" />
        <line x1="45" y1="195" x2="${chartWidth - 20}" y2="195" stroke="#CBD5E1" stroke-width="1.5" />

        <!-- Etiquetas del eje izquierdo (Servicios) -->
        <text x="38" y="24" font-size="10" font-weight="600" fill="#64748B" text-anchor="end">${maxServicios}</text>
        <text x="38" y="84" font-size="10" font-weight="600" fill="#64748B" text-anchor="end">${Math.round(maxServicios * 0.66)}</text>
        <text x="38" y="144" font-size="10" font-weight="600" fill="#64748B" text-anchor="end">${Math.round(maxServicios * 0.33)}</text>
        <text x="38" y="198" font-size="10" font-weight="600" fill="#64748B" text-anchor="end">0</text>

        <!-- Barras por cada periodo -->
        ${items.map((item, index) => {
          const centerX = 50 + (index * groupWidth) + (groupWidth / 2) - 30;

          // Altura calculada según el total de servicios
          const barHeightSrv = Math.max(10, (item.servicios / maxServicios) * 160);
          const yPosSrv = 195 - barHeightSrv;

          // Altura calculada de ingresos (barra secundaria)
          const barHeightIng = Math.max(8, (item.ingresos / maxIngresos) * 160);
          const yPosIng = 195 - barHeightIng;

          return `
            <g class="chart-group">
              <!-- Barra 1: Servicios (Turquesa / Celeste PUJOLS) -->
              <rect
                x="${centerX}"
                y="${yPosSrv}"
                width="${barWidth}"
                height="${barHeightSrv}"
                rx="5"
                fill="url(#gradienteTurquesa)"
                style="cursor: pointer; transition: all 0.2s;"
              >
                <title>${item.label}: ${item.servicios} servicios realizados (RD$ ${item.ingresos.toLocaleString('en-US')})</title>
              </rect>
              <text x="${centerX + (barWidth / 2)}" y="${yPosSrv - 5}" font-size="11" font-weight="700" fill="#0284C7" text-anchor="middle">
                ${item.servicios}
              </text>

              <!-- Barra 2: Facturación (Azul Marino PUJOLS) -->
              <rect
                x="${centerX + barWidth + 6}"
                y="${yPosIng}"
                width="${barWidth}"
                height="${barHeightIng}"
                rx="5"
                fill="#0A2540"
                style="cursor: pointer; transition: all 0.2s;"
              >
                <title>${item.label}: Facturación RD$ ${item.ingresos.toLocaleString('en-US')}</title>
              </rect>
              <text x="${centerX + barWidth + 6 + (barWidth / 2)}" y="${yPosIng - 5}" font-size="10" font-weight="700" fill="#0A2540" text-anchor="middle">
                RD$${Math.round(item.ingresos / 1000)}k
              </text>

              <!-- Etiqueta del Periodo -->
              <text x="${centerX + barWidth + 3}" y="218" font-size="12" font-weight="700" fill="#0A2540" text-anchor="middle">
                ${item.label}
              </text>
            </g>
          `;
        }).join('')}

        <!-- Definición de gradiente turquesa de marca -->
        <defs>
          <linearGradient id="gradienteTurquesa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00AEEF" />
            <stop offset="100%" stop-color="#0284C7" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Leyenda de colores del gráfico -->
      <div style="display: flex; justify-content: center; gap: 24px; margin-top: 10px; font-size: 12px; font-weight: 600;">
        <span style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 14px; height: 14px; background: #00AEEF; border-radius: 3px;"></span>
          Cantidad de Servicios Realizados
        </span>
        <span style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 14px; height: 14px; background: #0A2540; border-radius: 3px;"></span>
          Ingresos Facturados (RD$)
        </span>
      </div>
    `;
  },

  setMonth(month) {
    this.activeMonth = month;
    this.refresh();
  },

  setService(service) {
    this.activeService = service;
    this.refresh();
  },

  setEquipment(equipment) {
    this.activeEquipment = equipment;
    this.refresh();
  },

  refresh() {
    const container = document.getElementById('view-inicio');
    if (container) this.render(container);
  }
};

window.DashboardModule = DashboardModule;
