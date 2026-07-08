# BESTINVER GestorAltas

Inventario tecnico inicial del repositorio `BESTINVER.GestorAltas`.

Este repo contiene varias aplicaciones .NET 8 relacionadas con altas/onboarding, remediacion, backoffice y un API consumido por Wordpress. No hay fichero `.sln`; los proyectos se compilan directamente por `.csproj`.

## Resumen ejecutivo

- Stack principal: ASP.NET Core MVC/API en .NET 8, Razor Views, jQuery/Knockout/Gulp para assets frontend.
- Ejecutables principales:
  - `BESTINVER.GestorAltas.Web.Public`: web publica de altas/onboarding, extranjeros, juridicas, firma y remediacion.
  - `BESTINVER.GestorAltas.Web.Management`: backoffice/middleoffice para operaciones, dashboard, seguridad, detalles, comunicaciones y plantillas.
  - `BESTINVER.Wordpress.WS`: API para integracion con Wordpress, carteras y rentabilidades.
- Capa compartida: dominio, modelos, recursos, utilidades, autenticacion comun y `MicroservicesProxy`.
- Integraciones externas: Artifactory/JFrog, Azure App Configuration, Azure Key Vault, Azure Blob Storage para Data Protection, Redis, Application Insights/Azure Monitor, IdentityServer/Azure AD/LDAP y microservicios de Web Privada.
- CI/CD: conviven pipelines legacy de Azure DevOps, pipelines nuevos para Docker/Azure Container Apps y scripts Jenkins/Groovy.
- Estado local actual: en este WSL hay SDK .NET 8, pero no hay acceso al daemon Docker y faltan credenciales privadas de NuGet. `docker compose config` y `docker compose --dry-run build bestinver.wordpress.ws` validan sintacticamente.

## Mapa de aplicaciones

| Aplicacion | Proyecto | Tipo | Funcion |
| --- | --- | --- | --- |
| Web Publica | `BESTINVER.GestorAltas.Web.Public/BESTINVER.GestorAltas.Web.Public.csproj` | ASP.NET Core MVC | Alta de clientes, registro, juridicas, extranjeros, remediacion, firma documental, landing y flujos publicos. |
| Web Management | `BESTINVER.GestorAltas.Web.Management/BESTINVER.GestorAltas.Web.Management.csproj` | ASP.NET Core MVC | Backoffice/middleoffice: dashboard, busqueda, detalle de solicitudes, operaciones, FCR, seguridad, comunicaciones y plantillas. |
| Wordpress WS | `BESTINVER.Wordpress.WS/BESTINVER.Wordpress.WS.csproj` | ASP.NET Core API | API de carteras/rentabilidad para Wordpress u otros consumidores web. |
| Auth LDAP | `Bestinver.Auth.Ldap/Bestinver.Auth.Ldap.csproj` | Libreria/EF Identity | Integracion LDAP/Azure AD/roles. Es el unico sitio donde aparecen migraciones EF. |

## Carpetas principales

| Ruta | Que contiene |
| --- | --- |
| `.agents`, `.codex` | Metadatos locales de agentes/herramientas. No forman parte funcional de la app. |
| `.sonarlint` | Configuracion local de SonarLint. |
| `BESTINVER.GestorAltas.Domain.Interfaces` | Contratos de configuracion y dominio. |
| `BESTINVER.GestorAltas.Domain` | Configuraciones, AutoMapper, extensiones y logica de dominio/remediacion. |
| `BESTINVER.GestorAltas.Exceptions` | Excepciones especificas del dominio y de integraciones. |
| `BESTINVER.GestorAltas.MicroservicesProxy` | Cliente/proxy hacia microservicios externos de Web Privada. No parece un reverse proxy HTTP independiente. |
| `BESTINVER.GestorAltas.Resource` | Recursos/localizacion y helpers de mensajes/validacion. |
| `BESTINVER.GestorAltas.Utilities` | Middlewares, logging, extensiones, seguridad y utilidades comunes. |
| `BESTINVER.GestorAltas.Web.Common` | Componentes comunes para webs: login, controladores base, vistas comunes y reglas de autenticacion. |
| `BESTINVER.GestorAltas.Web.Models` | Modelos DTO/ViewModel compartidos por las webs. |
| `BESTINVER.GestorAltas.Web.Public` | Aplicacion publica MVC, assets, vistas, controladores, Dockerfile y configuracion frontend. |
| `BESTINVER.GestorAltas.Web.Management` | Aplicacion backoffice MVC, assets, vistas, controladores, Dockerfile y configuracion frontend. |
| `BESTINVER.Wordpress.WS` | API de Wordpress, Swagger, Postman propio y Dockerfile. |
| `Bestinver.Auth.Ldap` | Identity/LDAP, Graph, roles, usuarios y migraciones EF. |
| `*.UnitTests`, `*.FunctionalTests` | Proyectos de test unitario/funcional asociados a las apps. |
| `Pipelines` | Pipelines mas recientes parametrizados para build/publish Docker y deploy a Azure Container Apps usando templates externos `CI_CD`. |
| `build` | YAML legacy de Azure DevOps por componente/entorno. |
| `pipes` | Scripts Jenkins/Groovy por entorno (`DES`, `INT`, `PRE`, `STA`, `PRO`) y despliegue Azure. Algunos scripts cargan ficheros Groovy que no estan en este checkout. |
| `docker` | Scripts `.bat`, `.env.*` y certificado local para ejecucion Docker Windows legacy. |
| `Postman` | Colecciones y entornos Postman para pruebas cloud de Altas, Middle Office y Wordpress. |

## Ficheros raiz relevantes

| Fichero | Uso |
| --- | --- |
| `Directory.Build.props` | Define `NetVersion=net8.0`, versionado centralizado y warnings como errores. |
| `Directory.Packages.props` | Versiones NuGet centralizadas. Incluye paquetes privados `BestInver.*`. |
| `NuGet.Config` | Fuentes NuGet: `nuget.org` y Artifactory privado con `NUGET_USER`/`NUGET_PASSWORD`. |
| `docker-compose.yml` | Compose de las tres apps y SQL Server. Actualmente mezcla rutas Windows y Dockerfiles Linux. |
| `docker-compose.override.yml` | Variables locales de entorno. Contiene valores sensibles y no deberia compartirse tal cual. |
| `docker-build.bat`, `docker-tag.bat` | Build/tag manual de imagenes Docker desde Windows. |
| `package-lock.json` | Lockfile raiz huerfano: no hay `package.json` raiz asociado. Los paquetes reales estan dentro de `Web.Public` y `Web.Management`. |

## Requisitos para trabajar en local

Minimos para compilar:

- .NET SDK 8.0.
- Node.js. Los Dockerfile usan Node `20.11.0`; pipelines antiguos instalan Node 8/10. Conviene estandarizar, pero para la rama actual usaria Node 20.
- Yarn o npm. Los Dockerfile usan `yarn install` y `gulp`.
- Acceso a Artifactory/JFrog y variables:
  - `NUGET_USER`
  - `NUGET_PASSWORD`
- Docker y Docker Compose si se quiere construir imagenes.
- Permisos sobre el daemon Docker (`docker info` debe funcionar).

Para arrancar de verdad, ademas hacen falta dependencias externas:

- Redis si `Cache:Enable` esta activo.
- SQL Server y esquema/datos. Solo se ven migraciones EF para `Bestinver.Auth.Ldap`; no aparece dump/migracion completa de la BBDD principal de GestorAltas.
- Azure App Configuration, Key Vault y Blob Storage para configuracion y Data Protection.
- IdentityServer/Azure AD/LDAP.
- Microservicios de Web Privada configurados en `AppSettings:ApiWebPrivadaBaseAddress`.

## Comandos locales

Se ha incluido un `Makefile` con comandos de diagnostico y build. Primeros pasos:

```bash
make doctor
make list-projects
make compose-config
make docker-dry-run-ws
```

Build .NET de un proyecto concreto:

```bash
export NUGET_USER="..."
export NUGET_PASSWORD="..."
make dotnet-restore PROJECT=BESTINVER.Wordpress.WS/BESTINVER.Wordpress.WS.csproj
make dotnet-build PROJECT=BESTINVER.Wordpress.WS/BESTINVER.Wordpress.WS.csproj
```

Build de assets frontend:

```bash
make frontend-install-public
make frontend-build-public
make frontend-install-management
make frontend-build-management
```

Build Docker:

```bash
export NUGET_USER="..."
export NUGET_PASSWORD="..."
make docker-build-ws
make docker-build-public
make docker-build-management
```

## Docker y WSL vs Windows

Hay dos modelos mezclados:

- Dockerfiles actuales: usan imagenes Linux `mcr.microsoft.com/dotnet/*:8.0-alpine` para runtime y SDK .NET 8 para build.
- Compose/scripts legacy: usan `microsoft/mssql-server-windows-developer`, rutas `C:\...`, red Docker `nat` y `.bat` de Windows.

Por eso:

- Para reproducir los scripts `.bat` legacy, Windows tiene mas sentido.
- Para construir las imagenes actuales Linux, WSL/Linux deberia bastar si Docker tiene permisos y hay credenciales NuGet.
- `docker compose up` no esta listo como entorno local portable: mezcla SQL Server Windows con servicios Linux y contiene secretos en override.

## CI/CD

Hay varias generaciones:

- `Pipelines/ci_base.yml`, `ci_uat.yml`, `cd_uat.yml`, `ci_generic.yml`: build/publish Docker y deploy/swap a Azure Container Apps mediante templates externos del repo `CI_CD`.
- `azure-pipelines-devops-acciona.yml`: jobs Docker para onboarding, remediation, middleoffice y ws, con subida a JFrog Docker.
- `devops-gestorAltas-*.yml` y `build/*.yml`: pipelines legacy que restauran NuGet, instalan Node/Yarn/Gulp, publican paquetes ZIP y suben artefactos a Artifactory.
- `pipes/*.groovy` y `pipes/*.jenkinsfile`: despliegues Jenkins por entorno. En `PRO` aparecen rutas Windows/IIS (`C:/inetpub/...`), mientras otros entornos apuntan a imagenes en Azure Container Apps.

## Riesgos y deuda tecnica detectada

- No existe `.sln`; compilar/testear todo requiere enumerar `.csproj`.
- Hay secretos y credenciales en configuraciones locales/override. Deben rotarse y moverse a secretos/variables de entorno.
- `docker-compose.yml` no es portable tal como esta: mezcla Windows containers, Linux containers y rutas Windows.
- Falta la migracion/dump de la base principal. Solo aparecen migraciones EF para Identity/LDAP.
- Paquetes privados `BestInver.*` bloquean restore sin Artifactory.
- `Directory.Build.props` tiene `TreatWarningsAsErrors=true`, asi que warnings nuevos rompen build.
- Algunos YAML legacy referencian rutas/versiones antiguas (`net6.0`, Node 8/10), aunque el repo actual esta en .NET 8 y Docker usa Node 20.
- `package-lock.json` raiz parece residuo.
- Algunos scripts Jenkins cargan ficheros no presentes en este checkout (`pipes/shared.groovy`, `pipes/deployments.groovy`).

## Estado de validacion local

Comprobado en WSL:

- `dotnet --version`: disponible (`8.0.422`).
- `node --version`: disponible, pero es Node 24 y no coincide con Node 20.11.0 del Dockerfile.
- `yarn --version`: no disponible.
- `docker compose config -q`: correcto, con warning por atributo `version` obsoleto.
- `docker compose --dry-run build bestinver.wordpress.ws`: correcto.
- `docker info`: falla por permisos sobre `/var/run/docker.sock`.
- `NUGET_USER` y `NUGET_PASSWORD`: no definidos.

## Siguientes pasos recomendados

1. Instalar SDK .NET 8 y Yarn, o construir solo con Docker.
2. Dar acceso al usuario WSL al daemon Docker.
3. Conseguir credenciales Artifactory y validar `dotnet restore`.
4. Confirmar si el despliegue objetivo real es Azure Container Apps, IIS Windows o ambos.
5. Pedir dump/migraciones de la BBDD principal y variables de entorno por aplicacion.
6. Rotar secretos expuestos y limpiar overrides antes de entregar el repo a terceros.
