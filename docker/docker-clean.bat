powershell -command "docker container stop $(docker container ls -aq)"
powershell -command "docker container rm $(docker container ls -aq)"
powershell -command "docker image rm -f $(docker image ls -q)"
docker system prune
pause