SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

BUILD_CONFIGURATION ?= Release

PUBLIC_PROJECT := BESTINVER.GestorAltas.Web.Public/BESTINVER.GestorAltas.Web.Public.csproj
MANAGEMENT_PROJECT := BESTINVER.GestorAltas.Web.Management/BESTINVER.GestorAltas.Web.Management.csproj
WS_PROJECT := BESTINVER.Wordpress.WS/BESTINVER.Wordpress.WS.csproj
PROJECT ?= $(PUBLIC_PROJECT)

.PHONY: help doctor list-projects compose-config \
	docker-dry-run-public docker-dry-run-management docker-dry-run-ws \
	docker-build-public docker-build-management docker-build-ws \
	dotnet-restore dotnet-build test-project test-all \
	frontend-install-public frontend-build-public frontend-install-management frontend-build-management \
	check-dotnet check-docker check-nuget

help:
	@echo "BESTINVER GestorAltas - comandos utiles"
	@echo ""
	@echo "Diagnostico:"
	@echo "  make doctor              Comprueba herramientas, Docker y credenciales esperadas"
	@echo "  make list-projects       Lista los proyectos .NET detectados"
	@echo "  make compose-config      Valida docker-compose.yml sin levantar servicios"
	@echo ""
	@echo "Build .NET:"
	@echo "  make dotnet-restore PROJECT=$(WS_PROJECT)"
	@echo "  make dotnet-build PROJECT=$(WS_PROJECT)"
	@echo "  make test-project PROJECT=BESTINVER.Wordpress.WS.UnitTests/BESTINVER.Wordpress.WS.UnitTests.csproj"
	@echo "  make test-all"
	@echo ""
	@echo "Frontend:"
	@echo "  make frontend-install-public"
	@echo "  make frontend-build-public"
	@echo "  make frontend-install-management"
	@echo "  make frontend-build-management"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-dry-run-ws"
	@echo "  make docker-build-ws"
	@echo "  make docker-build-public"
	@echo "  make docker-build-management"

doctor:
	@echo "== Tools =="
	@if command -v dotnet >/dev/null 2>&1; then dotnet --version | sed 's/^/dotnet: /'; else echo "dotnet: missing"; fi
	@if command -v node >/dev/null 2>&1; then node --version | sed 's/^/node: /'; else echo "node: missing"; fi
	@if command -v npm >/dev/null 2>&1; then npm --version | sed 's/^/npm: /'; else echo "npm: missing"; fi
	@if command -v yarn >/dev/null 2>&1; then yarn --version | sed 's/^/yarn: /'; else echo "yarn: missing"; fi
	@if command -v docker >/dev/null 2>&1; then \
		docker --version; \
		docker compose version || true; \
		if docker info >/dev/null 2>&1; then docker info --format 'docker daemon: {{.OSType}} {{.ServerVersion}}'; else echo "docker daemon: not reachable"; fi; \
	else \
		echo "docker: missing"; \
	fi
	@echo ""
	@echo "== NuGet private feed =="
	@if [ -n "$$NUGET_USER" ]; then echo "NUGET_USER: set"; else echo "NUGET_USER: missing"; fi
	@if [ -n "$$NUGET_PASSWORD" ]; then echo "NUGET_PASSWORD: set"; else echo "NUGET_PASSWORD: missing"; fi
	@echo ""
	@echo "== Repo =="
	@if [ -f README.md ]; then echo "README.md: present"; else echo "README.md: missing"; fi
	@if [ -f NuGet.Config ]; then echo "NuGet.Config: present"; else echo "NuGet.Config: missing"; fi
	@if [ -f docker-compose.yml ]; then echo "docker-compose.yml: present"; else echo "docker-compose.yml: missing"; fi

list-projects:
	@find . -path './.git' -prune -o -name '*.csproj' -print | sort

compose-config:
	@docker compose config -q

docker-dry-run-public:
	@docker compose --dry-run build bestinver.gestoraltas.web.public

docker-dry-run-management:
	@docker compose --dry-run build bestinver.gestoraltas.web.management

docker-dry-run-ws:
	@docker compose --dry-run build bestinver.wordpress.ws

docker-build-public: check-docker check-nuget
	docker build --build-arg NUGET_USER --build-arg NUGET_PASSWORD \
		-f BESTINVER.GestorAltas.Web.Public/Dockerfile \
		-t bestinver.gestoraltas.web.public:local .

docker-build-management: check-docker check-nuget
	docker build --build-arg NUGET_USER --build-arg NUGET_PASSWORD \
		-f BESTINVER.GestorAltas.Web.Management/Dockerfile \
		-t bestinver.gestoraltas.web.management:local .

docker-build-ws: check-docker check-nuget
	docker build --build-arg NUGET_USER --build-arg NUGET_PASSWORD \
		-f BESTINVER.Wordpress.WS/Dockerfile \
		-t bestinver.wordpress.ws:local .

dotnet-restore: check-dotnet check-nuget
	dotnet restore "$(PROJECT)" --configfile NuGet.Config

dotnet-build: check-dotnet
	dotnet build "$(PROJECT)" -c "$(BUILD_CONFIGURATION)" --no-restore

test-project: check-dotnet
	dotnet test "$(PROJECT)" -c "$(BUILD_CONFIGURATION)" --no-restore

test-all: check-dotnet
	@while IFS= read -r project; do \
		echo "==> $$project"; \
		dotnet test "$$project" -c "$(BUILD_CONFIGURATION)" --no-restore || exit $$?; \
	done < <(find . -maxdepth 2 -name '*Tests.csproj' -print | sort)

frontend-install-public:
	@cd BESTINVER.GestorAltas.Web.Public && \
	if command -v yarn >/dev/null 2>&1; then yarn install; else npm install --package-lock=false; fi

frontend-build-public:
	@cd BESTINVER.GestorAltas.Web.Public && npx gulp

frontend-install-management:
	@cd BESTINVER.GestorAltas.Web.Management && \
	if command -v yarn >/dev/null 2>&1; then yarn install; else npm install --package-lock=false; fi

frontend-build-management:
	@cd BESTINVER.GestorAltas.Web.Management && npx gulp

check-dotnet:
	@command -v dotnet >/dev/null 2>&1 || (echo "dotnet SDK 8.0 no esta instalado o no esta en PATH" >&2; exit 1)

check-docker:
	@command -v docker >/dev/null 2>&1 || (echo "docker no esta instalado o no esta en PATH" >&2; exit 1)
	@docker info >/dev/null 2>&1 || (echo "docker daemon no accesible para este usuario" >&2; exit 1)

check-nuget:
	@test -n "$$NUGET_USER" || (echo "NUGET_USER no definido" >&2; exit 1)
	@test -n "$$NUGET_PASSWORD" || (echo "NUGET_PASSWORD no definido" >&2; exit 1)
