@echo off
title Production Build
echo Memulai proses build produksi...
call npm run build
echo.
if %errorlevel% neq 0 (
    echo BUILD GAGAL!
) else (
    echo Build produksi selesai.
)
pause
