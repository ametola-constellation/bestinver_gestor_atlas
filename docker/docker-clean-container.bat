powershell -command "docker container stop $(docker container ls -aq)"
powershell -command "docker container rm -f $(docker container ls -aq)"
pause