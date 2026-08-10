# Full-Stack Starter

A minimal but complete starter repo for the Full Stack Software Development assessment. It contains a React (Vite / TypeScript) frontend calling a Spring Boot REST API, which reads from a MySQL database. It exists to give you a known-good foundation to build your own application on.

To get started, you can run the application directly on your own machine. Containerising the stack is part of the assessment, so writing a Dockerfile for the API, another for the frontend, and the Compose file that runs them together is your task.

**The assessment brief lives in [ASSESSMENT.md](ASSESSMENT.md).** Read it before you start building.

---

## Project Structure

```text
fsd-project/
├── api/                            # Spring Boot (Java 21) backend
│   ├── src/
│   │   └── main/
│   │       └── resources/
│   │           ├── application.properties
│   │           ├── schema.sql              # Database schema (DDL)
│   │           └── data.sql                # Seed data (DML)
│   ├── local.properties.example    # Template for your local DB credentials
│   └── pom.xml
├── frontend/                       # React (Vite / TypeScript) frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── .env.example                    # Template for Docker Compose variables
└── ASSESSMENT.md                   # The assessment brief
```

---

## Prerequisites

For Part 1 (running locally):

- [JDK 21](https://adoptium.net/) — the API targets Java 21
- [Node.js 22+](https://nodejs.org/)
- [MySQL 8](https://dev.mysql.com/downloads/mysql/) running on your machine
- [Git](https://git-scm.com/)

For Part 2 (containerising):

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Part 1: Run the Starter Locally

### 1. Create the database

Connect to your local MySQL server and create an empty database:

```sql
CREATE DATABASE fsd_project;
```

You do not need to create any tables. The API creates them from `schema.sql` on startup.

### 2. Configure your database credentials

Your credentials live in `api/local.properties`, which is gitignored so it can never be committed. Create it from the template:

```bash
cd api
cp local.properties.example local.properties
```

Open `api/local.properties` and set the values to match your MySQL installation:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fsd_project
spring.datasource.username=your_local_mysql_user
spring.datasource.password=your_local_mysql_password
```

> **Never put real credentials in `application.properties`.** That file is tracked by Git, so anything you write there ends up on GitHub. Keeping secrets out of your properties files is also a graded requirement of the assessment.

### 3. Start the API

From the `api` directory:

```bash
./mvnw spring-boot:run
```

Wait for `Started ApiApplication`. You can check it directly:

```bash
curl http://localhost:8080/api/greeting
```

### 4. Start the frontend

In a second terminal, from the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. You should see the seeded greeting from the database rendered on the page.

The frontend fetches the relative path `/api/greeting`. Vite's dev server proxies anything starting with `/api` to the backend, which is why the frontend never needs to know the API's absolute address. That proxy is configured in `frontend/vite.config.ts`.

---

## Database & Schema Management

Two SQL files under `api/src/main/resources` control the database:

- **`schema.sql`** — table definitions (DDL), such as `CREATE TABLE IF NOT EXISTS greetings ...`
- **`data.sql`** — seed data (DML) inserted on startup

Because `application.properties` sets `spring.sql.init.mode=always`, **both scripts run on every single startup**, not just the first one. Your local MySQL keeps its data between restarts, so any plain `INSERT` in `data.sql` would add a duplicate row each time you start the API.

This is why the seeded insert only runs when the table is empty:

```sql
INSERT INTO greetings (message)
SELECT 'Hello World from Spring Boot Seed!'
WHERE NOT EXISTS (SELECT 1 FROM greetings);
```

Write your own seed data so that re-running it is harmless.

### Querying the database directly

Running locally:

```bash
mysql -u your_local_mysql_user -p
```

Once you have containerised the stack, the same client is available inside the running database container:

```bash
docker compose exec db mysql -u your_mysql_user -p
```

Then, in either case:

```sql
USE fsd_project;
SELECT * FROM greetings;
```

---

## Part 2: Containerise the Stack

This part is assessed. See the Containerisation section of [ASSESSMENT.md](ASSESSMENT.md) for the marking criteria.

### 1. Configure the environment variables

Duplicate the template and fill it in with credentials of your choosing:

```bash
cp .env.example .env
```

```bash
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=a_database_name
MYSQL_USER=a_database_user
MYSQL_PASSWORD=your_user_password
```

`.env` is read by Docker Compose only. It has no effect on the local run in Part 1, which reads `api/local.properties` instead.

### 2. Write the Dockerfiles

Neither application ships with a Dockerfile, so you must add your own.

#### `api/Dockerfile`

- Use a multi-stage build.
- The API targets Java 21, so pick base images to match.
- `pom.xml` sets no `<finalName>` by default, so the jar is named after the artifact and version (`api-0.0.1-SNAPSHOT.jar`). You should either copy it with a wildcard to keep the Dockerfile working when the version changes, or set the `<finalName>` value explicitly.
- Run the application as a non-root user rather than as `root`.
- The app listens on port 8080.

#### `frontend/Dockerfile`

- Ensure the project's dependencies are installed exclusively from the lock file.
- Use a start command that binds to all interfaces.
- The app listens on port 5173.
- Get the Vite dev server working before attempting the Nginx build for Stretch Goal A in [ASSESSMENT.md](ASSESSMENT.md).

### 3. Write `docker-compose.yml`

Add a Composer file in the project root. Your configuration must orchestrate three services:

**`db`**

- Uses a versioned `mysql` image
- Takes its credentials from the four variables in `.env`
- Persists its data in a named volume, so records survive a restart
- Declares a healthcheck so other services can wait for it to be ready

> **Watch out:** while MySQL sets itself up for the first time it runs a temporary internal server that accepts connections over a local socket but is not yet listening on port 3306. A healthcheck that talks to `localhost` will therefore report "healthy" too early, your API will start, and it will fail with `Connection refused`. Make sure your healthcheck tests a real network connection.

**`api`**

- Builds from `./api`.
- Waits for `db` to report healthy before starting.
- Receives `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD` as environment variables, derived from your `.env` values. 
- Sets the correct host name in the service name.
- Exposes port `8080`

**`frontend`**

- Builds from `./frontend`.
- Sets the correct host name for `VITE_API_PROXY_TARGET` so the Vite proxy targets the API container.
- Exposes port `5173`.

You also need a **named volume** for the MySQL data and a **named network** that all three services join, so they can reach each other by service name in isolation from other containers.

Nothing in the application code needs to change. The `SPRING_DATASOURCE_*` environment variables automatically override the values in `api/local.properties`, because [Spring Boot grants environment variables higher precedence than configuration files](https://docs.spring.io/spring-boot/reference/features/external-config.html).

### 4. Launch the stack

```bash
docker compose up --build
```

Docker coordinates the startup: the database initialises, the API waits for it to become healthy before connecting, and the frontend starts last.

---

## Accessing the Services

| Service     | Local (Part 1)                     | Docker (Part 2)                                |
| ----------- | ---------------------------------- | ---------------------------------------------- |
| Frontend UI | http://localhost:5173              | http://localhost:5173                          |
| Backend API | http://localhost:8080/api/greeting | http://localhost:8080/api/greeting             |
| Database    | localhost:3306                     | inside the Docker network, as the `db` service |

Only one program can listen on a given port at a time, so stop your local MySQL before publishing the database container on port 3306, or map it to a spare host port such as `3307:3306`. The API container does not need that mapping either way, because it reaches the database over the Docker network.

---

## Stopping and Resetting

Stop the containers while keeping your database records:

```bash
docker compose down
```

Delete the containers **and** the stored data:

```bash
docker compose down -v
```

The `-v` flag removes the named volume holding the MySQL data. You need this whenever you change your `.env` credentials, because MySQL only creates its users and database the first time it starts against an empty data directory. Changing `.env` alone will not update an already-initialised volume.

---

## Troubleshooting

**`Failed to configure a DataSource: 'url' attribute is not specified`**

The API cannot find your database settings. You most likely have not created `api/local.properties` yet — see Part 1, step 2.

**The API starts but cannot find `local.properties`**

That file is located relative to the directory you run the API from, so run `./mvnw spring-boot:run` from inside `api/`. If you launch the app from your IDE instead, set the run configuration's working directory to the `api` folder.

**`Access denied for user ... (using password: NO)`**

Your username or password is empty or wrong. If the username in the error is not one you recognise, the MySQL driver has fallen back to your operating system account, which means it received no username at all.

**`./mvnw test` fails**

`ApiApplicationTests` starts the entire Spring context, including the database connection, so MySQL must be running and `local.properties` must be configured before the tests will pass.

**Code changes do not appear in a running container**

Docker Compose does not rebuild an image just because you edited a file. After changing anything under `api/src`, rebuild:

```bash
docker compose up --build
```
