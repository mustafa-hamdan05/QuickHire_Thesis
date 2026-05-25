# GigFlow Java Full-Stack Project

On-Demand Freelance Gig Management System using:

- React frontend
- Java Spring Boot backend
- H2 database
- JWT authentication
- Spring Data JPA

## Demo Logins

Client:
- email: client@gigflow.com
- password: 123456

Freelancer:
- email: sara@gigflow.com
- password: 123456

## How to Open in IntelliJ

1. Extract the ZIP.
2. Open IntelliJ IDEA.
3. Choose **Open**.
4. Select the folder `gigflow-intellij-java`.
5. Wait for Maven to load.

## Run Backend

Open:

```text
backend/src/main/java/com/gigflow/GigflowApplication.java
```

Click the green Run button.

Backend runs on:

```text
http://localhost:8080
```

## Run Frontend

Open IntelliJ Terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## H2 Database Console

```text
http://localhost:8080/h2-console
```

JDBC URL:

```text
jdbc:h2:file:./data/gigflowdb
```

Username:

```text
sa
```

Password is empty.
