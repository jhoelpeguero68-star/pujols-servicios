// PUJOLS Servicios - Data Store & State Management
// Zona Horaria Oficial: Santo Domingo, República Dominicana (America/Santo_Domingo, UTC-4)

const DateUtil = {
  TIMEZONE: 'America/Santo_Domingo',

  // Fecha actual en formato YYYY-MM-DD para inputs HTML en la hora exacta de Santo Domingo
  getISODate(d = new Date()) {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: this.TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(d);
    } catch (e) {
      return d.toISOString().split('T')[0];
    }
  },

  // Fecha en formato DD/MM/YYYY en Santo Domingo
  getLocalDateString(d = new Date()) {
    try {
      return new Intl.DateTimeFormat('es-DO', {
        timeZone: this.TIMEZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(d);
    } catch (e) {
      return d.toLocaleDateString('es-DO');
    }
  },

  // Fecha en texto legible: ej. '1 nov 2026'
  getFormatDateText(d = new Date()) {
    try {
      return new Intl.DateTimeFormat('es-DO', {
        timeZone: this.TIMEZONE,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(d);
    } catch (e) {
      return d.toLocaleDateString('es-DO');
    }
  },

  // Hora actual en Santo Domingo: ej. '6:18 p. m.'
  getLocalTimeString(d = new Date()) {
    try {
      return new Intl.DateTimeFormat('es-DO', {
        timeZone: this.TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(d);
    } catch (e) {
      return d.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
    }
  },

  // Mes y Año en Santo Domingo: ej. 'Noviembre 2026'
  getCurrentMonthYearText(d = new Date()) {
    try {
      const t = new Intl.DateTimeFormat('es-DO', {
        timeZone: this.TIMEZONE,
        month: 'long',
        year: 'numeric'
      }).format(d);
      return t.charAt(0).toUpperCase() + t.slice(1);
    } catch (e) {
      return 'Noviembre 2026';
    }
  },

  // Calcular fecha sumando meses a partir de hoy o fecha base en formato YYYY-MM-DD
  calcularFechaMeses(meses = 3, fechaBase = new Date()) {
    try {
      const d = (typeof fechaBase === 'string') ? new Date(fechaBase + 'T12:00:00') : new Date(fechaBase);
      d.setMonth(d.getMonth() + meses);
      return this.getISODate(d);
    } catch (e) {
      return this.getISODate();
    }
  },

  // Formatear cualquier fecha (YYYY-MM-DD, DD/MM/YYYY, o Date) a texto dominicano legible
  formatDateSafe(fechaStr) {
    if (!fechaStr) return this.getFormatDateText();
    if (fechaStr instanceof Date) return this.getFormatDateText(fechaStr);
    try {
      if (typeof fechaStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        return this.getFormatDateText(new Date(fechaStr + 'T12:00:00'));
      }
      return fechaStr;
    } catch (e) {
      return fechaStr;
    }
  }
};
window.DateUtil = DateUtil;

// --- UTILIDAD DE TELÉFONOS REPÚBLICA DOMINICANA (NANP +1, 809 / 829 / 849) ---
const PhoneUtil = {
  // Extrae solo los dígitos
  getDigits(phone) {
    if (!phone) return '';
    return String(phone).replace(/\D/g, '');
  },

  // Normaliza el teléfono dominicano para guardarlo y mostrarlo en formato limpio: 829-725-4450
  // Si el usuario introduce el 1 o +1 internacional (11 dígitos comenzando en 1), remueve el 1 inicial
  normalizeLocal(phone) {
    if (!phone) return '';
    let digits = this.getDigits(phone);
    if (!digits) return '';

    // Si tiene 11 dígitos y empieza con 1 (ej: 18297254450 o +1-829-725-4450), quitar el 1 sobrante de país
    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.substring(1);
    }

    // Formatear a 10 dígitos estándar dominicano (809-XXX-XXXX, 829-XXX-XXXX, 849-XXX-XXXX)
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // Si tiene 7 dígitos (número local sin código de área), anteponer 829 por defecto de la empresa
    if (digits.length === 7) {
      return `829-${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    return String(phone).trim();
  },

  // Obtiene los dígitos oficiales para WhatsApp wa.me sin prefijos duplicados (ej: 18297254450)
  getWhatsAppDigits(phone) {
    if (!phone) return '18297254450';
    let digits = this.getDigits(phone);
    if (!digits) return '18297254450';

    // Si ya empieza con 1 y tiene 11 dígitos, ya está completo con código de país NANP/RD
    if (digits.length === 11 && digits.startsWith('1')) {
      return digits;
    }

    // Si tiene 10 dígitos (ej: 8297254450), añadir el 1 de país una sola vez
    if (digits.length === 10) {
      return `1${digits}`;
    }

    // Si tiene 7 dígitos
    if (digits.length === 7) {
      return `1829${digits}`;
    }

    return digits;
  },

  // Construye la URL oficial de WhatsApp wa.me
  buildWhatsAppUrl(phone, mensaje = '') {
    const waDigits = this.getWhatsAppDigits(phone);
    const base = `https://wa.me/${waDigits}`;
    return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
  },

  // Formateador en tiempo real para inputs tel (809-XXX-XXXX)
  formatInput(inputEl) {
    if (!inputEl) return;
    const raw = inputEl.value;
    let digits = raw.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.substring(1);
    }
    if (digits.length > 10) {
      digits = digits.substring(0, 10);
    }
    let formatted = '';
    if (digits.length > 0) {
      formatted = digits.slice(0, 3);
      if (digits.length > 3) {
        formatted += '-' + digits.slice(3, 6);
      }
      if (digits.length > 6) {
        formatted += '-' + digits.slice(6, 10);
      }
    }
    inputEl.value = formatted;
  }
};
window.PhoneUtil = PhoneUtil;

const STORAGE_KEY = 'pujols_servicios_prod_v1';

const DEMO_DATA = {
  empresa: {
    nombre: "PUJOLS Servicios",
    lema: "Servicio confiable, equipos en buenas manos.",
    subtitulo: "AIRE Y REFRIGERACIÓN",
    especialidad: "Instalación • Reparación • Mantenimiento",
    rnc: "1-32-45678-9",
    telefono: "829-725-4450",
    whatsapp: "829-725-4450",
    correo: "pujolsservicios@gmail.com",
    direccion: "Av. 27 de Febrero #204, Santo Domingo, Rep. Dominicana",
    moneda: "RD$",
    googleDriveSync: true,
    googleSheetsSync: true,
    ultimaSincronizacion: "14 oct 2025 - 10:24 a. m.",
    gmail: "pujolsservicios@gmail.com",
    whatsappNumero: "8297254450",
    sheetsUrl: "",
    driveUrl: ""
  },

  indicadores: {
    clientesTotal: 48,
    clientesNuevosMes: 3,
    serviciosMes: 32,
    serviciosNuevos: 5,
    citasPendientes: 6,
    citasTotalHoy: 12,
    ingresosMes: 87450,
    ingresosVariacion: -12,
    egresosMes: 32180,
    egresosVariacion: 8,
    resultadoNeto: 55270,
    resultadoVariacion: 16
  },

  clientes: [
    {
      id: "C-001",
      nombre: "Juan Pérez",
      iniciales: "JP",
      telefono: "809-555-1234",
      whatsapp: "809-555-1234",
      direccion: "Santo Domingo, RD",
      lat: 18.4719,
      lng: -69.9338,
      mapUrl: "https://www.google.com/maps?q=18.4719,-69.9338",
      correo: "juan.perez@email.com",
      tipo: "Residencial",
      equiposCount: 3,
      fechaRegistro: "2024-01-15",
      colorBadge: "#0A2540"
    },
    {
      id: "C-002",
      nombre: "García & Co.",
      iniciales: "GC",
      telefono: "809-555-5678",
      whatsapp: "809-555-5678",
      direccion: "Los Prados, SD",
      lat: 18.4789,
      lng: -69.9521,
      mapUrl: "https://www.google.com/maps?q=18.4789,-69.9521",
      correo: "contacto@garciaco.com",
      tipo: "Comercial",
      equiposCount: 3,
      fechaRegistro: "2024-02-20",
      colorBadge: "#00AEEF"
    },
    {
      id: "C-003",
      nombre: "María López",
      iniciales: "ML",
      telefono: "809-555-8765",
      whatsapp: "809-555-8765",
      direccion: "Piantini, SD",
      lat: 18.4735,
      lng: -69.9360,
      mapUrl: "https://www.google.com/maps?q=18.4735,-69.9360",
      correo: "m.lopez@email.com",
      tipo: "Residencial",
      equiposCount: 3,
      fechaRegistro: "2024-03-10",
      colorBadge: "#0284C7"
    },
    {
      id: "C-004",
      nombre: "Carlos Rodríguez",
      iniciales: "CR",
      telefono: "809-555-4321",
      whatsapp: "809-555-4321",
      direccion: "Gazcue, SD",
      lat: 18.4680,
      lng: -69.9050,
      mapUrl: "https://www.google.com/maps?q=18.4680,-69.9050",
      correo: "crodriguez@email.com",
      tipo: "Residencial",
      equiposCount: 2,
      fechaRegistro: "2024-04-05",
      colorBadge: "#0A2540"
    },
    {
      id: "C-005",
      nombre: "Constructora ABC",
      iniciales: "CR",
      telefono: "809-555-6789",
      whatsapp: "809-555-6789",
      direccion: "Santo Domingo, RD",
      lat: 18.4861,
      lng: -69.9312,
      mapUrl: "https://www.google.com/maps?q=18.4861,-69.9312",
      correo: "operaciones@abcrd.com",
      tipo: "Comercial",
      equiposCount: 3,
      fechaRegistro: "2024-05-12",
      colorBadge: "#00AEEF"
    },
    {
      id: "C-006",
      nombre: "Lic. Roberto Peña",
      iniciales: "RP",
      telefono: "809-555-9911",
      whatsapp: "809-555-9911",
      direccion: "Bella Vista, SD",
      lat: 18.4550,
      lng: -69.9500,
      mapUrl: "https://www.google.com/maps?q=18.4550,-69.9500",
      correo: "rpena@bufete.com",
      tipo: "Comercial",
      equiposCount: 2,
      fechaRegistro: "2024-06-18",
      colorBadge: "#0284C7"
    }
  ],

  equipos: [
    {
      id: "EQ-001",
      clienteId: "C-001",
      clienteNombre: "Juan Pérez",
      tipo: "Aire Acondicionado",
      subtipo: "Inverter",
      capacidad: "12,000 BTU",
      marca: "Carrier Inverter",
      modelo: "X-Power 2024",
      ubicacion: "Sala principal",
      fechaInstalacion: "2024-03-15",
      ultimoMantenimiento: "2025-04-15",
      proximoMantenimiento: "2025-10-15",
      estado: "Operativo",
      icono: "ac"
    },
    {
      id: "EQ-002",
      clienteId: "C-001",
      clienteNombre: "Juan Pérez",
      tipo: "Nevera",
      subtipo: "No Frost",
      capacidad: "18 Pies Cúbicos",
      marca: "Whirlpool",
      modelo: "WRX-735",
      ubicacion: "Cocina",
      fechaInstalacion: "2023-01-10",
      ultimoMantenimiento: "2025-02-20",
      proximoMantenimiento: "2025-11-20",
      estado: "Operativo",
      icono: "refrigerator"
    },
    {
      id: "EQ-002B",
      clienteId: "C-001",
      clienteNombre: "Juan Pérez",
      tipo: "Lavadora",
      subtipo: "Carga Superior Automática",
      capacidad: "18 Kg (40 lbs)",
      marca: "Whirlpool Smart",
      modelo: "W-18K",
      ubicacion: "Área de Lavado",
      fechaInstalacion: "2023-05-18",
      ultimoMantenimiento: "2025-03-10",
      proximoMantenimiento: "2025-11-10",
      estado: "Operativo",
      icono: "washer"
    },
    {
      id: "EQ-003",
      clienteId: "C-002",
      clienteNombre: "García & Co.",
      tipo: "Nevera",
      subtipo: "Display Comercial",
      capacidad: "22 Pies Cúbicos",
      marca: "Samsung",
      modelo: "RF28R7351SR",
      ubicacion: "Cafetería / Showroom",
      fechaInstalacion: "2023-08-05",
      ultimoMantenimiento: "2025-04-12",
      proximoMantenimiento: "2025-10-12",
      estado: "En revisión",
      icono: "refrigerator"
    },
    {
      id: "EQ-004",
      clienteId: "C-002",
      clienteNombre: "García & Co.",
      tipo: "Aire Acondicionado",
      subtipo: "Inverter",
      capacidad: "24,000 BTU",
      marca: "TCL Inverter",
      modelo: "Elite TAC-24CHSD",
      ubicacion: "Oficina Gerencia",
      fechaInstalacion: "2023-11-12",
      ultimoMantenimiento: "2025-04-18",
      proximoMantenimiento: "2025-10-18",
      estado: "Operativo",
      icono: "ac"
    },
    {
      id: "EQ-004B",
      clienteId: "C-002",
      clienteNombre: "García & Co.",
      tipo: "Lavadora",
      subtipo: "Centro de Lavado Comercial",
      capacidad: "21 Kg (46 lbs)",
      marca: "Speed Queen",
      modelo: "SQ-210",
      ubicacion: "Lavandería Interna",
      fechaInstalacion: "2024-01-20",
      ultimoMantenimiento: "2025-05-10",
      proximoMantenimiento: "2025-11-10",
      estado: "Operativo",
      icono: "washer"
    },
    {
      id: "EQ-005",
      clienteId: "C-003",
      clienteNombre: "María López",
      tipo: "Aire Acondicionado",
      subtipo: "Inverter",
      capacidad: "18,000 BTU",
      marca: "LG Dual Inverter",
      modelo: "VM182CE",
      ubicacion: "Dormitorio Master",
      fechaInstalacion: "2024-05-20",
      ultimoMantenimiento: "2025-02-10",
      proximoMantenimiento: "2025-10-22",
      estado: "Operativo",
      icono: "ac"
    },
    {
      id: "EQ-006",
      clienteId: "C-003",
      clienteNombre: "María López",
      tipo: "Lavadora",
      subtipo: "Carga Frontal Inverter",
      capacidad: "21 Kg (46 lbs)",
      marca: "LG Smart Inverter",
      modelo: "WT21VSS6",
      ubicacion: "Área de Lavado",
      fechaInstalacion: "2024-06-10",
      ultimoMantenimiento: "2025-01-15",
      proximoMantenimiento: "2025-11-15",
      estado: "Operativo",
      icono: "washer"
    },
    {
      id: "EQ-006B",
      clienteId: "C-003",
      clienteNombre: "María López",
      tipo: "Nevera",
      subtipo: "French Door Inverter",
      capacidad: "25 Pies Cúbicos",
      marca: "Samsung",
      modelo: "FD-25",
      ubicacion: "Cocina Principal",
      fechaInstalacion: "2024-02-15",
      ultimoMantenimiento: "2025-04-10",
      proximoMantenimiento: "2025-10-30",
      estado: "Operativo",
      icono: "refrigerator"
    },
    {
      id: "EQ-007",
      clienteId: "C-004",
      clienteNombre: "Carlos Rodríguez",
      tipo: "Aire Acondicionado",
      subtipo: "Inverter",
      capacidad: "12,000 BTU",
      marca: "Midea",
      modelo: "Breezeless 12K",
      ubicacion: "Estudio / Oficina en casa",
      fechaInstalacion: "2024-02-14",
      ultimoMantenimiento: "2025-04-14",
      proximoMantenimiento: "2025-10-14",
      estado: "Operativo",
      icono: "ac"
    },
    {
      id: "EQ-007B",
      clienteId: "C-004",
      clienteNombre: "Carlos Rodríguez",
      tipo: "Lavadora",
      subtipo: "Carga Superior",
      capacidad: "16 Kg (35 lbs)",
      marca: "Mabe",
      modelo: "LMA-16",
      ubicacion: "Patio Techado",
      fechaInstalacion: "2023-09-12",
      ultimoMantenimiento: "2025-03-22",
      proximoMantenimiento: "2025-11-22",
      estado: "Operativo",
      icono: "washer"
    },
    {
      id: "EQ-008",
      clienteId: "C-005",
      clienteNombre: "Constructora ABC",
      tipo: "Aire Acondicionado",
      subtipo: "Piso-Techo",
      capacidad: "36,000 BTU",
      marca: "Carrier Commercial",
      modelo: "PT-3600",
      ubicacion: "Recepción Corporativa",
      fechaInstalacion: "2023-01-11",
      ultimoMantenimiento: "2025-04-25",
      proximoMantenimiento: "2025-10-25",
      estado: "Operativo",
      icono: "ac"
    }
  ],

  servicios: [
    {
      id: "SRV-101",
      ordenId: "OT-2025-041",
      hora: "8:00 a. m.",
      fecha: "2025-10-14",
      fechaFormato: "14 oct 2025",
      tipo: "Mantenimiento",
      titulo: "Mantenimiento A/C",
      clienteId: "C-001",
      clienteNombre: "Juan Pérez",
      equipoId: "EQ-001",
      equipoNombre: "Aire acondicionado - 12,000 BTU (Sala)",
      tecnico: "George Pujols",
      estado: "Programado",
      costo: 4500,
      descripcion: "Mantenimiento preventivo de aire acondicionado 12,000 BTU. Limpieza profunda con hidro-lavadora, desinfección de turbina y verificación de presiones."
    },
    {
      id: "SRV-102",
      ordenId: "OT-2025-042",
      hora: "10:30 a. m.",
      fecha: "2025-10-14",
      fechaFormato: "14 oct 2025",
      tipo: "Reparación",
      titulo: "Reparación nevera",
      clienteId: "C-002",
      clienteNombre: "García & Co.",
      equipoId: "EQ-003",
      equipoNombre: "Nevera Samsung Display 22 Pies",
      tecnico: "David Pujols",
      estado: "En proceso",
      costo: 6800,
      descripcion: "Revisión de fuga de gas y sustitución de sensor de deshielo bimetálico en enfriador comercial."
    },
    {
      id: "SRV-103",
      ordenId: "OT-2025-043",
      hora: "2:00 p. m.",
      fecha: "2025-10-14",
      fechaFormato: "14 oct 2025",
      tipo: "Instalación",
      titulo: "Instalación A/C",
      clienteId: "C-003",
      clienteNombre: "María López",
      equipoId: "EQ-005",
      equipoNombre: "Aire acondicionado LG 18,000 BTU",
      tecnico: "George Pujols",
      estado: "Programado",
      costo: 8900,
      descripcion: "Instalación de unidad Split Inverter, montaje de soporte de condensador, vacío con bomba de 2 etapas y prueba de hermeticidad."
    },
    {
      id: "SRV-104",
      ordenId: "OT-2025-044",
      hora: "4:30 p. m.",
      fecha: "2025-10-14",
      fechaFormato: "14 oct 2025",
      tipo: "Mantenimiento",
      titulo: "Mantenimiento A/C",
      clienteId: "C-004",
      clienteNombre: "Carlos Rodríguez",
      equipoId: "EQ-007",
      equipoNombre: "Aire acondicionado Midea 12,000 BTU",
      tecnico: "David Pujols",
      estado: "Programado",
      costo: 3500,
      descripcion: "Mantenimiento semestral programado. Limpieza de filtros, drenaje y verificación de consumo de amperaje."
    },
    {
      id: "SRV-105",
      ordenId: "OT-2025-045",
      hora: "9:00 a. m.",
      fecha: "2025-10-15",
      fechaFormato: "15 oct 2025",
      tipo: "Mantenimiento",
      titulo: "Aire acondicionado - Juan Pérez",
      clienteId: "C-001",
      clienteNombre: "Juan Pérez",
      equipoId: "EQ-001",
      equipoNombre: "Aire acondicionado - 12,000 BTU",
      tecnico: "George Pujols",
      estado: "Programado",
      costo: 4500,
      descripcion: "Mantenimiento preventivo de aire acondicionado Juan Pérez (Sala)."
    },
    {
      id: "SRV-106",
      ordenId: "OT-2025-046",
      hora: "2:00 p. m.",
      fecha: "2025-10-18",
      fechaFormato: "18 oct 2025",
      tipo: "Mantenimiento",
      titulo: "Aire acondicionado - García & Co.",
      clienteId: "C-002",
      clienteNombre: "García & Co.",
      equipoId: "EQ-004",
      equipoNombre: "Aire acondicionado TCL 24,000 BTU",
      tecnico: "David Pujols",
      estado: "Programado",
      costo: 5500,
      descripcion: "Mantenimiento de consola y condensadora 24,000 BTU oficina principal."
    },
    {
      id: "SRV-107",
      ordenId: "OT-2025-047",
      hora: "10:00 a. m.",
      fecha: "2025-10-22",
      fechaFormato: "22 oct 2025",
      tipo: "Instalación",
      titulo: "Instalación A/C - López",
      clienteId: "C-003",
      clienteNombre: "María López",
      equipoId: "EQ-005",
      equipoNombre: "A/C Inverter",
      tecnico: "George Pujols",
      estado: "Programado",
      costo: 6500,
      descripcion: "Instalación y conexión de tubería de cobre y cable de señal."
    }
  ],

  facturas: [
    {
      numero: "F-000124",
      clienteId: "C-001",
      clienteNombre: "Juan Pérez",
      clienteTelefono: "809-555-1234",
      clienteDireccion: "Santo Domingo, RD",
      fecha: "14/10/2025",
      fechaISO: "2025-10-14",
      fechaTexto: "14 oct 2025",
      estado: "Pagada",
      subtotal: 5700,
      descuento: 0,
      total: 6800,
      items: [
        {
          cantidad: 1,
          descripcion: "Mantenimiento de aire acondicionado 12,000 BTU",
          precioUnitario: 4500,
          total: 4500
        },
        {
          cantidad: 1,
          descripcion: "Limpieza de filtros y comprobación de presión",
          precioUnitario: 2300,
          total: 2300
        }
      ]
    },
    {
      numero: "F-000123",
      clienteId: "C-002",
      clienteNombre: "García & Co.",
      clienteTelefono: "809-555-5678",
      clienteDireccion: "Los Prados, SD",
      fecha: "12/10/2025",
      fechaISO: "2025-10-12",
      fechaTexto: "12 oct 2025",
      estado: "Pendiente",
      subtotal: 12450,
      descuento: 0,
      total: 12450,
      items: [
        {
          cantidad: 1,
          descripcion: "Diagnóstico y reparación nevera comercial Samsung",
          precioUnitario: 8450,
          total: 8450
        },
        {
          cantidad: 1,
          descripcion: "Reemplazo de kit de descongelación y filtro secador",
          precioUnitario: 4000,
          total: 4000
        }
      ]
    },
    {
      numero: "F-000122",
      clienteId: "C-003",
      clienteNombre: "María López",
      clienteTelefono: "809-555-8765",
      clienteDireccion: "Piantini, SD",
      fecha: "10/10/2025",
      fechaISO: "2025-10-10",
      fechaTexto: "10 oct 2025",
      estado: "Pagada",
      subtotal: 8900,
      descuento: 0,
      total: 8900,
      items: [
        {
          cantidad: 1,
          descripcion: "Instalación completa de Aire Acondicionado Split Inverter 18K",
          precioUnitario: 7500,
          total: 7500
        },
        {
          cantidad: 1,
          descripcion: "Kit de tubería de cobre extra y base reforzada",
          precioUnitario: 1400,
          total: 1400
        }
      ]
    },
    {
      numero: "F-000121",
      clienteId: "C-004",
      clienteNombre: "Carlos Rodríguez",
      clienteTelefono: "809-555-4321",
      clienteDireccion: "Gazcue, SD",
      fecha: "07/10/2025",
      fechaISO: "2025-10-07",
      fechaTexto: "07 oct 2025",
      estado: "Pagada",
      subtotal: 5600,
      descuento: 0,
      total: 5600,
      items: [
        {
          cantidad: 1,
          descripcion: "Mantenimiento preventivo A/C 12,000 BTU y capacitor",
          precioUnitario: 5600,
          total: 5600
        }
      ]
    },
    {
      numero: "F-000120",
      clienteId: "C-005",
      clienteNombre: "Constructora ABC",
      clienteTelefono: "809-555-6789",
      clienteDireccion: "Santo Domingo, RD",
      fecha: "03/10/2025",
      fechaISO: "2025-10-03",
      fechaTexto: "03 oct 2025",
      estado: "Pagada",
      subtotal: 24500,
      descuento: 0,
      total: 24500,
      items: [
        {
          cantidad: 2,
          descripcion: "Mantenimiento integral unidades Carrier 36K",
          precioUnitario: 9500,
          total: 19000
        },
        {
          cantidad: 1,
          descripcion: "Lavado químico y tratamiento anticorrosivo",
          precioUnitario: 5500,
          total: 5500
        }
      ]
    }
  ],

  finanzas: {
    rangoSeleccionado: "01 oct 2025 - 31 oct 2025",
    ingresos: 87450,
    egresos: 32180,
    resultadoNeto: 55270,
    resumenMensual: [
      { mes: "Jul", ingresos: 78000, egresos: 28000, resultado: 50000 },
      { mes: "Ago", ingresos: 95000, egresos: 35000, resultado: 60000 },
      { mes: "Sep", ingresos: 99500, egresos: 29800, resultado: 69700 },
      { mes: "Oct", ingresos: 87450, egresos: 32180, resultado: 55270 }
    ],
    transacciones: [
      { id: "TX-1", tipo: "Ingreso", fecha: "14/10/2025", concepto: "Factura F-000124 - Juan Pérez", categoria: "Servicios A/C", monto: 6800 },
      { id: "TX-2", tipo: "Egreso", fecha: "13/10/2025", concepto: "Compra de Gas Refrigerante R410A (Balón)", categoria: "Materiales y Repuestos", monto: 9500 },
      { id: "TX-3", tipo: "Ingreso", fecha: "10/10/2025", concepto: "Factura F-000122 - María López", categoria: "Instalaciones", monto: 8900 },
      { id: "TX-4", tipo: "Egreso", fecha: "08/10/2025", concepto: "Combustible vehículo taller móvil #1", categoria: "Transporte", monto: 4200 },
      { id: "TX-5", tipo: "Ingreso", fecha: "07/10/2025", concepto: "Factura F-000121 - Carlos Rodríguez", categoria: "Mantenimientos", monto: 5600 },
      { id: "TX-6", tipo: "Egreso", fecha: "05/10/2025", concepto: "Capacitores, contactores y conectores", categoria: "Repuestos", monto: 6480 },
      { id: "TX-7", tipo: "Ingreso", fecha: "03/10/2025", concepto: "Factura F-000120 - Constructora ABC", categoria: "Mantenimientos Corporativos", monto: 24500 },
      { id: "TX-8", tipo: "Egreso", fecha: "01/10/2025", concepto: "Mantenimiento bomba de vacío y manómetros", categoria: "Herramientas", monto: 12000 }
    ]
  },

  recordatorios: {
    equipoDestacado: {
      id: "EQ-001",
      titulo: "A/C - Juan Pérez",
      especificaciones: "12,000 BTU - Instalado: 15/03/2024",
      clienteNombre: "Juan Pérez",
      clienteTelefono: "8095551234",
      timeline: [
        {
          tiempo: "7 meses",
          fecha: "15 oct 2025",
          titulo: "Mensaje 1 - Recordatorio inicial",
          estado: "proximo",
          activo: true,
          mensajeTexto: "Estimado/a Sr./Sra. Juan Pérez, le saludamos de PUJOLS Servicios. Le recordamos con agrado que su aire acondicionado Carrier 12,000 BTU ha cumplido 7 meses de funcionamiento. Para garantizar un aire limpio, eficiencia eléctrica y alargar la vida útil del equipo, le sugerimos coordinar su mantenimiento preventivo. ¿Desea que agendemos su visita esta semana?"
        },
        {
          tiempo: "8 meses",
          fecha: "15 nov 2025",
          titulo: "Mensaje 2 - Seguimiento",
          estado: "pendiente",
          activo: false,
          mensajeTexto: "Estimado/a Sr./Sra. Juan Pérez, un cordial saludo de PUJOLS Servicios. Dando seguimiento al cuidado de su aire acondicionado (12,000 BTU), disponemos de técnicos en su zona para realizar su mantenimiento preventivo. ¿Le gustaría coordinar una fecha conveniente?"
        },
        {
          tiempo: "+50 días",
          fecha: "04 ene 2026",
          titulo: "Mensaje 3 - Último recordatorio",
          estado: "futuro",
          activo: false,
          mensajeTexto: "Estimado/a Sr./Sra. Juan Pérez, reciba un atento saludo de PUJOLS Servicios. Su equipo ya sobrepasó el ciclo recomendado de limpieza técnica. Evite sobrecostos de energía o acumulación de polvo agendando hoy su servicio preventivo."
        }
      ]
    },
    otrosRecordatorios: [
      {
        id: "REC-2",
        cliente: "Carlos Rodríguez",
        equipo: "Aire acondicionado Midea 12,000 BTU",
        fechaVencimiento: "14 oct 2025",
        estado: "Hoy",
        telefono: "8095554321",
        mensaje: "Estimado/a Sr./Sra. Carlos Rodríguez, reciba un cordial saludo de PUJOLS Servicios. Le informamos que hoy corresponde el chequeo preventivo de su A/C Midea."
      },
      {
        id: "REC-3",
        cliente: "García & Co.",
        equipo: "Nevera Samsung Display 22 Pies",
        fechaVencimiento: "12 oct 2025",
        estado: "Vencido (2 días)",
        telefono: "8095555678",
        mensaje: "Estimados señores de García & Co., reciban un saludo de PUJOLS Servicios. Le recordamos su mantenimiento programado para su conservador comercial."
      },
      {
        id: "REC-4",
        cliente: "Constructora ABC",
        equipo: "Aire acondicionado Carrier 36,000 BTU",
        fechaVencimiento: "25 oct 2025",
        estado: "Próximo (11 días)",
        telefono: "8095556789",
        mensaje: "Estimados señores de Constructora ABC, en PUJOLS Servicios les enviamos un cordial saludo y les recordamos la fecha de revisión preventiva para las unidades Carrier 36K."
      }
    ]
  }
};

// Estado limpio oficial de producción (sin datos demo)
const INITIAL_STATE = {
  empresa: {
    nombre: "PUJOLS Servicios",
    lema: "Servicio confiable, equipos en buenas manos.",
    subtitulo: "AIRE Y REFRIGERACIÓN",
    especialidad: "Instalación • Reparación • Mantenimiento",
    rnc: "1-32-45678-9",
    telefono: "829-725-4450",
    whatsapp: "829-725-4450",
    correo: "pujolsservicios@gmail.com",
    direccion: "Av. 27 de Febrero #204, Santo Domingo, Rep. Dominicana",
    moneda: "RD$",
    googleDriveSync: true,
    googleSheetsSync: true,
    ultimaSincronizacion: "Pendiente",
    gmail: "pujolsservicios@gmail.com",
    whatsappNumero: "8297254450",
    sheetsUrl: "",
    driveUrl: ""
  },

  indicadores: {
    clientesTotal: 0,
    clientesNuevosMes: 0,
    serviciosMes: 0,
    serviciosNuevos: 0,
    citasPendientes: 0,
    citasTotalHoy: 0,
    ingresosMes: 0,
    ingresosVariacion: 0,
    egresosMes: 0,
    egresosVariacion: 0,
    resultadoNeto: 0,
    resultadoVariacion: 0
  },

  clientes: [],
  equipos: [],
  servicios: [],
  facturas: [],
  finanzas: {
    ingresos: 0,
    egresos: 0,
    resultadoNeto: 0,
    resumenMensual: [],
    transacciones: []
  },
  recordatorios: {
    equipoDestacado: null,
    otrosRecordatorios: []
  },
  colaSincronizacion: [],
  datosLimpiados: true
};

class Store {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      // Eliminar residuos de versiones anteriores de prueba
      localStorage.removeItem('pujols_servicios_state_v2');
      localStorage.removeItem('pujols_servicios_state');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.empresa) {
          if (!parsed.empresa.telefono || parsed.empresa.telefono.includes('809-555')) {
            parsed.empresa.telefono = '829-725-4450';
          }
          if (!parsed.empresa.whatsapp || parsed.empresa.whatsapp.includes('809-555')) {
            parsed.empresa.whatsapp = '829-725-4450';
          }
          if (!parsed.empresa.whatsappNumero || parsed.empresa.whatsappNumero.includes('809555') || parsed.empresa.whatsappNumero.includes('809-555')) {
            parsed.empresa.whatsappNumero = '8297254450';
          }
        }
        if (Array.isArray(parsed.servicios)) {
          parsed.servicios.forEach(s => {
            if (s.tecnico === 'Marcos Pujols' || s.tecnico === 'Marco Pujols') {
              s.tecnico = 'George Pujols';
            }
          });
        }
        if (!parsed.recordatorios || Array.isArray(parsed.recordatorios) || !parsed.recordatorios.equipoDestacado) {
          parsed.recordatorios = {
            equipoDestacado: null,
            otrosRecordatorios: []
          };
        } else if (parsed.recordatorios.equipoDestacado && Array.isArray(parsed.recordatorios.equipoDestacado.timeline)) {
          parsed.recordatorios.equipoDestacado.timeline.forEach(t => {
            if (t.fecha === '15 dic 2026' || t.fecha === '2026-12-15') {
              t.fecha = DateUtil.formatDateSafe(DateUtil.calcularFechaMeses(3));
            }
          });
        }

        // Limpiar equipos con fecha estática '2026-12-15'
        if (Array.isArray(parsed.equipos)) {
          parsed.equipos.forEach(eq => {
            if (eq.proximoMantenimiento === '2026-12-15') {
              eq.proximoMantenimiento = DateUtil.calcularFechaMeses(3);
            }
          });
        }

        // Normalizar teléfonos para asegurar formato limpio de República Dominicana (sin '1' delante)
        if (Array.isArray(parsed.clientes)) {
          parsed.clientes.forEach(c => {
            if (c.telefono) c.telefono = PhoneUtil.normalizeLocal(c.telefono);
            if (c.whatsapp) c.whatsapp = PhoneUtil.normalizeLocal(c.whatsapp);
          });
        }
        if (Array.isArray(parsed.facturas)) {
          parsed.facturas.forEach(f => {
            if (f.clienteTelefono) f.clienteTelefono = PhoneUtil.normalizeLocal(f.clienteTelefono);
          });
        }
        if (parsed.recordatorios && Array.isArray(parsed.recordatorios.otrosRecordatorios)) {
          parsed.recordatorios.otrosRecordatorios.forEach(r => {
            if (r.telefono) r.telefono = PhoneUtil.normalizeLocal(r.telefono);
          });
        }
        if (!Array.isArray(parsed.clientes)) parsed.clientes = [];
        if (!Array.isArray(parsed.equipos)) parsed.equipos = [];
        if (!Array.isArray(parsed.servicios)) parsed.servicios = [];
        if (!Array.isArray(parsed.facturas)) parsed.facturas = [];
        parsed.indicadores = Object.assign({}, INITIAL_STATE.indicadores, parsed.indicadores || {});
        parsed.finanzas = Object.assign({}, INITIAL_STATE.finanzas, parsed.finanzas || {});
        if (!Array.isArray(parsed.finanzas.transacciones)) parsed.finanzas.transacciones = [];
        if (!Array.isArray(parsed.colaSincronizacion)) parsed.colaSincronizacion = [];

        return parsed;
      }
    } catch (e) {
      console.warn('Error reading from localStorage, using initial state:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  resetToDefaults() {
    this.state = JSON.parse(JSON.stringify(DEMO_DATA));
    this.state.datosLimpiados = false;
    this.saveState();
  }

  limpiarDatosFicticios() {
    this.state.datosLimpiados = true;
    this.state.clientes = [];
    this.state.equipos = [];
    this.state.servicios = [];
    this.state.facturas = [];
    this.state.finanzas = { ingresos: 0, egresos: 0, resultadoNeto: 0, transacciones: [], resumenMensual: [] };
    this.state.recordatorios = {
      equipoDestacado: null,
      otrosRecordatorios: []
    };
    this.state.colaSincronizacion = [];
    this.state.indicadores = {
      clientesTotal: 0,
      clientesNuevosMes: 0,
      serviciosMes: 0,
      serviciosNuevos: 0,
      citasPendientes: 0,
      citasTotalHoy: 0,
      ingresosMes: 0,
      ingresosVariacion: 0,
      egresosMes: 0,
      egresosVariacion: 0,
      resultadoNeto: 0,
      resultadoVariacion: 0
    };
    this.saveState();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.state);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  // --- CLIENTES METHODS ---
  getClientes() {
    return this.state.clientes;
  }

  getClienteById(id) {
    return this.state.clientes.find(c => c.id === id);
  }

  addCliente(clienteData) {
    const nextNum = this.state.clientes.length + 1;
    const newId = `C-${String(nextNum).padStart(3, '0')}`;
    const nameParts = (clienteData.nombre || 'Nuevo').trim().split(' ');
    const initials = nameParts.length > 1
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const colors = ['#0A2540', '#00AEEF', '#0284C7', '#0F766E', '#1E40AF'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const lat = clienteData.lat || null;
    const lng = clienteData.lng || null;
    const mapUrl = (lat && lng)
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clienteData.direccion || 'Santo Domingo, RD')}`;

    const newCliente = {
      id: newId,
      nombre: clienteData.nombre,
      iniciales: initials,
      telefono: PhoneUtil.normalizeLocal(clienteData.telefono || '829-725-4450'),
      whatsapp: PhoneUtil.normalizeLocal(clienteData.whatsapp || clienteData.telefono || '829-725-4450'),
      direccion: clienteData.direccion || 'Santo Domingo, RD',
      lat: lat,
      lng: lng,
      mapUrl: mapUrl,
      correo: clienteData.correo || '',
      tipo: clienteData.tipo || 'Residencial',
      equiposCount: 0,
      fechaRegistro: clienteData.fechaRegistro || DateUtil.getISODate(),
      colorBadge: randomColor,
      pendienteSincronizacion: !navigator.onLine
    };

    this.state.clientes.unshift(newCliente);
    this.state.indicadores.clientesTotal += 1;
    this.state.indicadores.clientesNuevosMes += 1;

    if (!navigator.onLine) {
      this.addToSyncQueue('cliente', newCliente);
    } else if (window.GoogleSync && window.GoogleSync.sincronizarNuevoCliente) {
      window.GoogleSync.sincronizarNuevoCliente(newCliente);
    }

    this.saveState();
    return newCliente;
  }

  updateCliente(clienteId, updatedData) {
    const c = this.state.clientes.find(item => item.id === clienteId);
    if (!c) return null;

    if (updatedData.nombre !== undefined) {
      c.nombre = updatedData.nombre;
      const parts = c.nombre.trim().split(' ');
      c.iniciales = parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    if (updatedData.tipo !== undefined) c.tipo = updatedData.tipo;
    if (updatedData.telefono !== undefined) c.telefono = PhoneUtil.normalizeLocal(updatedData.telefono);
    if (updatedData.whatsapp !== undefined) c.whatsapp = PhoneUtil.normalizeLocal(updatedData.whatsapp || updatedData.telefono);
    if (updatedData.direccion !== undefined) c.direccion = updatedData.direccion;
    if (updatedData.correo !== undefined) c.correo = updatedData.correo;
    if (updatedData.fechaRegistro !== undefined) c.fechaRegistro = updatedData.fechaRegistro;
    if (updatedData.lat !== undefined) c.lat = updatedData.lat;
    if (updatedData.lng !== undefined) c.lng = updatedData.lng;
    if (c.lat && c.lng) {
      c.mapUrl = https://www.google.com/maps?q=,;
    }

    // Actualizar nombre y teléfono en equipos y servicios asociados
    this.state.equipos.forEach(eq => {
      if (eq.clienteId === clienteId) {
        eq.clienteNombre = c.nombre;
      }
    });
    this.state.servicios.forEach(s => {
      if (s.clienteId === clienteId) {
        s.clienteNombre = c.nombre;
      }
    });

    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarNuevoCliente) {
      window.GoogleSync.sincronizarNuevoCliente(c);
    }
    return c;
  }

  deleteCliente(clienteId) {
    const idx = this.state.clientes.findIndex(c => c.id === clienteId);
    if (idx === -1) return false;

    this.state.clientes.splice(idx, 1);
    if (this.state.indicadores) {
      this.state.indicadores.clientesTotal = Math.max(0, this.state.clientes.length);
    }

    // Remover equipos asociados
    this.state.equipos = this.state.equipos.filter(eq => eq.clienteId !== clienteId);

    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.eliminarClienteSheet) {
      window.GoogleSync.eliminarClienteSheet(clienteId);
    }
    return true;
  }

  // --- EQUIPOS METHODS ---
  getEquipos() {
    return this.state.equipos;
  }

  getEquiposByCliente(clienteId) {
    return this.state.equipos.filter(e => e.clienteId === clienteId);
  }

  addEquipo(equipoData) {
    const nextNum = this.state.equipos.length + 1;
    const newId = `EQ-${String(nextNum).padStart(3, '0')}`;
    const cliente = this.getClienteById(equipoData.clienteId);

    let icono = 'ac';
    const tipoLower = (equipoData.tipo || '').toLowerCase();
    if (tipoLower.includes('nevera') || tipoLower.includes('refriger')) {
      icono = 'refrigerator';
    } else if (tipoLower.includes('lavadora')) {
      icono = 'washer';
    }

    const newEquipo = {
      id: newId,
      clienteId: equipoData.clienteId,
      clienteNombre: cliente ? cliente.nombre : 'Cliente General',
      tipo: equipoData.tipo || 'Aire Acondicionado',
      subtipo: equipoData.subtipo || 'Inverter',
      capacidad: equipoData.capacidad || '12,000 BTU',
      marca: equipoData.marca || 'Marca estándar',
      modelo: equipoData.modelo || '2025',
      ubicacion: equipoData.ubicacion || 'General',
      fechaInstalacion: equipoData.fechaInstalacion || DateUtil.getISODate(),
      ultimoMantenimiento: DateUtil.getISODate(),
      proximoMantenimiento: equipoData.proximoMantenimiento || DateUtil.calcularFechaMeses(3, equipoData.fechaInstalacion || new Date()),
      estado: 'Operativo',
      icono: icono
    };

    this.state.equipos.unshift(newEquipo);

    // Update client count
    if (cliente) {
      cliente.equiposCount = (cliente.equiposCount || 0) + 1;
    }

    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarNuevoEquipo) {
      window.GoogleSync.sincronizarNuevoEquipo(newEquipo);
    }
    return newEquipo;
  }

  updateEquipo(equipoId, updatedData) {
    const eq = this.state.equipos.find(e => e.id === equipoId);
    if (!eq) return null;

    if (updatedData.tipo !== undefined) eq.tipo = updatedData.tipo;
    if (updatedData.subtipo !== undefined) eq.subtipo = updatedData.subtipo;
    if (updatedData.capacidad !== undefined) eq.capacidad = updatedData.capacidad;
    if (updatedData.marca !== undefined) eq.marca = updatedData.marca;
    if (updatedData.modelo !== undefined) eq.modelo = updatedData.modelo;
    if (updatedData.ubicacion !== undefined) eq.ubicacion = updatedData.ubicacion;
    if (updatedData.fechaInstalacion !== undefined) eq.fechaInstalacion = updatedData.fechaInstalacion;
    if (updatedData.proximoMantenimiento !== undefined) eq.proximoMantenimiento = updatedData.proximoMantenimiento;
    if (updatedData.estado !== undefined) eq.estado = updatedData.estado;

    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarNuevoEquipo) {
      window.GoogleSync.sincronizarNuevoEquipo(eq);
    }
    return eq;
  }

  deleteEquipo(equipoId) {
    const idx = this.state.equipos.findIndex(e => e.id === equipoId);
    if (idx === -1) return false;

    const eq = this.state.equipos[idx];
    this.state.equipos.splice(idx, 1);

    const cliente = this.getClienteById(eq.clienteId);
    if (cliente) {
      cliente.equiposCount = Math.max(0, (cliente.equiposCount || 1) - 1);
    }

    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.eliminarEquipoSheet) {
      window.GoogleSync.eliminarEquipoSheet(equipoId);
    }
    return true;
  }

  // --- SERVICIOS & ÓRDENES METHODS ---
  getServicios() {
    return this.state.servicios;
  }

  addServicio(servicioData) {
    const nextNum = this.state.servicios.length + 1;
    const nextOrd = 40 + nextNum;
    const newId = `SRV-${100 + nextNum}`;
    const newOrdenId = `OT-2026-${String(nextOrd).padStart(3, '0')}`;
    const cliente = this.getClienteById(servicioData.clienteId);
    const equipo = this.state.equipos.find(e => e.id === servicioData.equipoId);

    const newServicio = {
      id: newId,
      ordenId: newOrdenId,
      hora: servicioData.hora || DateUtil.getLocalTimeString(),
      fecha: servicioData.fecha || DateUtil.getISODate(),
      fechaFormato: servicioData.fecha ? DateUtil.getFormatDateText(new Date(servicioData.fecha + 'T12:00:00')) : DateUtil.getFormatDateText(),
      tipo: servicioData.tipo || 'Mantenimiento',
      titulo: servicioData.titulo || `${servicioData.tipo || 'Servicio'} - ${cliente ? cliente.nombre : ''}`,
      clienteId: servicioData.clienteId,
      clienteNombre: cliente ? cliente.nombre : 'Cliente',
      equipoId: servicioData.equipoId || (equipo ? equipo.id : ''),
      equipoNombre: equipo ? `${equipo.tipo} - ${equipo.capacidad}` : 'Equipo General',
      tecnico: servicioData.tecnico || 'George Pujols',
      estado: servicioData.estado || 'Programado',
      costo: Number(servicioData.costo) || 4500,
      descripcion: servicioData.descripcion || 'Servicio técnico programado PUJOLS Servicios.'
    };

    this.state.servicios.unshift(newServicio);
    this.state.indicadores.serviciosMes += 1;
    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarNuevoServicio) {
      window.GoogleSync.sincronizarNuevoServicio(newServicio);
    }

    return newServicio;
  }

  updateServicioEstado(servicioId, nuevoEstado) {
    const srv = this.state.servicios.find(s => s.id === servicioId);
    if (srv) {
      srv.estado = nuevoEstado;
      this.saveState();

      if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarNuevoServicio) {
        window.GoogleSync.sincronizarNuevoServicio(srv);
      }

      return true;
    }
    return false;
  }

  updateServicio(servicioId, updatedData) {
    const srv = this.state.servicios.find(s => s.id === servicioId);
    if (!srv) return null;

    if (updatedData.tipo !== undefined) srv.tipo = updatedData.tipo;
    if (updatedData.titulo !== undefined) srv.titulo = updatedData.titulo;
    if (updatedData.fecha !== undefined) {
      srv.fecha = updatedData.fecha;
      srv.fechaFormato = DateUtil.formatDateSafe(srv.fecha);
    }
    if (updatedData.hora !== undefined) srv.hora = updatedData.hora;
    if (updatedData.tecnico !== undefined) srv.tecnico = updatedData.tecnico;
    if (updatedData.estado !== undefined) srv.estado = updatedData.estado;
    if (updatedData.costo !== undefined) srv.costo = Number(updatedData.costo) || srv.costo;
    if (updatedData.descripcion !== undefined) srv.descripcion = updatedData.descripcion;

    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarNuevoServicio) {
      window.GoogleSync.sincronizarNuevoServicio(srv);
    }
    return srv;
  }

  deleteServicio(servicioId) {
    const idx = this.state.servicios.findIndex(s => s.id === servicioId);
    if (idx === -1) return false;

    this.state.servicios.splice(idx, 1);
    if (this.state.indicadores) {
      this.state.indicadores.serviciosMes = Math.max(0, this.state.servicios.length);
      this.state.indicadores.citasPendientes = this.state.servicios.filter(s => s.estado !== 'Completado' && s.estado !== 'Cancelado').length;
    }

    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.eliminarServicioSheet) {
      window.GoogleSync.eliminarServicioSheet(servicioId);
    }
    return true;
  }

  // --- FACTURAS METHODS ---
  getFacturas() {
    return this.state.facturas;
  }

  addFactura(facturaData) {
    const nextNum = 125 + this.state.facturas.length;
    const newNumero = `F-${String(nextNum).padStart(6, '0')}`;
    const cliente = this.getClienteById(facturaData.clienteId);

    const newFactura = {
      numero: newNumero,
      clienteId: facturaData.clienteId,
      clienteNombre: cliente ? cliente.nombre : (facturaData.clienteNombre || 'Cliente General'),
      clienteTelefono: cliente ? cliente.telefono : (facturaData.clienteTelefono ? PhoneUtil.normalizeLocal(facturaData.clienteTelefono) : '829-725-4450'),
      clienteDireccion: cliente ? cliente.direccion : 'Santo Domingo, RD',
      fecha: DateUtil.getLocalDateString(),
      fechaISO: DateUtil.getISODate(),
      fechaTexto: 'Hoy',
      estado: facturaData.estado || 'Pendiente',
      subtotal: facturaData.subtotal || facturaData.total || 0,
      descuento: facturaData.descuento || 0,
      total: facturaData.total || 0,
      items: facturaData.items || [
        {
          cantidad: 1,
          descripcion: facturaData.concepto || 'Servicio técnico PUJOLS Servicios',
          precioUnitario: facturaData.total || 0,
          total: facturaData.total || 0
        }
      ]
    };

    this.state.facturas.unshift(newFactura);

    // If marked paid, also update finances
    if (newFactura.estado === 'Pagada') {
      const montoPagado = Number(newFactura.total) || 0;
      if (!this.state.finanzas) {
        this.state.finanzas = { ingresos: 0, egresos: 0, resultadoNeto: 0, transacciones: [], resumenMensual: [] };
      }
      if (!Array.isArray(this.state.finanzas.transacciones)) {
        this.state.finanzas.transacciones = [];
      }
      if (typeof this.state.finanzas.ingresos !== 'number') this.state.finanzas.ingresos = 0;
      if (typeof this.state.finanzas.resultadoNeto !== 'number') this.state.finanzas.resultadoNeto = 0;
      if (!this.state.indicadores) {
        this.state.indicadores = { ingresosMes: 0, egresosMes: 0, resultadoNeto: 0, serviciosMes: 0, clientesTotal: 0 };
      }

      this.state.finanzas.ingresos += montoPagado;
      this.state.finanzas.resultadoNeto += montoPagado;
      this.state.indicadores.ingresosMes = (this.state.indicadores.ingresosMes || 0) + montoPagado;
      this.state.indicadores.resultadoNeto = (this.state.indicadores.resultadoNeto || 0) + montoPagado;

      this.state.finanzas.transacciones.unshift({
        id: `TX-${Date.now()}`,
        tipo: 'Ingreso',
        fecha: newFactura.fecha,
        concepto: `Factura ${newFactura.numero} - ${newFactura.clienteNombre}`,
        categoria: 'Servicios',
        monto: montoPagado
      });

      this.recalcularFinanzas();
    }

    this.saveState();

    if (navigator.onLine && window.GoogleSync) {
      if (window.GoogleSync.sincronizarNuevaFactura) window.GoogleSync.sincronizarNuevaFactura(newFactura);
      if (newFactura.estado === 'Pagada' && window.GoogleSync.sincronizarTransacciones) {
        window.GoogleSync.sincronizarTransacciones();
      }
    }

    return newFactura;
  }

  marcarFacturaPagada(numero) {
    return this.cambiarEstadoFactura(numero, 'Pagada');
  }

  cambiarEstadoFactura(numero, nuevoEstado) {
    const fac = this.state.facturas.find(f => f.numero === numero);
    if (!fac) return false;

    const estadoAnterior = fac.estado;
    if (estadoAnterior === nuevoEstado) return true;

    fac.estado = nuevoEstado;

    // Asegurar estructura de finanzas e indicadores
    if (!this.state.finanzas) {
      this.state.finanzas = { ingresos: 0, egresos: 0, resultadoNeto: 0, transacciones: [], resumenMensual: [] };
    }
    if (!Array.isArray(this.state.finanzas.transacciones)) {
      this.state.finanzas.transacciones = [];
    }
    if (typeof this.state.finanzas.ingresos !== 'number') this.state.finanzas.ingresos = 0;
    if (typeof this.state.finanzas.resultadoNeto !== 'number') this.state.finanzas.resultadoNeto = 0;
    if (!this.state.indicadores) {
      this.state.indicadores = { ingresosMes: 0, egresosMes: 0, resultadoNeto: 0, serviciosMes: 0, clientesTotal: 0 };
    }

    const monto = Number(fac.total) || 0;

    if (nuevoEstado === 'Pagada' && estadoAnterior !== 'Pagada') {
      this.state.finanzas.ingresos += monto;
      this.state.finanzas.resultadoNeto += monto;
      this.state.indicadores.ingresosMes = (this.state.indicadores.ingresosMes || 0) + monto;
      this.state.indicadores.resultadoNeto = (this.state.indicadores.resultadoNeto || 0) + monto;

      this.state.finanzas.transacciones.unshift({
        id: `TX-${Date.now()}`,
        tipo: 'Ingreso',
        fecha: fac.fecha || DateUtil.getLocalDateString(),
        concepto: `Cobro Factura ${fac.numero} - ${fac.clienteNombre}`,
        categoria: 'Servicios',
        monto: monto
      });
    } else if (nuevoEstado === 'Pendiente' && estadoAnterior === 'Pagada') {
      this.state.finanzas.ingresos = Math.max(0, this.state.finanzas.ingresos - monto);
      this.state.finanzas.resultadoNeto -= monto;
      this.state.indicadores.ingresosMes = Math.max(0, (this.state.indicadores.ingresosMes || 0) - monto);
      this.state.indicadores.resultadoNeto -= monto;

      const txIndex = this.state.finanzas.transacciones.findIndex(t => t.concepto && t.concepto.includes(fac.numero));
      if (txIndex !== -1) {
        this.state.finanzas.transacciones.splice(txIndex, 1);
      }
    }

    this.recalcularFinanzas();
    this.saveState();

    if (navigator.onLine && window.GoogleSync) {
      if (window.GoogleSync.sincronizarNuevaFactura) window.GoogleSync.sincronizarNuevaFactura(fac);
      if (window.GoogleSync.sincronizarTransacciones) window.GoogleSync.sincronizarTransacciones();
    }

    return true;
  }

  deleteFactura(numero) {
    const idx = this.state.facturas.findIndex(f => f.numero === numero);
    if (idx === -1) return false;

    this.state.facturas.splice(idx, 1);
    this.recalcularFinanzas();
    this.saveState();

    if (navigator.onLine && window.GoogleSync) {
      if (window.GoogleSync.eliminarFacturaSheet) window.GoogleSync.eliminarFacturaSheet(numero);
      if (window.GoogleSync.sincronizarTransacciones) window.GoogleSync.sincronizarTransacciones();
    }
    return true;
  }

  // --- FINANZAS METHODS ---
  getFinanzas() {
    return this.state.finanzas;
  }

  recalcularFinanzas() {
    if (!this.state.finanzas) {
      this.state.finanzas = { ingresos: 0, egresos: 0, resultadoNeto: 0, transacciones: [], resumenMensual: [] };
    }
    if (!Array.isArray(this.state.finanzas.transacciones)) {
      this.state.finanzas.transacciones = [];
    }

    const txs = this.state.finanzas.transacciones;
    const totalIngresos = txs
      .filter(t => t.tipo === 'Ingreso')
      .reduce((sum, t) => sum + (Number(t.monto) || 0), 0);
    const totalEgresos = txs
      .filter(t => t.tipo === 'Egreso')
      .reduce((sum, t) => sum + (Number(t.monto) || 0), 0);

    this.state.finanzas.ingresos = totalIngresos;
    this.state.finanzas.egresos = totalEgresos;
    this.state.finanzas.resultadoNeto = totalIngresos - totalEgresos;

    if (!this.state.indicadores) {
      this.state.indicadores = { ingresosMes: 0, egresosMes: 0, resultadoNeto: 0, serviciosMes: 0, clientesTotal: 0 };
    }
    this.state.indicadores.ingresosMes = totalIngresos;
    this.state.indicadores.egresosMes = totalEgresos;
    this.state.indicadores.resultadoNeto = this.state.finanzas.resultadoNeto;
  }

  addTransaccion(txData) {
    if (!this.state.finanzas) {
      this.state.finanzas = { ingresos: 0, egresos: 0, resultadoNeto: 0, transacciones: [], resumenMensual: [] };
    }
    if (!Array.isArray(this.state.finanzas.transacciones)) {
      this.state.finanzas.transacciones = [];
    }

    const monto = Number(txData.monto) || 0;
    const newTx = {
      id: txData.id || `TX-${Date.now()}`,
      tipo: txData.tipo || 'Ingreso', // 'Ingreso' or 'Egreso'
      fecha: txData.fecha || DateUtil.getLocalDateString(),
      concepto: txData.concepto,
      categoria: txData.categoria || 'Operaciones',
      monto: monto
    };

    this.state.finanzas.transacciones.unshift(newTx);
    this.recalcularFinanzas();
    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarTransacciones) {
      window.GoogleSync.sincronizarTransacciones();
    }

    return newTx;
  }

  updateTransaccion(txId, updatedData) {
    if (!this.state.finanzas || !Array.isArray(this.state.finanzas.transacciones)) return false;
    const index = this.state.finanzas.transacciones.findIndex(t => t.id === txId);
    if (index === -1) return false;

    const tx = this.state.finanzas.transacciones[index];
    if (updatedData.tipo) tx.tipo = updatedData.tipo;
    if (updatedData.concepto) tx.concepto = updatedData.concepto;
    if (updatedData.categoria) tx.categoria = updatedData.categoria;
    if (updatedData.monto !== undefined) tx.monto = Number(updatedData.monto) || 0;
    if (updatedData.fecha) tx.fecha = updatedData.fecha;

    this.recalcularFinanzas();
    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarTransacciones) {
      window.GoogleSync.sincronizarTransacciones();
    }

    return true;
  }

  deleteTransaccion(txId) {
    if (!this.state.finanzas || !Array.isArray(this.state.finanzas.transacciones)) return false;
    const index = this.state.finanzas.transacciones.findIndex(t => t.id === txId);
    if (index === -1) return false;

    this.state.finanzas.transacciones.splice(index, 1);
    this.recalcularFinanzas();
    this.saveState();

    if (navigator.onLine && window.GoogleSync && window.GoogleSync.sincronizarTransacciones) {
      window.GoogleSync.sincronizarTransacciones();
    }

    return true;
  }

  // --- RECORDATORIOS METHODS ---
  getRecordatorios() {
    if (!this.state.recordatorios || Array.isArray(this.state.recordatorios)) {
      this.state.recordatorios = {
        equipoDestacado: null,
        otrosRecordatorios: []
      };
    }
    if (!Array.isArray(this.state.recordatorios.otrosRecordatorios)) {
      this.state.recordatorios.otrosRecordatorios = [];
    }

    // Inicializar equipoDestacado si aún no está configurado
    if (!this.state.recordatorios.equipoDestacado || !Array.isArray(this.state.recordatorios.equipoDestacado.timeline) || this.state.recordatorios.equipoDestacado.timeline.length === 0) {
      const equipos = this.state.equipos || [];
      const clientes = this.state.clientes || [];

      if (equipos.length > 0) {
        const eq = equipos[0];
        const cl = clientes.find(c => c.id === eq.clienteId) || { nombre: eq.clienteNombre || 'Cliente', telefono: '829-725-4450' };
        const proxFecha = window.DateUtil ? window.DateUtil.formatDateSafe(eq.proximoMantenimiento || window.DateUtil.calcularFechaMeses(3)) : 'En 3 meses';
        this.state.recordatorios.equipoDestacado = {
          id: eq.id,
          titulo: `${eq.tipo} - ${cl.nombre}`,
          especificaciones: `${eq.marca || ''} ${eq.capacidad || ''} • Instalado: ${eq.fechaInstalacion || 'Reciente'}`,
          clienteNombre: cl.nombre,
          clienteTelefono: cl.telefono || cl.whatsapp || '829-725-4450',
          timeline: [
            {
              tiempo: "Próximo servicio",
              fecha: proxFecha,
              titulo: "Mantenimiento Preventivo Periódico",
              activo: true,
              mensajeTexto: `Hola ${cl.nombre}, le saludamos de PUJOLS Servicios. Le recordamos con agrado que su equipo ${eq.tipo} (${eq.marca || ''} ${eq.capacidad || ''}) tiene programado su próximo mantenimiento preventivo. ¿Desea coordinar la visita técnica con George Pujols?`
            },
            {
              tiempo: "En 6 meses",
              fecha: "Semestral",
              titulo: "Revisión General y Limpieza Profunda",
              activo: false,
              mensajeTexto: `Hola ${cl.nombre}, le recordamos desde PUJOLS Servicios que corresponde la revisión de presión, limpieza y chequeo preventivo de su ${eq.tipo}.`
            }
          ]
        };
      } else if (clientes.length > 0) {
        const cl = clientes[0];
        this.state.recordatorios.equipoDestacado = {
          id: "REC-CL1",
          titulo: `Plan de Mantenimiento - ${cl.nombre}`,
          especificaciones: `${cl.direccion || 'Santo Domingo'} • Cliente Activo`,
          clienteNombre: cl.nombre,
          clienteTelefono: cl.telefono || cl.whatsapp || '829-725-4450',
          timeline: [
            {
              tiempo: "Preventivo",
              fecha: window.DateUtil ? window.DateUtil.getFormatDateText() : 'Hoy',
              titulo: "Mantenimiento Preventivo Periódico",
              activo: true,
              mensajeTexto: `Hola ${cl.nombre}, un cordial saludo de PUJOLS Servicios. Le escribimos para recordarle coordinar su mantenimiento preventivo de climatización o refrigeración. ¿Le gustaría coordinar una visita técnica esta semana?`
            }
          ]
        };
      } else {
        this.state.recordatorios.equipoDestacado = {
          id: "REC-GENERAL",
          titulo: "Seguimiento Preventivo de Climatización",
          especificaciones: "Mantenimiento de Aires Acondicionados y Refrigeración",
          clienteNombre: "Cliente PUJOLS Servicios",
          clienteTelefono: "829-725-4450",
          timeline: [
            {
              tiempo: "Recordatorio",
              fecha: window.DateUtil ? window.DateUtil.getFormatDateText() : 'Hoy',
              titulo: "Mantenimiento Preventivo Periódico",
              activo: true,
              mensajeTexto: `Hola, reciba un atento saludo de PUJOLS Servicios. Le recordamos que realizar el mantenimiento preventivo a tiempo garantiza un aire más puro y reduce el consumo eléctrico. ¿Podemos coordinar su revisión técnica?`
            }
          ]
        };
      }
    }

    return this.state.recordatorios;
  }

  addRecordatorio(recData) {
    const rec = this.getRecordatorios();
    const newRec = {
      id: recData.id || `REC-${Date.now()}`,
      cliente: recData.cliente || 'Cliente',
      equipo: recData.equipo || 'Equipo Climatización',
      fechaVencimiento: recData.fechaVencimiento || (window.DateUtil ? window.DateUtil.getFormatDateText() : 'Próximamente'),
      fechaISO: recData.fechaISO || (window.DateUtil ? window.DateUtil.getISODate() : new Date().toISOString().split('T')[0]),
      estado: recData.estado || 'Programado',
      telefono: recData.telefono || '829-725-4450',
      mensaje: recData.mensaje || `Estimado/a ${recData.cliente}, le saludamos de PUJOLS Servicios para recordarle su fecha de mantenimiento preventivo para su ${recData.equipo || 'equipo'}. ¿Desea coordinar la visita técnica?`
    };

    rec.otrosRecordatorios.unshift(newRec);
    this.saveState();
    return newRec;
  }

  updateRecordatorio(recId, updatedData) {
    const rec = this.getRecordatorios();
    const index = rec.otrosRecordatorios.findIndex(r => r.id === recId);
    if (index === -1) return false;

    const r = rec.otrosRecordatorios[index];
    if (updatedData.cliente !== undefined) r.cliente = updatedData.cliente;
    if (updatedData.equipo !== undefined) r.equipo = updatedData.equipo;
    if (updatedData.fechaVencimiento !== undefined) r.fechaVencimiento = updatedData.fechaVencimiento;
    if (updatedData.fechaISO !== undefined) r.fechaISO = updatedData.fechaISO;
    if (updatedData.estado !== undefined) r.estado = updatedData.estado;
    if (updatedData.telefono !== undefined) r.telefono = updatedData.telefono;
    if (updatedData.mensaje !== undefined) r.mensaje = updatedData.mensaje;

    this.saveState();
    return true;
  }

  deleteRecordatorio(recId) {
    const rec = this.getRecordatorios();
    const index = rec.otrosRecordatorios.findIndex(r => r.id === recId);
    if (index === -1) return false;

    rec.otrosRecordatorios.splice(index, 1);
    this.saveState();
    return true;
  }

  updateTimelineRecordatorio(index, updatedData) {
    const rec = this.getRecordatorios();
    if (!rec.equipoDestacado || !Array.isArray(rec.equipoDestacado.timeline)) return false;
    const node = rec.equipoDestacado.timeline[index];
    if (!node) return false;

    if (updatedData.fecha !== undefined) node.fecha = updatedData.fecha;
    if (updatedData.tiempo !== undefined) node.tiempo = updatedData.tiempo;
    if (updatedData.titulo !== undefined) node.titulo = updatedData.titulo;
    if (updatedData.mensajeTexto !== undefined) node.mensajeTexto = updatedData.mensajeTexto;

    this.saveState();
    return true;
  }

  // --- EMPRESA & CONFIG METHODS ---
  getEmpresa() {
    return this.state.empresa;
  }

  updateEmpresa(empresaData) {
    this.state.empresa = { ...this.state.empresa, ...empresaData };
    this.saveState();
  }

  // --- DASHBOARD FILTERED ANALYTICS ---
  getFilteredDashboardStats(mes = 'Oct', tipoServicio = 'todos', tipoEquipo = 'todos') {
    const clientes = Array.isArray(this.state.clientes) ? this.state.clientes : [];
    const servicios = Array.isArray(this.state.servicios) ? this.state.servicios : [];
    const facturas = Array.isArray(this.state.facturas) ? this.state.facturas : [];

    // Si los datos demo fueron limpiados o la app está operando con datos reales de producción
    if (this.state.datosLimpiados || (clientes.length === 0 && servicios.length === 0)) {
      let filteredSrv = servicios.filter(s => {
        if (tipoServicio !== 'todos' && s.tipo !== tipoServicio) return false;
        if (tipoEquipo !== 'todos' && !(s.equipoNombre || '').toLowerCase().includes(tipoEquipo.toLowerCase())) return false;
        return true;
      });

      const totalServicios = filteredSrv.length;
      let totalIngresos = facturas
        .filter(f => f.estado === 'Pagada')
        .reduce((sum, f) => sum + (Number(f.total) || 0), 0);

      const ticketPromedio = totalServicios > 0 ? Math.round(totalIngresos / totalServicios) : (totalIngresos > 0 ? totalIngresos : 0);

      const eqAire = filteredSrv.filter(s => (s.equipoNombre || '').toLowerCase().includes('aire')).length;
      const eqNev = filteredSrv.filter(s => (s.equipoNombre || '').toLowerCase().includes('nevera')).length;
      const eqLav = filteredSrv.filter(s => (s.equipoNombre || '').toLowerCase().includes('lavadora')).length;

      const srvMant = filteredSrv.filter(s => (s.tipo || '').toLowerCase().includes('mantenimiento')).length;
      const srvRep = filteredSrv.filter(s => (s.tipo || '').toLowerCase().includes('reparación') || (s.tipo || '').toLowerCase().includes('reparacion')).length;
      const srvInst = filteredSrv.filter(s => (s.tipo || '').toLowerCase().includes('instalación') || (s.tipo || '').toLowerCase().includes('instalacion')).length;

      const pAire = totalServicios > 0 ? Math.round((eqAire / totalServicios) * 100) : 0;
      const pNev = totalServicios > 0 ? Math.round((eqNev / totalServicios) * 100) : 0;
      const pLav = totalServicios > 0 ? Math.round((eqLav / totalServicios) * 100) : 0;

      const pMant = totalServicios > 0 ? Math.round((srvMant / totalServicios) * 100) : 0;
      const pRep = totalServicios > 0 ? Math.round((srvRep / totalServicios) * 100) : 0;
      const pInst = totalServicios > 0 ? Math.round((srvInst / totalServicios) * 100) : 0;

      const semSrv = Math.round(totalServicios / 4);
      const semIng = Math.round(totalIngresos / 4);

      const series = [
        { label: 'Sem 1', servicios: semSrv, ingresos: semIng },
        { label: 'Sem 2', servicios: semSrv, ingresos: semIng },
        { label: 'Sem 3', servicios: semSrv, ingresos: semIng },
        { label: 'Sem 4', servicios: Math.max(0, totalServicios - (semSrv * 3)), ingresos: Math.max(0, totalIngresos - (semIng * 3)) }
      ];

      return {
        isMultiMonth: false,
        periodoNombre: 'Producción Real',
        totalServicios,
        totalIngresos,
        ticketPromedio,
        series,
        distribucionEquipos: [
          { nombre: 'Aire Acondicionado', porcentaje: pAire, count: eqAire, icon: '❄️' },
          { nombre: 'Nevera', porcentaje: pNev, count: eqNev, icon: '🧊' },
          { nombre: 'Lavadora', porcentaje: pLav, count: eqLav, icon: '🧺' }
        ],
        distribucionServicios: [
          { nombre: 'Mantenimiento', porcentaje: pMant, count: srvMant },
          { nombre: 'Reparación', porcentaje: pRep, count: srvRep },
          { nombre: 'Instalación', porcentaje: pInst, count: srvInst }
        ]
      };
    }

    const mesesData = {
      'Oct': {
        nombre: 'Octubre 2025',
        totalServicios: 32,
        totalIngresos: 87450,
        semanas: [
          { label: 'Sem 1', servicios: 8, ingresos: 22500 },
          { label: 'Sem 2', servicios: 9, ingresos: 24800 },
          { label: 'Sem 3', servicios: 8, ingresos: 21650 },
          { label: 'Sem 4', servicios: 7, ingresos: 18500 }
        ],
        equipos: {
          'Aire Acondicionado': { servicios: 18, ingresos: 52200 },
          'Nevera': { servicios: 8, ingresos: 21800 },
          'Lavadora': { servicios: 6, ingresos: 13450 }
        },
        servicios: {
          'Mantenimiento': { servicios: 19, ingresos: 41500 },
          'Reparación': { servicios: 8, ingresos: 26450 },
          'Instalación': { servicios: 5, ingresos: 19500 }
        }
      },
      'Sep': {
        nombre: 'Septiembre 2025',
        totalServicios: 36,
        totalIngresos: 99500,
        semanas: [
          { label: 'Sem 1', servicios: 9, ingresos: 25000 },
          { label: 'Sem 2', servicios: 10, ingresos: 27500 },
          { label: 'Sem 3', servicios: 9, ingresos: 24000 },
          { label: 'Sem 4', servicios: 8, ingresos: 23000 }
        ],
        equipos: {
          'Aire Acondicionado': { servicios: 20, ingresos: 61000 },
          'Nevera': { servicios: 9, ingresos: 24500 },
          'Lavadora': { servicios: 7, ingresos: 14000 }
        },
        servicios: {
          'Mantenimiento': { servicios: 22, ingresos: 48000 },
          'Reparación': { servicios: 9, ingresos: 29500 },
          'Instalación': { servicios: 5, ingresos: 22000 }
        }
      },
      'Ago': {
        nombre: 'Agosto 2025',
        totalServicios: 34,
        totalIngresos: 95000,
        semanas: [
          { label: 'Sem 1', servicios: 8, ingresos: 23000 },
          { label: 'Sem 2', servicios: 9, ingresos: 25000 },
          { label: 'Sem 3', servicios: 9, ingresos: 25000 },
          { label: 'Sem 4', servicios: 8, ingresos: 22000 }
        ],
        equipos: {
          'Aire Acondicionado': { servicios: 21, ingresos: 63000 },
          'Nevera': { servicios: 8, ingresos: 20000 },
          'Lavadora': { servicios: 5, ingresos: 12000 }
        },
        servicios: {
          'Mantenimiento': { servicios: 20, ingresos: 45000 },
          'Reparación': { servicios: 8, ingresos: 26000 },
          'Instalación': { servicios: 6, ingresos: 24000 }
        }
      },
      'Jul': {
        nombre: 'Julio 2025',
        totalServicios: 29,
        totalIngresos: 78000,
        semanas: [
          { label: 'Sem 1', servicios: 7, ingresos: 19000 },
          { label: 'Sem 2', servicios: 8, ingresos: 21000 },
          { label: 'Sem 3', servicios: 7, ingresos: 19000 },
          { label: 'Sem 4', servicios: 7, ingresos: 19000 }
        ],
        equipos: {
          'Aire Acondicionado': { servicios: 17, ingresos: 49000 },
          'Nevera': { servicios: 7, ingresos: 18000 },
          'Lavadora': { servicios: 5, ingresos: 11000 }
        },
        servicios: {
          'Mantenimiento': { servicios: 18, ingresos: 40000 },
          'Reparación': { servicios: 7, ingresos: 22000 },
          'Instalación': { servicios: 4, ingresos: 16000 }
        }
      }
    };

    // Factor multipliers based on filters
    let eqFactor = 1.0;
    if (tipoEquipo === 'Aire Acondicionado') eqFactor = 0.58;
    else if (tipoEquipo === 'Nevera') eqFactor = 0.25;
    else if (tipoEquipo === 'Lavadora') eqFactor = 0.17;

    let srvFactor = 1.0;
    if (tipoServicio === 'Mantenimiento') srvFactor = 0.59;
    else if (tipoServicio === 'Reparación') srvFactor = 0.25;
    else if (tipoServicio === 'Instalación') srvFactor = 0.16;

    const combinedFactor = eqFactor * srvFactor;

    if (mes === 'todos') {
      // Comparison across all 4 months
      const series = ['Jul', 'Ago', 'Sep', 'Oct'].map(m => {
        const d = mesesData[m];
        const srv = Math.round(d.totalServicios * combinedFactor);
        const ing = Math.round(d.totalIngresos * combinedFactor);
        return {
          label: d.nombre.split(' ')[0],
          servicios: Math.max(1, srv),
          ingresos: ing
        };
      });

      const totalServicios = series.reduce((acc, curr) => acc + curr.servicios, 0);
      const totalIngresos = series.reduce((acc, curr) => acc + curr.ingresos, 0);

      return {
        isMultiMonth: true,
        periodoNombre: 'Último Trimestre (Julio - Octubre 2025)',
        totalServicios,
        totalIngresos,
        ticketPromedio: Math.round(totalIngresos / (totalServicios || 1)),
        series,
        distribucionEquipos: [
          { nombre: 'Aire Acondicionado', porcentaje: 58, count: Math.round(totalServicios * 0.58), icon: '❄️' },
          { nombre: 'Nevera', porcentaje: 25, count: Math.round(totalServicios * 0.25), icon: '🧊' },
          { nombre: 'Lavadora', porcentaje: 17, count: Math.round(totalServicios * 0.17), icon: '🧺' }
        ],
        distribucionServicios: [
          { nombre: 'Mantenimiento', porcentaje: 59, count: Math.round(totalServicios * 0.59) },
          { nombre: 'Reparación', porcentaje: 25, count: Math.round(totalServicios * 0.25) },
          { nombre: 'Instalación', porcentaje: 16, count: Math.round(totalServicios * 0.16) }
        ]
      };
    } else {
      // Single month view with weekly breakdown
      const mData = mesesData[mes] || mesesData['Oct'];
      const series = mData.semanas.map(sem => ({
        label: sem.label,
        servicios: Math.max(1, Math.round(sem.servicios * combinedFactor)),
        ingresos: Math.round(sem.ingresos * combinedFactor)
      }));

      const totalServicios = series.reduce((acc, curr) => acc + curr.servicios, 0);
      const totalIngresos = series.reduce((acc, curr) => acc + curr.ingresos, 0);

      return {
        isMultiMonth: false,
        periodoNombre: mData.nombre,
        totalServicios,
        totalIngresos,
        ticketPromedio: Math.round(totalIngresos / (totalServicios || 1)),
        series,
        distribucionEquipos: [
          { nombre: 'Aire Acondicionado', porcentaje: 58, count: Math.round(totalServicios * 0.58), icon: '❄️' },
          { nombre: 'Nevera', porcentaje: 25, count: Math.round(totalServicios * 0.25), icon: '🧊' },
          { nombre: 'Lavadora', porcentaje: 17, count: Math.round(totalServicios * 0.17), icon: '🧺' }
        ],
        distribucionServicios: [
          { nombre: 'Mantenimiento', porcentaje: 59, count: Math.round(totalServicios * 0.59) },
          { nombre: 'Reparación', porcentaje: 25, count: Math.round(totalServicios * 0.25) },
          { nombre: 'Instalación', porcentaje: 16, count: Math.round(totalServicios * 0.16) }
        ]
      };
    }
  }

  // --- COLA DE SINCRONIZACIÓN OFFLINE (GOOGLE DRIVE / SHEETS) ---
  addToSyncQueue(tipo, item) {
    if (!this.state.colaSincronizacion) {
      this.state.colaSincronizacion = [];
    }
    this.state.colaSincronizacion.push({
      id: `SYNC-${Date.now()}`,
      tipo,
      item,
      fecha: new Date().toISOString()
    });
    this.saveState();
  }

  getColaSincronizacion() {
    return this.state.colaSincronizacion || [];
  }

  procesarColaSincronizacion() {
    const cantidad = (this.state.colaSincronizacion || []).length;
    this.state.colaSincronizacion = [];
    const now = DateUtil.getFormatDateText() + ' - ' + DateUtil.getLocalTimeString();
    this.state.empresa.ultimaSincronizacion = now;
    this.saveState();
    return cantidad;
  }
}

// Global Store Instance
window.store = new Store();
