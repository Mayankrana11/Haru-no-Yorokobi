@echo off
REM ===========================================================
REM 🌸 Haru no Yorokobi - Backend Auto Build & Run Script
REM ===========================================================

REM Always move into the backend folder (where this script is located)
cd /d "%~dp0"

REM Clean previous compiled files
if exist bin (
    rmdir /s /q bin
)
mkdir bin

echo.
echo 🌸 Compiling Java backend...
echo -----------------------------------------------------------

REM ✅ Compile all source files
javac -d bin -sourcepath src -cp ".;../lib/json-simple-1.1.1.jar" src\Main.java

if %errorlevel% neq 0 (
    echo.
    echo ❌ Compilation failed. Please check errors above.
    pause
    exit /b
)

echo.
echo ✅ Compilation successful!
echo -----------------------------------------------------------

REM ▶️ Run the compiled program
echo 🌸 Running Haru no Yorokobi backend simulation...
echo -----------------------------------------------------------
java -cp "bin;../lib/json-simple-1.1.1.jar" Main

echo.
echo -----------------------------------------------------------
echo ✅ Execution complete. Press any key to close this window.
pause
