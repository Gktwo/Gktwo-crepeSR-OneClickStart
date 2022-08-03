@echo off
set pathmitm=%~dp0mitmdump.exe
%pathmitm% -s %~dp0proxy.py -k
