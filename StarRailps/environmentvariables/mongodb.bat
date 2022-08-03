@echo off
set pathMongo=%~dp0/MongoDB/mongod.exe
start  %pathMongo% --dbpath %~dp0db --port 27017
exit

