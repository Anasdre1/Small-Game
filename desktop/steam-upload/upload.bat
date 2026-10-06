@echo off
REM Uploads dist\win-unpacked to Steam. Run from the desktop\steam-upload folder.
REM Set STEAMCMD to where you unzipped SteamCMD (it's also in the Steamworks SDK under tools\ContentBuilder\builder).
if "%STEAMCMD%"=="" set STEAMCMD=C:\steamcmd\steamcmd.exe
set /p STEAMUSER=Steam username (the account with access to your Steamworks app): 
"%STEAMCMD%" +login %STEAMUSER% +run_app_build "%~dp0app_build.vdf" +quit
pause
