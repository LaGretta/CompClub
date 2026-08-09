# ---------- BUILD ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Спочатку копіюємо csproj-файли.
# Це дозволяє Docker кешувати restore, якщо код змінився,
# але залежності залишилися тими самими.
COPY ["AuthService.API/AuthService.API.csproj", "AuthService.API/"]
COPY ["AuthService.Application/AuthService.Application.csproj", "AuthService.Application/"]
COPY ["AuthService.Domain/AuthService.Domain.csproj", "AuthService.Domain/"]
COPY ["AuthService.Shared/AuthService.Shared.csproj", "AuthService.Shared/"]
COPY ["AuthService.Storage/AuthService.Storage.csproj", "AuthService.Storage/"]

RUN dotnet restore "AuthService.API/AuthService.API.csproj"

# Тепер копіюємо сам код
COPY . .

# Переходимо до API-проєкту
WORKDIR "/src/AuthService.API"

# Збираємо production build
RUN dotnet publish "AuthService.API.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore


# ---------- RUNTIME ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

# Railway інжектить PORT у рантаймі — слухаємо саме її (fallback 8080 для локалки/compose).
ENTRYPOINT ["sh", "-c", "exec dotnet AuthService.API.dll --urls http://0.0.0.0:${PORT:-8080}"]