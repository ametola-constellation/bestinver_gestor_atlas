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
COPY ["BESTINVER.Wordpress.WS/BESTINVER.Wordpress.WS.csproj", "BESTINVER.Wordpress.WS/"]
COPY ["BESTINVER.GestorAltas.MicroservicesProxy/BESTINVER.GestorAltas.MicroservicesProxy.csproj", "BESTINVER.GestorAltas.MicroservicesProxy/"]
COPY ["BESTINVER.GestorAltas.Domain.Interfaces/BESTINVER.GestorAltas.Domain.Interfaces.csproj", "BESTINVER.GestorAltas.Domain.Interfaces/"]
COPY ["BESTINVER.GestorAltas.Web.Models/BESTINVER.GestorAltas.Web.Models.csproj", "BESTINVER.GestorAltas.Web.Models/"]
COPY ["BESTINVER.GestorAltas.Resource/BESTINVER.GestorAltas.Resource.csproj", "BESTINVER.GestorAltas.Resource/"]
COPY ["BESTINVER.GestorAltas.Utilities/BESTINVER.GestorAltas.Utilities.csproj", "BESTINVER.GestorAltas.Utilities/"]
COPY ["BESTINVER.GestorAltas.Exceptions/BESTINVER.GestorAltas.Exceptions.csproj", "BESTINVER.GestorAltas.Exceptions/"]
COPY ["BESTINVER.GestorAltas.Domain/BESTINVER.GestorAltas.Domain.csproj", "BESTINVER.GestorAltas.Domain/"]

ARG NUGET_USER
ARG NUGET_PASSWORD
RUN dotnet restore "BESTINVER.Wordpress.WS/BESTINVER.Wordpress.WS.csproj" --configfile "/NuGet.Config"

COPY ["BESTINVER.Wordpress.WS/", "BESTINVER.Wordpress.WS/"]
COPY ["BESTINVER.GestorAltas.MicroservicesProxy/", "BESTINVER.GestorAltas.MicroservicesProxy/"]
COPY ["BESTINVER.GestorAltas.Domain.Interfaces/", "BESTINVER.GestorAltas.Domain.Interfaces/"]
COPY ["BESTINVER.GestorAltas.Web.Models/", "BESTINVER.GestorAltas.Web.Models/"]
COPY ["BESTINVER.GestorAltas.Resource/", "BESTINVER.GestorAltas.Resource/"]
COPY ["BESTINVER.GestorAltas.Utilities/", "BESTINVER.GestorAltas.Utilities/"]
COPY ["BESTINVER.GestorAltas.Exceptions/", "BESTINVER.GestorAltas.Exceptions/"]
COPY ["BESTINVER.GestorAltas.Domain/", "BESTINVER.GestorAltas.Domain/"]
WORKDIR "/src/BESTINVER.Wordpress.WS"
RUN dotnet build "BESTINVER.Wordpress.WS.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BESTINVER.Wordpress.WS.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BESTINVER.Wordpress.WS.dll"]