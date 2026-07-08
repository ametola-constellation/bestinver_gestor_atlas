docker build -f .\BESTINVER.GestorAltas.Web.Public\Dockerfile . -t web.public
docker build -f .\BESTINVER.GestorAltas.Web.Management\Dockerfile . -t web.management
docker build -f .\BESTINVER.Wordpress.WS\Dockerfile . -t w.ws

pause