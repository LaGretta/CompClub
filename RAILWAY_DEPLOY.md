# Railway monorepo deploy — PcClub

> Довідка для деплою цього монорепо на Railway. **Нічого тут не закомічено — усе в робочому дереві для рев'ю.**
> Застосовано і deploy-config (`MainService/Dockerfile`, `railway.json`), і фікс переходу MainService на PostgreSQL
> (csproj/DI/Program.cs/appsettings + перегенерована міграція). Деталі — §2, §3, §6.

---

## 0. Головне, що треба знати перед деплоєм

**Railway не «не розрізняє сервіси» через баг — так і має бути.** Railway дивиться на репозиторій як на одне джерело. Щоб з одного репо задеплоїти кілька застосунків, ти створюєш **окремий Railway service на кожен застосунок** і кожному вказуєш **Root Directory** (підпапку). Railway білдить лише цю підпапку своїм Dockerfile. Один репо → N сервісів, кожен зі своїм Root Directory. Ось і весь «монорепо-механізм».

---

## 1. Реальна структура репо (прочитана з диска)

```
PcClubMonorepoCloud/
├─ docker-compose.yml                 # локальна оркестрація 3 сервісів (не для Railway)
├─ .gitignore
├─ MainService/                       # ← ТВОЄ: .NET 10 Onion Web API (PCClubBooking)
│  ├─ Dockerfile                      # context = MainService/  → публікує PCClubBooking.Api.dll
│  ├─ .dockerignore
│  ├─ railway.json                    # (додано) Dockerfile-білд для Railway
│  ├─ PCClubBooking.sln
│  ├─ PCClubBooking.Api/              # ← startup-проєкт, dll = PCClubBooking.Api.dll
│  ├─ PCClubBooking.Application/
│  ├─ PCClubBooking.Domain/
│  ├─ PCClubBooking.Infrastructure/   # EF Core, DependencyInjection.cs
│  └─ PCClubBooking.Tests/            # виключено з образу через .dockerignore
├─ AuthService/                       # ← напарника: .NET 8 Web API
│  ├─ ComputerClubBackend.sln
│  └─ src/AuthService/
│     ├─ Dockerfile                   # context = AuthService/src/AuthService/  → AuthService.API.dll
│     ├─ AuthService.API/             # startup-проєкт
│     ├─ AuthService.Application/
│     ├─ AuthService.Domain/
│     ├─ AuthService.Shared/
│     └─ AuthService.Storage/
└─ Gateway/                           # ← напарника: .NET 8 API Gateway
   ├─ Gateway.sln
   ├─ global.json
   ├─ Dockerfile                      # context = Gateway/  → Gateway.API.dll
   └─ Gateway.API/                    # startup-проєкт
```

**Frontend у репо зараз НЕМАЄ** (ні `package.json`, ні vite/js-проєктів поза node_modules). Якщо додасте — це буде ще один Railway service зі своїм Root Directory.

**Дублікатів `PCClubBooking.*` у корені НЕМАЄ.** Working tree чистий (`nothing to commit`). Тобто той «месивний rebase» уже прибраний — зайвих папок у корені я не бачу.

### Startup-проєкти / dll (для узгодженості конфігів)

| Сервіс      | Dockerfile шлях                          | Build context (Root Dir у Railway) | Публікує dll          |
|-------------|------------------------------------------|------------------------------------|-----------------------|
| MainService | `MainService/Dockerfile`                 | `MainService`                      | `PCClubBooking.Api.dll`|
| AuthService | `AuthService/src/AuthService/Dockerfile` | `AuthService/src/AuthService`      | `AuthService.API.dll` |
| Gateway     | `Gateway/Dockerfile`                     | `Gateway`                          | `Gateway.API.dll`     |

Усі три Dockerfile написані так, що їхні `COPY`-шляхи відносні до власної папки → вони «context-clean» і працюють, коли Railway Root Directory = відповідна папка з таблиці. Тобто зі структурою все гаразд, окремі `Dockerfile` під кожен сервіс уже є.

---

## 2. ✅ ВИПРАВЛЕНО — MainService переведено з SQL Server на PostgreSQL

Спочатку код був на SQL Server (Railway керованого MSSQL не дає — тільки Postgres/MySQL/Redis/Mongo), тож Railway Postgres не підключився б. **Тепер це виправлено** (зміни в робочому дереві, не закомічено):

1. `PCClubBooking.Infrastructure.csproj`: `Microsoft.EntityFrameworkCore.SqlServer` → `Npgsql.EntityFrameworkCore.PostgreSQL` `10.0.3`.
2. `DependencyInjection.cs:17`: `UseSqlServer(...)` → `UseNpgsql(...)`.
3. `appsettings.json`: connection string → Npgsql-формат (локальний дефолт `Host=localhost;...`; на Railway перекривається env-змінною).
4. Стару SQL-Server-міграцію `20260710153045_InitialCreate` **видалено**, згенеровано нову Postgres-міграцію `20260809183837_InitialCreate` (`dotnet ef migrations add`).

`dotnet build` Api-проєкту: **0 warnings, 0 errors**. Далі §4 (Railway Postgres-обв'язка) працює як є.

---

## 3. ✅ ВИПРАВЛЕНО — увімкнено авто-міграцію на старті

Раніше блок авто-міграції в `Program.cs` був закоментований → БД лишалася без таблиць. **Тепер розкоментовано:**

```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.IsRelational())
        await db.Database.MigrateAsync();
}
```

На старті контейнера Postgres-міграція накотиться сама → схема створиться. Разом із §2 (Npgsql) це тепер безпечно.

---

## 4. Railway UI — покроково (Дорога A: Postgres)

### 4.1. Створити проєкт і сервіси (по одному на застосунок)
1. Railway → **New Project** → **Deploy from GitHub repo** → обрати `PcClubMonorepo`.
2. Перший сервіс створиться сам. Відкрий його → **Settings**:
   - **Root Directory** = `MainService`
   - **Build**: Railway підхопить `MainService/railway.json` / `MainService/Dockerfile` автоматично (Builder = Dockerfile). Якщо ні — вручну вкажи Dockerfile Path = `Dockerfile` (відносно Root Directory).
   - Перейменуй сервіс на `main-service`.
3. Для решти: у проєкті **New → GitHub Repo → той самий репо** ще раз, і задай Root Directory:
   - `auth-service` → Root Directory = `AuthService/src/AuthService`
   - `gateway` → Root Directory = `Gateway`

   Кожен новий сервіс = той самий репо + інший Root Directory. Оце і є монорепо-деплой.

### 4.2. Додати PostgreSQL
4. У проєкті **New → Database → Add PostgreSQL**. З'явиться сервіс `Postgres` зі змінними `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD`.

### 4.3. Env-змінні для `main-service`
У сервісі `main-service` → **Variables** → додай:

| Змінна | Значення |
|--------|----------|
| `ConnectionStrings__DefaultConnection` | `Host=${{Postgres.PGHOST}};Port=${{Postgres.PGPORT}};Database=${{Postgres.PGDATABASE}};Username=${{Postgres.PGUSER}};Password=${{Postgres.PGPASSWORD}}` |
| `Jwt__Key` | твій секретний ключ (той самий, яким AuthService підписує токени) |
| `Jwt__Issuer` | напр. `PCClubAPI` |
| `Jwt__Audience` | напр. `PCClubAPIClient` |
| `ASPNETCORE_ENVIRONMENT` | `Development` — якщо хочеш бачити Swagger; для прод лиши `Production` |

Важливо:
- **Використовуй саме Npgsql-формат вище (`Host=...;Username=...`), а НЕ `DATABASE_URL` (URI)** — .NET/Npgsql не парсить URI-рядок `postgres://...`.
- `${{Postgres.PGHOST}}` тощо — це Railway reference на змінні сервіса Postgres (підставляться автоматично). Заміни `Postgres` на реальне ім'я твого DB-сервіса, якщо перейменуєш.
- **`PORT` НЕ задавай вручну** — Railway інжектить її сам. Оновлений `MainService/Dockerfile` уже слухає `http://0.0.0.0:${PORT}` (fallback 8080). Тому окремо `ASPNETCORE_URLS` теж можна не ставити.
- Секрети (`Jwt__Key`) — тільки в Railway Variables, не в код/не в git.

### 4.4. Networking / публічний домен
5. `main-service` → **Settings → Networking → Generate Domain**. Railway прокине публічний URL на порт, який слухає застосунок (а він слухає `PORT`).

### 4.5. Порядок і БД-обв'язка для напарника (нотатки, не роблю за нього)
- **auth-service** (Root `AuthService/src/AuthService`): має власний Dockerfile (dll `AuthService.API.dll`, .NET 8, EXPOSE 8080). Йому теж треба свою БД + `ConnectionStrings__DefaultConnection`. **Увага:** його Dockerfile хардкодить порт (немає прив'язки до `PORT`) — або він читає `PORT` у коді, або йому теж треба поправити ENTRYPOINT так само, як я зробив MainService.
- **gateway** (Root `Gateway`): dll `Gateway.API.dll`, .NET 8. У Dockerfile жорстко `ENV ASPNETCORE_URLS=http://+:8080` → **на Railway це проблема**, бо не слухає `PORT`. Йому теж треба або прибрати цей хардкод і слухати `PORT`, або в Railway виставити target port = 8080 у Networking. Gateway ще потребує URL-и апстрімів: замість `http://auth-service:8080` (це docker-compose imена) — Railway internal URL-и виду `http://auth-service.railway.internal:8080` або публічні домени.

---

## 5. Дрібні не-блокери (до відома, код не чіпав)
- `Program.cs:19,27` — `AddControllers()` викликається двічі (нешкідливо).
- `Program.cs:83` — `UseHttpsRedirection()` у контейнері без HTTPS-порту дасть варнінг у логах (не фатально).
- `.gitignore` ігнорує `appsettings*.json`, але `MainService/PCClubBooking.Api/appsettings.json` та `.Development.json` **force-added і реально в git** → у Railway-білді вони будуть; env-змінні їх перекриють (env > appsettings у ASP.NET Core). Ок.

---

## 6. Що змінено у цьому заході (нічого не закомічено)

**Deploy-config:**
- ✏️ `MainService/Dockerfile` — ENTRYPOINT слухає Railway `PORT` (fallback 8080; docker-compose далі працює).
- ➕ `MainService/railway.json` — фіксує Dockerfile-білд.
- ➕ `RAILWAY_DEPLOY.md` — цей файл.

**Фікс SQL Server → PostgreSQL (щоб деплой на Railway Postgres реально працював):**
- ✏️ `PCClubBooking.Infrastructure.csproj` — SqlServer-пакет → `Npgsql.EntityFrameworkCore.PostgreSQL 10.0.3`.
- ✏️ `DependencyInjection.cs` — `UseSqlServer` → `UseNpgsql`.
- ✏️ `Program.cs` — увімкнено авто-міграцію (`MigrateAsync`).
- ✏️ `appsettings.json` — connection string у Npgsql-форматі.
- 🔄 Міграції — видалено SqlServer `InitialCreate`, згенеровано Postgres `20260809183837_InitialCreate`.
- ✅ `dotnet build` (Api): 0 warnings, 0 errors.

**Лишилось напарнику (не чіпав чужі сервіси — §4.5):** порти/апстріми Auth/Gateway під Railway.

**Підтвердження:** git-операцій не було; усе в working tree на рев'ю.
