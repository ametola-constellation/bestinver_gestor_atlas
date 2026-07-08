#C:\ENCAMINA\Bestinver\repos\bes_GestorAltas => docker build -f BESTINVER.GestorAltas.Web.Management/Dockerfile -t bestinver.gestoraltas.web.management:latest --build-arg NUGET_USER=mesteban@encamina.com --build-arg NUGET_PASSWORD=1VktZVmhuQWFU  .

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
COPY ["BESTINVER.GestorAltas.Web.Management/BESTINVER.GestorAltas.Web.Management.csproj", "BESTINVER.GestorAltas.Web.Management/"]
COPY ["BESTINVER.GestorAltas.Domain.Interfaces/BESTINVER.GestorAltas.Domain.Interfaces.csproj", "BESTINVER.GestorAltas.Domain.Interfaces/"]
COPY ["BESTINVER.GestorAltas.Domain/BESTINVER.GestorAltas.Domain.csproj", "BESTINVER.GestorAltas.Domain/"]
COPY ["BESTINVER.GestorAltas.MicroservicesProxy/BESTINVER.GestorAltas.MicroservicesProxy.csproj", "BESTINVER.GestorAltas.MicroservicesProxy/"]
COPY ["BESTINVER.GestorAltas.Exceptions/BESTINVER.GestorAltas.Exceptions.csproj", "BESTINVER.GestorAltas.Exceptions/"]
COPY ["BESTINVER.GestorAltas.Web.Models/BESTINVER.GestorAltas.Web.Models.csproj", "BESTINVER.GestorAltas.Web.Models/"]
COPY ["BESTINVER.GestorAltas.Resource/BESTINVER.GestorAltas.Resource.csproj", "BESTINVER.GestorAltas.Resource/"]
COPY ["BESTINVER.GestorAltas.Utilities/BESTINVER.GestorAltas.Utilities.csproj", "BESTINVER.GestorAltas.Utilities/"]
COPY ["BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common.csproj", "BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/"]
COPY ["Bestinver.Auth.Ldap/Bestinver.Auth.Ldap.csproj", "Bestinver.Auth.Ldap/"]
ARG NUGET_USER
ARG NUGET_PASSWORD
RUN dotnet restore "./BESTINVER.GestorAltas.Web.Management/BESTINVER.GestorAltas.Web.Management.csproj" --configfile "/NuGet.Config"

COPY ["BESTINVER.GestorAltas.Web.Management/", "BESTINVER.GestorAltas.Web.Management/"]
COPY ["BESTINVER.GestorAltas.Domain.Interfaces/", "BESTINVER.GestorAltas.Domain.Interfaces/"]
COPY ["BESTINVER.GestorAltas.Domain/", "BESTINVER.GestorAltas.Domain/"]
COPY ["BESTINVER.GestorAltas.MicroservicesProxy/", "BESTINVER.GestorAltas.MicroservicesProxy/"]
COPY ["BESTINVER.GestorAltas.Exceptions/", "BESTINVER.GestorAltas.Exceptions/"]
COPY ["BESTINVER.GestorAltas.Web.Models/", "BESTINVER.GestorAltas.Web.Models/"]
COPY ["BESTINVER.GestorAltas.Resource/", "BESTINVER.GestorAltas.Resource/"]
COPY ["BESTINVER.GestorAltas.Utilities/", "BESTINVER.GestorAltas.Utilities/"]
COPY ["BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/", "BESTINVER.GestorAltas.Web.Common/BESTINVER.GestorAltas.Web.Common/"]
COPY ["Bestinver.Auth.Ldap/", "Bestinver.Auth.Ldap/"]
WORKDIR "/src/BESTINVER.GestorAltas.Web.Management"

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

RUN dotnet build "./BESTINVER.GestorAltas.Web.Management.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./BESTINVER.GestorAltas.Web.Management.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
#COPY --from=publish /src/BESTINVER.GestorAltas.Web.Management/package*.json ./
#RUN npm install
ENTRYPOINT ["dotnet", "BESTINVER.GestorAltas.Web.Management.dll"]