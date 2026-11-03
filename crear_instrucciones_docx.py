# -*- coding: utf-8 -*-
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = docx.Document()

for section in doc.sections:
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.9)
    section.right_margin = Inches(0.9)

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor(10, 37, 64)
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(9)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 140, 200)
    return p

def add_p(text, bold_prefix=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(30, 41, 59)
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_bullet(text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(30, 41, 59)
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

# Titulo Principal
title_p = doc.add_paragraph()
title_p.paragraph_format.space_after = Pt(2)
title_run = title_p.add_run("GUÍA DE INICIO Y USO - PUJOLS SERVICIOS")
title_run.font.name = 'Calibri'
title_run.font.size = Pt(20)
title_run.font.bold = True
title_run.font.color.rgb = RGBColor(10, 37, 64)

sub_p = doc.add_paragraph()
sub_p.paragraph_format.space_after = Pt(14)
sub_run = sub_p.add_run("Instrucciones de Instalación, Conexión a Google y Puesta en Marcha desde Cero")
sub_run.font.name = 'Calibri'
sub_run.font.size = Pt(11.5)
sub_run.font.italic = True
sub_run.font.color.rgb = RGBColor(100, 116, 139)

# 1. Enlace
add_heading_1("1. Enlace Oficial de Acceso a la Aplicación")
add_p("La aplicación está disponible en línea 24/7 en el siguiente enlace oficial:")
link_p = doc.add_paragraph()
link_p.paragraph_format.space_before = Pt(2)
link_p.paragraph_format.space_after = Pt(6)
link_run = link_p.add_run("https://jhoelpeguero68-star.github.io/pujols-servicios/")
link_run.font.name = 'Calibri'
link_run.font.size = Pt(12)
link_run.font.bold = True
link_run.font.color.rgb = RGBColor(0, 102, 204)
add_p("Puede abrirse desde cualquier teléfono inteligente (Android o iPhone) o desde cualquier computadora.")

# 2. Instalacion como App
add_heading_1("2. Cómo Instalar la App en su Teléfono (Icono con Logo)")
add_p("PUJOLS Servicios es una aplicación web progresiva (PWA) que se instala en la pantalla de su teléfono sin consumir espacio de descargas pesadas:")
add_heading_2("En teléfonos Android (Google Chrome):")
add_bullet(" Abra el enlace arriba en Google Chrome.")
add_bullet(" Toque el menú de los 3 puntos (esquina superior derecha).")
add_bullet(" Seleccione 'Instalar aplicación' (o 'Agregar a la pantalla principal').")
add_bullet(" Confirme en 'Instalar'. En segundos tendrá el icono oficial de PUJOLS Servicios en su menú de aplicaciones.")

add_heading_2("En teléfonos iPhone (Safari):")
add_bullet(" Abra el enlace en Safari.")
add_bullet(" Toque el botón Compartir (icono de un cuadrado con flecha hacia arriba en la barra inferior).")
add_bullet(" Deslice hacia abajo y presione 'Agregar al inicio'.")
add_bullet(" Toque 'Agregar' en la esquina superior derecha.")

# 3. Conexión a Google Sheets
add_heading_1("3. Cómo Conectar su Cuenta de Google (Sincronización Celular y PC)")
add_p("Para que todo lo que registre en su celular aparezca automáticamente en su computadora (y viceversa):")
add_bullet(" En la barra superior de la app, presione el botón: 'Conectar Google Sheets'.")
add_bullet(" Seleccione su cuenta de correo Gmail.")
add_bullet(" Presione 'Continuar' / 'Permitir' para autorizar el acceso.")
add_bullet(" ¡Listo! La barra se pondrá en verde confirmando la conexión activa.")
add_bullet(" En su propio Google Drive se creará automáticamente un archivo llamado 'PUJOLS Servicios - Base de Datos' con todas sus tablas organizadas (Clientes, Equipos, Servicios, Facturas y Finanzas).")

# 4. Limpiar datos y empezar de cero
add_heading_1("4. Cómo Limpiar los Datos de Prueba para Empezar de Cero")
add_p("La aplicación incluye unos registros de demostración iniciales para que pueda conocer el sistema. Cuando esté listo para cargar sus clientes y servicios reales:")
add_heading_2("Paso A: Limpiar la Aplicación")
add_bullet(" En el menú de la aplicación, entre a 'Configuración' (icono de engranaje).")
add_bullet(" Baje al final hasta la sección 'Mantenimiento de la Aplicación'.")
add_bullet(" Presione el botón rojo: '🗑️ Limpiar datos de demostración (Empezar de cero)'.")
add_bullet(" Confirme la acción. La aplicación quedará completamente limpia (RD$ 0.00 en ingresos y 0 clientes).")
add_heading_2("Paso B: Limpiar la Hoja de Google Sheets")
add_bullet(" Abra su Google Drive y entre al archivo 'PUJOLS Servicios - Base de Datos'.")
add_bullet(" En la pestaña 'Clientes', seleccione las filas del 2 al 7 (los ejemplos iniciales) y presione Eliminar filas.")
add_bullet(" A partir de ese momento, cada cliente o factura que registre en la app se irá insertando fila por fila de manera limpia y real (C-001, C-002...).")

# 5. Funciones clave del dia a dia
add_heading_1("5. Funciones Principales para el Día a Día")
add_bullet(" Registrar Clientes con GPS: Al agregar un cliente, presione '📍 Obtener GPS Actual' para guardar las coordenadas satelitales exactas y abrir Google Maps con un solo toque.", "📍 Clientes:")
add_bullet(" Puede especificar la capacidad exacta en BTU (12,000, 18,000, 24,000 BTU, etc.) para Aires Acondicionados, así como el tipo de Nevera o Lavadora.", "❄️ Equipos:")
add_bullet(" En la lista de citas, presione el botón verde '💬 WhatsApp' para enviar la confirmación formal al cliente con fecha, hora y técnico asignado.", "📅 Citas y WhatsApp:")
add_bullet(" Emita facturas con el logo corporativo grande, imprímalas en PDF limpio o compártalas por WhatsApp. Al marcar una factura como Pagada, el monto ingresa automáticamente a las finanzas del mes.", "🧾 Facturación:")
add_bullet(" Si está en un sótano o lugar sin señal, puede seguir registrando clientes y citas. La app los guarda y los sincroniza en cuanto detecte conexión.", "⚡ Modo sin Internet:")

out_path = r"c:\Users\Admin\Desktop\INSTRUCCIONES_CLIENTE_PUJOLS_SERVICIOS.docx"
doc.save(out_path)
print("Documento Word guardado en:", out_path)
