@echo off
echo ========================================
echo M-Well Healthcare Application Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation
    echo After installation, restart your computer and run this script again
    pause
    exit /b 1
)

echo Node.js is installed!
node --version

echo.
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    echo Please reinstall Node.js with npm included
    pause
    exit /b 1
)

echo npm is available!
npm --version

echo.
echo Installing project dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Try running: npm cache clean --force
    echo Then run this script again
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause





