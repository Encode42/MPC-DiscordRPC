@echo off
echo cd %~dp0 > "%userprofile%\Start Menu\Programs\Startup\Simple-MPC-DiscordRPC.bat"
echo npm start>>"%userprofile%\Start Menu\Programs\Startup\Simple-MPC-DiscordRPC.bat"

echo.
echo "Successfully installed to %userprofile%\Start Menu\Programs\Startup\"
ping 127.0.0.1 -n 3 >nul 2>&1