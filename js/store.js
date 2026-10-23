// PUJOLS Servicios - Data Store & State Management
// Centralized state with localStorage persistence and mock demonstration data

const STORAGE_KEY = 'pujols_servicios_state_v2';

const INITIAL_STATE = {
  empresa: {
    nombre: "PUJOLS Servicios",
    lema: "Servicio confiable, equipos en buenas manos.",
    subtitulo: "AIRE Y REFRIGERACIÓN",
    especialidad: "Instalación • Reparación • Mantenimiento",
    rnc: "1-32-45678-9",
    telefono: "809-555-0100",
    whatsapp: "809-555-0100",
    correo: "contacto@pujolsservicios.com",
    direccion: "Av. 27 de Febrero #204, Santo Domingo, Rep. Dominicana",
    moneda: "RD$",
    googleDriveSync: true,
    googleSheetsSync: true,
    ultimaSincronizacion: "14 oct 2025 - 10:24 a. m.",
    gmail: "",
    whatsappNumero: "",
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
      tecnico: "Marcos Pujols",
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
      tecnico: "Marcos Pujols",
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
      tecnico: "Marcos Pujols",
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
      tecnico: "Marcos Pujols",
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

class Store {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
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
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
  }

  limpiarDatosFicticios() {
    this.state.clientes = [];
    this.state.equipos = [];
    this.state.servicios = [];
    this.state.facturas = [];
    this.state.finanzas = { ingresos: [], egresos: [] };
    this.state.recordatorios = [];
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
      telefono: clienteData.telefono || '809-555-0000',
      whatsapp: clienteData.whatsapp || clienteData.telefono || '809-555-0000',
      direccion: clienteData.direccion || 'Santo Domingo, RD',
      lat: lat,
      lng: lng,
      mapUrl: mapUrl,
      correo: clienteData.correo || '',
      tipo: clienteData.tipo || 'Residencial',
      equiposCount: 0,
      fechaRegistro: new Date().toISOString().split('T')[0],
      colorBadge: randomColor,
      pendienteSincronizacion: !navigator.onLine
    };

    this.state.clientes.unshift(newCliente);
    this.state.indicadores.clientesTotal += 1;
    this.state.indicadores.clientesNuevosMes += 1;

    if (!navigator.onLine) {
      this.addToSyncQueue('cliente', newCliente);
    }

    this.saveState();
    return newCliente;
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
      fechaInstalacion: equipoData.fechaInstalacion || new Date().toISOString().split('T')[0],
      ultimoMantenimiento: new Date().toISOString().split('T')[0],
      proximoMantenimiento: equipoData.proximoMantenimiento || '2025-12-15',
      estado: 'Operativo',
      icono: icono
    };

    this.state.equipos.unshift(newEquipo);

    // Update client count
    if (cliente) {
      cliente.equiposCount = (cliente.equiposCount || 0) + 1;
    }

    this.saveState();
    return newEquipo;
  }

  // --- SERVICIOS & ÓRDENES METHODS ---
  getServicios() {
    return this.state.servicios;
  }

  addServicio(servicioData) {
    const nextNum = this.state.servicios.length + 1;
    const nextOrd = 40 + nextNum;
    const newId = `SRV-${100 + nextNum}`;
    const newOrdenId = `OT-2025-${String(nextOrd).padStart(3, '0')}`;
    const cliente = this.getClienteById(servicioData.clienteId);
    const equipo = this.state.equipos.find(e => e.id === servicioData.equipoId);

    const newServicio = {
      id: newId,
      ordenId: newOrdenId,
      hora: servicioData.hora || '9:00 a. m.',
      fecha: servicioData.fecha || new Date().toISOString().split('T')[0],
      fechaFormato: servicioData.fecha || '15 oct 2025',
      tipo: servicioData.tipo || 'Mantenimiento',
      titulo: servicioData.titulo || `${servicioData.tipo || 'Servicio'} - ${cliente ? cliente.nombre : ''}`,
      clienteId: servicioData.clienteId,
      clienteNombre: cliente ? cliente.nombre : 'Cliente',
      equipoId: servicioData.equipoId || (equipo ? equipo.id : ''),
      equipoNombre: equipo ? `${equipo.tipo} - ${equipo.capacidad}` : 'Equipo General',
      tecnico: servicioData.tecnico || 'Marcos Pujols',
      estado: servicioData.estado || 'Programado',
      costo: Number(servicioData.costo) || 4500,
      descripcion: servicioData.descripcion || 'Servicio técnico programado PUJOLS Servicios.'
    };

    this.state.servicios.unshift(newServicio);
    this.state.indicadores.serviciosMes += 1;
    this.saveState();
    return newServicio;
  }

  updateServicioEstado(servicioId, nuevoEstado) {
    const srv = this.state.servicios.find(s => s.id === servicioId);
    if (srv) {
      srv.estado = nuevoEstado;
      this.saveState();
      return true;
    }
    return false;
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
      clienteTelefono: cliente ? cliente.telefono : '809-555-0100',
      clienteDireccion: cliente ? cliente.direccion : 'Santo Domingo, RD',
      fecha: new Date().toLocaleDateString('es-DO'),
      fechaISO: new Date().toISOString().split('T')[0],
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
      this.state.finanzas.ingresos += newFactura.total;
      this.state.finanzas.resultadoNeto += newFactura.total;
      this.state.finanzas.transacciones.unshift({
        id: `TX-${Date.now()}`,
        tipo: 'Ingreso',
        fecha: newFactura.fecha,
        concepto: `Factura ${newFactura.numero} - ${newFactura.clienteNombre}`,
        categoria: 'Servicios',
        monto: newFactura.total
      });
    }

    this.saveState();
    return newFactura;
  }

  marcarFacturaPagada(numero) {
    const fac = this.state.facturas.find(f => f.numero === numero);
    if (fac && fac.estado !== 'Pagada') {
      fac.estado = 'Pagada';
      this.state.finanzas.ingresos += fac.total;
      this.state.finanzas.resultadoNeto += fac.total;
      this.state.finanzas.transacciones.unshift({
        id: `TX-${Date.now()}`,
        tipo: 'Ingreso',
        fecha: fac.fecha,
        concepto: `Cobro Factura ${fac.numero} - ${fac.clienteNombre}`,
        categoria: 'Servicios',
        monto: fac.total
      });
      this.saveState();
      return true;
    }
    return false;
  }

  // --- FINANZAS METHODS ---
  getFinanzas() {
    return this.state.finanzas;
  }

  addTransaccion(txData) {
    const monto = Number(txData.monto) || 0;
    const newTx = {
      id: `TX-${Date.now()}`,
      tipo: txData.tipo, // 'Ingreso' or 'Egreso'
      fecha: new Date().toLocaleDateString('es-DO'),
      concepto: txData.concepto,
      categoria: txData.categoria || 'Operaciones',
      monto: monto
    };

    this.state.finanzas.transacciones.unshift(newTx);

    if (txData.tipo === 'Ingreso') {
      this.state.finanzas.ingresos += monto;
      this.state.finanzas.resultadoNeto += monto;
    } else {
      this.state.finanzas.egresos += monto;
      this.state.finanzas.resultadoNeto -= monto;
    }

    // Update October summary
    const oct = this.state.finanzas.resumenMensual.find(m => m.mes === 'Oct');
    if (oct) {
      if (txData.tipo === 'Ingreso') oct.ingresos += monto;
      else oct.egresos += monto;
      oct.resultado = oct.ingresos - oct.egresos;
    }

    this.saveState();
    return newTx;
  }

  // --- RECORDATORIOS METHODS ---
  getRecordatorios() {
    return this.state.recordatorios;
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
    const now = new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
    this.state.empresa.ultimaSincronizacion = now;
    this.saveState();
    return cantidad;
  }
}

// Global Store Instance
window.store = new Store();
