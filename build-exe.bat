@echo off
chcp 65001 >nul
echo ========================================
echo   风禾千寻 Electron 打包脚本
echo   （请以管理员身份运行此文件）
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 清理残留...
taskkill /F /IM electron.exe 2>nul
taskkill /F /IM electron-app.exe 2>nul
timeout /t 2 /nobreak >nul
if exist dist rmdir /s /q dist
if exist out rmdir /s /q out

echo [2/4] 编译 electron-vite...
call npx electron-vite build
if errorlevel 1 (
    echo 编译失败！
    pause
    exit /b 1
)

echo [3/4] 打包 exe（跳过签名）...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npx electron-builder --win --config
if errorlevel 1 (
    echo 打包失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo   打包完成！产物在 dist\ 目录下：
echo   - dist\win-unpacked\electron-app.exe（免安装版）
echo   - dist\electron-app-*-setup.exe（安装程序）
echo ========================================
pause