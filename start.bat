@echo off
title Production Launcher

echo.
echo =================================================
echo   Memulai server produksi di jendela baru...
echo =================================================
echo.

REM Menjalankan server di jendela baru agar tidak memblokir skrip ini
start "Production Server" cmd /c "npm run start"

echo Menunggu server siap (5 detik)...
REM Memberi jeda agar server sempat berjalan sebelum browser dibuka
timeout /t 5 /nobreak > nul

echo Membuka aplikasi di browser pada http://localhost:3000
start http://localhost:3000
