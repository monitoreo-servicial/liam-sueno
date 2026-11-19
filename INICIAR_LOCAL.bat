@echo off
title Liam - Control de Sueno y Ventanas de Vigilia
color 0B
echo ========================================================
echo        LIAM - CONTROL DE SUENO & VENTANAS DE VIGILIA
echo ========================================================
echo.
echo Iniciando servidor local en http://localhost:5174 ...
echo Base de datos conectada: Oracle Cloud (PostgreSQL)
echo.
echo (Para cerrar la aplicacion, cierre esta ventana)
echo.
cd /d "%~dp0"
start http://localhost:5174
call pnpm dev
pause
