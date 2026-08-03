# Full-Stack Assessment Guide

For instructions on running the starter code, see [README.md](README.md).

## Purpose of the Assessment

This assessment evaluates your holistic growth as a full-stack developer. It measures your ability to connect a user-facing front-end with a database-backed REST API, showing your readiness for real-world application workflows.

### Assessing your technical growth

- **Foundations:** Clean code principles, software architecture pattern separation, database design, and version control.
- **Tools & Stack:** React (TypeScript) front-end, Java (Spring Boot) RESTful API, MySQL database and Docker containerisation.
- **Development & Debugging:** Debugging data flow from UI to database, and troubleshooting stack traces.
- **Project Completed:** Building a full-stack application connecting front-end views to persistent database tables.

### Assessing your soft skills growth

- **Communication:** Writing structured commit messages, documentation, and explaining technical choices during your code demo.
- **Adaptability:** Embracing multi-tiered application logic, shifting fluidly between styling UI and structuring backend repositories.

---

## Assessment Details

You can build any full-stack web application of your choosing, but it must adhere to the following architectural requirements across your technical stack.

### 1. Frontend: React (TypeScript)

- **Type Safety:** Strong usage of TypeScript interfaces/types for API response schemas and component props.
- **State Management & Data Fetching:** Efficient use of React hooks (`useState`, `useEffect`) to fetch, render, and update state based on backend data and user inputs.
- **User Interactions:** At least one form with validation capable of submitting new items, and a structured grid/list view displaying existing items.

### 2. Backend API: Java (Spring Boot)

- **HTTP Protocols & Endpoints:** Good use of RESTful architecture including at least one `GET` endpoint and one transactional write (`POST`, `PUT`, or `DELETE`) endpoint.
- **Architecture Rules:** Evidence of clean code decoupling (Controller, Service, Repository layer splitting) and OOP inheritance principles where applicable.
- **Exception Handling:** Centralised exception handling (e.g. `@ControllerAdvice` or custom exceptions) to prevent raw application crashes and return descriptive API errors.

### 3. Database: MySQL

- **Data Persistence:** You must store and manage your structural application entities inside a relational MySQL database.
- **Schema Design:** Structured tables with explicitly defined types, primary keys, and logical table relationships (foreign keys) where necessary.

### 4. Containerisation with Docker

- Create a unified `docker-compose.yml` file in your root folder that orchestrates all 3 services (frontend, backend, and mysql-db) simultaneously.
- **Environment Configuration:** Inject database configuration keys safely via Docker environment variables instead of hardcoding values inside your Java properties files.
- **Startup Ordering & Networking:** Use networking definitions so services talk to each other inside an isolated Docker virtual network. Ensure the backend waits to initialise until the MySQL database container declares itself healthy.

### 5. Documentation

- **Project Documentation:** Replace the default `README.md` with a custom one guiding the reviewer through setting up your application locally. This must include:
  - Clear configuration variables and environment setup steps.
  - Instructions on how to access both the React frontend and the API.
- **API Documentation:** Provide clear and thorough documentation for your backend API (e.g. using interactive tools like Swagger/OpenAPI via springdoc-openapi, or a detailed manual Postman collection). Ensure all endpoints are descriptive, detailing the expected HTTP methods, request parameters, request/response body schemas, and status codes for easy testing and review.
- **Database Seed Data:** Update the SQL scripts (`schema.sql` and `data.sql`) to contain the full database structure and initial seed data so the reviewer can instantly populate the MySQL database with usable records to test your application's features.

---

## Building On The Starter

This starter repo is a bare-bones smoke test, not a finished architecture. It proves a request can travel from the browser through the API to MySQL and back, and nothing more. Do not treat its structure as the pattern to copy.

| Requirement                 | In the starter                                         | Your work                                                            |
| --------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| React + TypeScript frontend | A single `App.tsx` fetching one endpoint               | Your own components, including a validated form and a list/grid view |
| Type safety                 | One `Greeting` interface                               | Types for all API schemas and component props                        |
| `GET` endpoint              | `GET /api/greeting`                                    | Endpoints for your own domain                                        |
| Write endpoint              | None                                                   | At least one `POST`, `PUT` or `DELETE`                               |
| Layered architecture        | Controller calls Repository directly, no service layer | A full Controller/Service/Repository architecture                    |
| Exception handling          | None                                                   | Centralised `@ControllerAdvice` or custom exceptions                 |
| Database schema             | One `greetings` table, no relationships                | Your own entity tables with primary and foreign keys                 |
| Seed data                   | An idempotent `data.sql` insert                        | Realistic seed records for your domain                               |
| Docker Compose              | Empty scaffold                                         | A working file                                                       |
| API documentation           | None                                                   | Swagger/OpenAPI or a Postman collection                              |

---

## Learning Outcomes

- **Design and Architect Full-Stack Systems:** Master the flow of user data as it travels across client-side state actions, network requests, backend middleware controllers, and persistent database engines.
- **Implement Industry Best Practices:** Showcase your adherence to type definitions, Spring Boot entity mapping, safe database configuration, and descriptive network error state handling.
- **Code Integration:** Connect client-side scripts with modular server architectures.

---

## Project Ideas

> **Important Notice for Learners:** Please note that any external API credits, tokens, or subscription costs required to link your application to third-party AI models (such as OpenAI, Anthropic, or Gemini) are not funded by Coding Black Females. You will need to use free tiers, promotional credits, or your own personal keys responsibly.

### 1. Personal Finance & Expense Tracker

A financial tracking application that goes beyond basic budgeting to categorise complex purchase descriptions and provide tailored savings advice based on spending patterns.

- **Frontend Component:** A clean dashboard parsing transaction logs into visual graphs (using a library like Chart.js or Recharts) paired with an "AI Financial Coach" sidebar snippet.
- **AI Integration:** Use AI to categorise unstructured transaction data into rigid database categories (e.g. parsing "TFL Travel Chrg" into 'Transportation'). At the end of the month, a prompt generates a personalised financial advice paragraph.
- **Database Layout:** `transactions` table (id, description, amount, computed_category, timestamp) and `financial_insights` table (id, month, ai_generated_advice_text).

### 2. "Smart Fridge" Recipe Alchemist & Meal Planner

An AI-powered kitchen companion that helps users minimise food waste by generating custom recipes based solely on what ingredients they currently have.

- **How it works:** Users log their current kitchen inventory. The app uses AI to recommend bespoke recipes matching those ingredients, taking dietary goals into account.
- **AI Integration:** Pass a list of user ingredients via the Spring Boot backend to an LLM API (like OpenAI GPT or Gemini) using structured JSON prompts to return a title, ingredients list, and cooking steps.
- **Database Layout:**
  - `ingredients` table tracking items currently in stock (ID, name, expiry date).
  - `saved_recipes` table caching the AI-generated responses (ID, title, instructions, created_at).
- **Frontend Component:** An interactive "Pantry Dashboard" where users can toggle ingredients on/off like tags, clicking a "Conjure Recipe" button that triggers a loading state and displays the AI's recipe card.

### 3. Content Management Blog

A publishing platform used to draft, store, and review blog articles.

- **Backend Endpoint:** `GET /api/articles` and `POST /api/articles`
- **Database Layout:** An `articles` table tracking id, title, content, and published_date.
- **Frontend Component:** A clean dashboard layout mapping out card modules for short article snippets, feeding into an internal router view for complete readings.

### 4. Interactive AI Collaborative Storyteller

A gamified text-adventure web game where players make sequential story choices, and an AI dynamically builds the narrative world, branching consequences, and item rewards based on player choices.

- **AI Integration:** The backend manages the game loop, sending the historical context of the story to the LLM to ensure continuity while forcing the AI to output exactly three logical branching choices for the next step.
- **Database Layout:** `game_sessions` table (id, player_name, created_at) and `story_nodes` table (id, session_id, story_text, choice_made, sequence_order).
- **Frontend Component:** An atmospheric interface featuring typewriter-effect text rendering, a persistent logs timeline showing past choices, and custom input modules for the player's next move.

---

## Advanced Stretch Goals

Take your engineering skill set to the next level by extending your infrastructure. Building out any of these additional milestones shows a deep understanding of modern DevOps engineering practices.

### Goal A: Advanced Front-End Containerisation

Write a multi-stage `Dockerfile` for your React application that builds production-ready static assets and serves them using an optimised server image like Nginx.

The starter's `frontend/Dockerfile` deliberately runs the Vite **development** server, which is not suitable for production. Replacing it is this goal. Note that once you serve static assets from Nginx, the Vite dev proxy no longer runs, so you will need to proxy `/api` in your Nginx configuration instead.

### Goal B: Kubernetes Orchestration

Create declarative Kubernetes configuration files (`deployment.yaml` and `service.yaml`) for each application tier. Ensure your pods are configured with appropriate resource limits, readiness/liveness probes, and that your frontend can reliably communicate with the backend cluster service.

---

## Kickstart Your Project with These Tasks

### Task A: Define Your Architecture and Data Flow

1. **Define endpoints:** Detail your primary HTTP methods, mapping out structural JSON bodies for both input requests and outcome payload answers.
2. **Design your Database Schema:** Map out entities, primary identifiers, and structural column constraints prior to spinning up code.
3. **Draft User Stories:** Prioritise minimal viable features (MVP) first (e.g. getting basic database entities rendering cleanly onto the screen) before diving into styling polish.

### Task B: Set up a GitHub Project Board

Organise your roadmap using agile boards:

- Create a Project Board within your GitHub repository (or another project planning tool of your choice), with standard columns: To Do, In Progress, and Done.
- Populate your board with at least 8 foundational cards breaking up frontend components, backend endpoints, database structure configuration, and your Docker stretch tasks.

---

You've got this! This assessment is a reflection of your journey and engineering growth. Embrace the challenge, plan step-by-step, and enjoy the process!
