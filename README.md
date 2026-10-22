# PUJOLS Servicios - Aplicación Web Adaptable e Instalable (PWA)

Aplicación web instalable y adaptable a teléfonos, tabletas y computadoras para la administración integral de servicios de instalación, mantenimiento y reparación de **aires acondicionados, neveras y lavadoras**.

---

## 🎨 Identidad Visual y Marca
- **Nombre Oficial:** PUJOLS Servicios
- **Subtítulo:** AIRE Y REFRIGERACIÓN (Instalación • Reparación • Mantenimiento)
- **Lema:** *"Servicio confiable, equipos en buenas manos."*
- **Paleta de Colores de la Marca:**
  - **Azul Marino Principal:** `#0A2540` / `#002B49`
  - **Turquesa / Celeste Vibrante:** `#00AEEF` / `#00B4D8` / `#0284C7`
  - **Blanco Puro:** `#FFFFFF` / Fondo Suave: `#F4F7FB`
  - **Estados:** Verde `#10B981` (Pagada / Completado), Ámbar `#F59E0B` (Pendiente / En proceso), Azul `#0284C7` (Programado).

---

## 📱 Pantallas y Módulos Desarrollados

1. **Inicio (Dashboard):**
   - Saludo interactivo y selector de periodo.
   - Indicadores clave: Clientes totales (`48`, +3 este mes), Servicios (`32`, +5 este mes) y Citas pendientes (`6 de 12`).
   - Resumen financiero rápido: Ingresos (`RD$ 87,450`), Egresos (`RD$ 32,180`) y Resultado neto (`RD$ 55,270`).
   - Lista interactiva de "Próximos mantenimientos" con acceso directo.

2. **Clientes:**
   - Buscador en tiempo real por nombre, teléfono o dirección.
   - Pestaña segmentada para alternar entre Clientes y Equipos.
   - Listado con badges de iniciales (JP, GC, ML, CR, etc.), teléfonos y sectores de República Dominicana.
   - Ficha detallada de cliente con historial de equipos asociados, servicios y facturas.
   - Modal para registrar nuevos clientes (Residenciales o Comerciales).

3. **Equipos:**
   - Listado de equipos organizados por cliente.
   - Filtros por categoría: Todos, Aires Acondicionados (Split / Inverter), Neveras (No Frost / Display Comercial) y Lavadoras.
   - Tarjetas técnicas con marca, modelo, capacidad (BTU, Pies, Kg), ubicación y fechas de mantenimiento.
   - Botón directo para crear orden de servicio o registrar nuevos equipos.

4. **Servicios (Agenda y Órdenes):**
   - Pestañas: Agenda | Órdenes de trabajo | Historial.
   - Selector navegable de fechas (`< Hoy, 14 oct 2025 >`).
   - Línea de tiempo diaria con horas (`8:00 a. m.`, `10:30 a. m.`, `2:00 p. m.`, etc.) y badges de estado (`Programado`, `En proceso`, `Completado`).
   - Modal de "Nueva orden de servicio" fiel al diseño de la vista móvil.

5. **Facturación:**
   - Buscador por cliente o número de factura (`F-000124`, etc.).
   - Filtros por estado: Todas | Pagadas | Pendientes.
   - Visor e impresión de **Factura en PDF** idéntico al comprobante oficial:
     - Logo de PUJOLS Servicios en alta resolución.
     - Datos fiscales (RNC, teléfono, dirección).
     - Desglose de ítems, precio unitario, subtotal, descuento y total en RD$.
     - Código QR de validación y pie decorativo de la marca.
     - Botón de **Imprimir / Guardar en PDF** y opción de compartir por WhatsApp.

6. **Finanzas:**
   - Pestañas: Resumen | Ingresos | Egresos.
   - Tarjetas de Ingresos, Egresos y Resultado Neto.
   - **Gráfico SVG interactivo de Resumen Mensual** comparativo (Jul, Ago, Sep, Oct) con barras de Ingresos, Egresos y Resultado.
   - Historial de transacciones con clasificación por categorías operativas.
   - Formulario para registrar nuevos ingresos y egresos.

7. **Recordatorios:**
   - Línea de tiempo visual para retención de clientes:
     - 7 meses: Recordatorio inicial
     - 8 meses: Seguimiento
     - +50 días: Último recordatorio
   - Cuadro explicativo y generador de mensajes listos para WhatsApp (`https://wa.me/...`).
   - Alertas de mantenimientos próximos y vencidos.

8. **Configuración:**
   - Datos de la empresa (Nombre, RNC, Dirección, Teléfono, Lema).
   - Conexiones demostrativas con Google Drive y Google Sheets.
   - Botón de instalación PWA.
   - Botón para restablecer los datos de prueba iniciales.

9. **Pantalla de Inicio de Sesión / Login:**
   - Fondo con degradado azul oscuro corporativo.
   - Logo oficial de PUJOLS Servicios y eslogan.
   - Campos de usuario y contraseña prellenados con botón de acceso en un solo clic.

---

## 🚀 Cómo Ejecutar la Aplicación

### Opción 1: Abrir directamente en el navegador
Haga doble clic en el archivo `index.html` o ábralo con Google Chrome, Microsoft Edge, Safari o Firefox.

### Opción 2: Iniciar con servidor local (Recomendado para probar instalación PWA y Service Worker)
Abra una terminal o PowerShell en la carpeta del proyecto y ejecute:
```powershell
python -m http.server 8000
```
Luego ingrese en su navegador o teléfono en la misma red Wi-Fi a:
```
http://localhost:8000
```

### 📲 Cómo Instalar en Teléfonos o PC (PWA)
- **En Google Chrome / Edge (Computadora):** Aparecerá el botón **"Instalar App"** en la barra superior o en la barra de direcciones del navegador.
- **En Android (Chrome):** Toque el menú (3 puntos) y elija **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
- **En iPhone (Safari):** Toque el botón de **"Compartir"** y seleccione **"Agregar al inicio"**.

---

## 📁 Estructura del Código

```
App Pujols Servicios/
├── assets/
│   ├── logo.jpg          # Logo oficial de PUJOLS Servicios
│   ├── icon-192.png      # Icono PWA para dispositivos móviles (192x192)
│   ├── icon-512.png      # Icono PWA alta resolución (512x512)
│   └── favicon.png       # Favicon para el navegador
├── css/
│   ├── styles.css        # Variables de color corporativas y base
│   ├── layout.css        # Barra lateral, navegación móvil y cabecera
│   ├── components.css    # Tarjetas, botones, modales, timeline y login
│   └── print.css         # Formato limpio para impresión de facturas en PDF
├── js/
│   ├── store.js          # Almacén central de datos reactivo (localStorage)
│   ├── app.js            # Enrutador principal y controlador de modales
│   └── modules/
│       ├── auth.js           # Módulo de login y sesión demo
│       ├── dashboard.js      # Pantalla 1: Inicio
│       ├── clientes.js       # Pantalla 2: Clientes y detalle
│       ├── equipos.js        # Pantalla 3: Equipos por cliente
│       ├── servicios.js      # Pantalla 4: Agenda y órdenes
│       ├── facturacion.js    # Pantalla 5: Facturas y comprobante PDF
│       ├── finanzas.js       # Pantalla 6: Finanzas y gráfico mensual SVG
│       ├── recordatorios.js  # Pantalla 7: Recordatorios y WhatsApp
│       └── configuracion.js  # Pantalla 8: Configuración del negocio
├── index.html            # Estructura semántica principal
├── manifest.json         # Manifiesto de aplicación PWA instalable
├── sw.js                 # Service Worker para funcionamiento offline
└── README.md             # Documentación del sistema
```
