@echo off
title RUAA Store Server
echo ========================================================
echo   Starting RUAA Store Server on http://localhost:5000 ...
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
