@echo off
title PUJOLS Servicios - Aire y Refrigeracion
cd /d "c:\Users\Admin\Desktop\App Pujols Servicios"
echo ========================================================
echo        INICIANDO PUJOLS SERVICIOS
echo ========================================================
echo Abriendo servidor local en http://localhost:8090 ...
timeout /t 1 /nobreak >nul
start http://localhost:8090
python -m http.server 8090
pause
