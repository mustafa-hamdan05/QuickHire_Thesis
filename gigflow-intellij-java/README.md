# QuickHire Thesis Project

## Overview

QuickHire is a modern full-stack freelance gig management platform developed as a thesis/capstone project.  
The system connects businesses with freelancers for short-term on-demand tasks through a clean marketplace experience and smart matching concepts.

The platform focuses on:
- fast hiring
- freelance opportunity discovery
- application management
- user authentication
- scalable architecture
- AI-inspired recommendation concepts

---

# Features

## Authentication & Security
- User registration and login
- JWT authentication
- Protected backend APIs
- Secure password encryption using Spring Security

## Marketplace System
- Browse available freelance gigs
- Apply to gigs
- View application statuses
- Dynamic task loading from database
- Smart recommendation layout

## Dashboard
- Modern analytics dashboard
- Application tracking
- Match score system
- Earnings overview
- AI-inspired profile metrics

## Applications System
- Real application submission
- Pending / Accepted / Rejected statuses
- Dynamic application management

## UI/UX
- Modern responsive interface
- Hungary-inspired color palette
- Startup-style dashboard design
- Professional marketplace layout

---

# Tech Stack

## Frontend
- React
- Vite
- CSS3
- React Router

## Backend
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Maven

## Database
- H2 Database

## Tools
- IntelliJ IDEA
- Git & GitHub

---

# Project Structure

```txt
QuickHire_Thesis
│
├── backend
│   ├── controller
│   ├── config
│   ├── repository
│   ├── model
│   └── dto
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── api
│   │   └── assets
│
├── README.md
└── .gitignore
```

---

# How To Run

## Backend

Open the backend project in IntelliJ IDEA and run:

```bash
GigflowApplication.java
```

Backend runs on:

```txt
http://localhost:8080
```

H2 Console:

```txt
http://localhost:8080/h2-console
```

---

## Frontend

Open terminal inside the frontend folder:

```bash
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Demo Credentials

## Client Account

```txt
Email: client@gigflow.com
Password: 123456
```

---

# AI Integration Concept

QuickHire includes an AI-inspired recommendation and matching concept designed to improve freelancer-task compatibility.

The architecture is prepared for future integration of:
- machine learning recommendation systems
- skill matching algorithms
- NLP-based skill extraction
- smart ranking systems

Current prototype features include:
- match scores
- recommendation cards
- smart matching indicators
- AI health dashboard metrics

---

# Future Improvements

- Real AI recommendation engine
- Advanced search and filtering
- Real-time notifications
- Freelancer profile customization
- Gig posting system for clients
- PostgreSQL integration
- Cloud deployment
- WebSocket real-time updates
- Admin management dashboard

---

# Project Status

Working Full-Stack Prototype  
Built for thesis/capstone submission purposes.

---

# Author

Mustafa Hamdan

Computer Science Engineering Student  
Focused on Artificial Intelligence, Full-Stack Development, and Smart Systems.