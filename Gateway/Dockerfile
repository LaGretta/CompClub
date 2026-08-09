# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy solution and project files
COPY Gateway.sln .
COPY global.json .

COPY Gateway.API/Gateway.API.csproj Gateway.API/

# Restore dependencies
RUN dotnet restore Gateway.API/Gateway.API.csproj

# Copy source code
COPY Gateway.API/ Gateway.API/

# Build and publish
RUN dotnet publish Gateway.API/Gateway.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

COPY --from=build /app/publish .

# ASP.NET Core listens on port 8080 inside container
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Gateway.API.dll"]