# ---------- BUILD ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Копіюємо csproj-файли окремо для кешування restore
COPY ["PCClubBooking.Api/PCClubBooking.Api.csproj", "PCClubBooking.Api/"]
COPY ["PCClubBooking.Application/PCClubBooking.Application.csproj", "PCClubBooking.Application/"]
COPY ["PCClubBooking.Domain/PCClubBooking.Domain.csproj", "PCClubBooking.Domain/"]
COPY ["PCClubBooking.Infrastructure/PCClubBooking.Infrastructure.csproj", "PCClubBooking.Infrastructure/"]

RUN dotnet restore "PCClubBooking.Api/PCClubBooking.Api.csproj"

# Копіюємо решту коду
COPY . .

WORKDIR "/src/PCClubBooking.Api"

# Створюємо production build
RUN dotnet publish "PCClubBooking.Api.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore


# ---------- RUNTIME ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

# Railway інжектить змінну PORT у рантаймі — слухаємо саме її.
# Fallback 8080 залишає docker-compose / локальний запуск робочим (там PORT не заданий).
ENTRYPOINT ["sh", "-c", "exec dotnet PCClubBooking.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]