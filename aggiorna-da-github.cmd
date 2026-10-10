@echo off
setlocal
cd /d "%~dp0"
title Appunti di Pediatria - aggiorna da GitHub

where git >nul 2>nul
if errorlevel 1 (
  echo Git non e' installato su questo computer.
  echo Installarlo con:  winget install Git.Git
  echo poi chiudere questa finestra e rilanciare il file.
  echo.
  pause
  exit /b 1
)

echo Scarico l'ultima versione da GitHub...
git fetch origin
if errorlevel 1 (
  echo Download non riuscito: controllare la connessione.
  echo.
  pause
  exit /b 1
)

echo.
echo File locali diversi dall'ultimo commit locale:
git status --short
echo.
echo Proseguendo, la cartella diventa identica al ramo main su GitHub.
echo Le modifiche locali non salvate su GitHub vanno PERSE.
echo.
set /p RISPOSTA=Scrivere S e premere Invio per proseguire, qualsiasi altro tasto per annullare: 
if /i not "%RISPOSTA%"=="S" (
  echo Annullato: nessuna modifica.
  echo.
  pause
  exit /b 0
)

git checkout main
git reset --hard origin/main
echo.
echo Fatto. Versione attuale:
git log --oneline -1
echo.
pause
