set bdport=1435
set webport=50065
::set webport=8035
set webport_https=44362
set webmngport=59686
set webmngport_https=44331
set ws_port=59684

docker run -d -p %bdport%:1433 --env-file .\.env.db --network bstnat --name btsbbdd1 microsoft/mssql-server-windows-developer
docker run -d -p %webport_https%:443 --network bstnat -p %webport%:80 --env-file .\.env.web -v %USERPROFILE%\.aspnet\https:C:\https\ --name web.public web.public
::docker run -d -p %webmngport%:443 -p %webmngport_https%:80 --network bstnat --env-file .\.env.web -v %USERPROFILE%\.aspnet\https:C:\https\ --name web.management web.management
::docker run -d -p %ws_port%:80 --network bstnat --env-file .\.env.ws --name w.ws w.ws

pause