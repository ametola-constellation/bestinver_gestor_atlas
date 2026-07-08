FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base
RUN apk add --no-cache \
        icu-data-full \
        icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["NuGet.Config", "/"]
COPY ["Directory.Packages.props", "/"]
COPY ["Directory.Build.props", "/"]
COPY ["BESTINVER.GestorAltas.Web.Public/BESTINVER.GestorAltas.Web.Public.csproj", "BESTINVER.GestorAltas.Web.Public/"]
COPY ["BESTINVER.GestorAltas.Domain.Interfaces/BESTINVER.GestorAltas.Domain.Interfaces.csproj", "BESTINVER.GestorAltas.Domain.Interfaces/"]
COPY ["BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common.csproj", "BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/"]
COPY ["Bestinver.Auth.Ldap/Bestinver.Auth.Ldap.csproj", "Bestinver.Auth.Ldap/"]
COPY ["BESTINVER.GestorAltas.MicroservicesProxy/BESTINVER.GestorAltas.MicroservicesProxy.csproj", "BESTINVER.GestorAltas.MicroservicesProxy/"]
COPY ["BESTINVER.GestorAltas.Web.Models/BESTINVER.GestorAltas.Web.Models.csproj", "BESTINVER.GestorAltas.Web.Models/"]
COPY ["BESTINVER.GestorAltas.Resource/BESTINVER.GestorAltas.Resource.csproj", "BESTINVER.GestorAltas.Resource/"]
COPY ["BESTINVER.GestorAltas.Utilities/BESTINVER.GestorAltas.Utilities.csproj", "BESTINVER.GestorAltas.Utilities/"]
COPY ["BESTINVER.GestorAltas.Exceptions/BESTINVER.GestorAltas.Exceptions.csproj", "BESTINVER.GestorAltas.Exceptions/"]
COPY ["BESTINVER.GestorAltas.Domain/BESTINVER.GestorAltas.Domain.csproj", "BESTINVER.GestorAltas.Domain/"]
ARG NUGET_USER
ARG NUGET_PASSWORD
RUN dotnet restore "BESTINVER.GestorAltas.Web.Public/BESTINVER.GestorAltas.Web.Public.csproj" --configfile "/NuGet.Config"

COPY ["BESTINVER.GestorAltas.Web.Public/", "BESTINVER.GestorAltas.Web.Public/"]
COPY ["BESTINVER.GestorAltas.Domain.Interfaces/", "BESTINVER.GestorAltas.Domain.Interfaces/"]
COPY ["BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/", "BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/"]
COPY ["Bestinver.Auth.Ldap/", "Bestinver.Auth.Ldap/"]
COPY ["BESTINVER.GestorAltas.MicroservicesProxy/", "BESTINVER.GestorAltas.MicroservicesProxy/"]
COPY ["BESTINVER.GestorAltas.Web.Models/", "BESTINVER.GestorAltas.Web.Models/"]
COPY ["BESTINVER.GestorAltas.Resource/", "BESTINVER.GestorAltas.Resource/"]
COPY ["BESTINVER.GestorAltas.Utilities/", "BESTINVER.GestorAltas.Utilities/"]
COPY ["BESTINVER.GestorAltas.Exceptions/", "BESTINVER.GestorAltas.Exceptions/"]
COPY ["BESTINVER.GestorAltas.Domain/", "BESTINVER.GestorAltas.Domain/"]
WORKDIR "/src/BESTINVER.GestorAltas.Web.Public"
ENV NODE_VERSION=20.11.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN npm install -g yarn; npm install gulp -g
RUN yarn install
RUN gulp
RUN dotnet build "BESTINVER.GestorAltas.Web.Public.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BESTINVER.GestorAltas.Web.Public.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BESTINVER.GestorAltas.Web.Public.dll"]