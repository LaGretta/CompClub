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

ENTRYPOINT ["dotnet", "PCClubBooking.Api.dll"]