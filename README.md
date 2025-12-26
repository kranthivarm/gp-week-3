# Multi-Tenant SaaS Platform

A role-based, multi-tenant SaaS application built with Node.js, Express, PostgreSQL, React, and Docker.  
The platform supports system-level administration, tenant-level management, and tenant users with strict role-based access control and tenant isolation.

This project demonstrates real-world SaaS architecture, RBAC, and containerized development workflows.

---

## Table of Contents

- Overview  
- Features  
- Roles & Access Control  
- Tech Stack  
- Architecture Overview  
- Project Structure  
- Environment Variables  
- Running the Project (Docker)  
- Database Migrations & Seeds  
- UI Flow  
- Error Handling  
- Design Decisions  
- Future Improvements  

---

## Overview

This application implements a **multi-tenant SaaS architecture**, where:

- A **Super Admin** manages tenants (organizations)
- Each **Tenant** has its own users, projects, and tasks
- **Tenant Admins** manage users and projects inside their tenant
- **Users** can view projects and project details (tasks)

All data is strictly isolated by tenant.

---

## Features

- JWT-based authentication  
- Role-based access control (RBAC)  
- Tenant isolation at database and API level  
- Subscription plan limits (users, projects)  
- Project and task management  
- Read-only tenant plans  
- Protected frontend routes  
- Centralized error handling with toast notifications  
- Fully Dockerized backend, frontend, and database  

---

## Roles & Access Control

### Super Admin
- Login  
- View tenants  
- View subscription plan and limits (read-only)  
- No access to tenant data (projects, users, tasks)  

### Tenant Admin
- Login  
- View dashboard (projects & users count)  
- Create and manage projects  
- Create and manage tasks inside projects  
- Create and manage users (within limits)  

### User
- Login  
- View dashboard (projects count)  
- View projects  
- View project details (tasks)  
- Read-only access  

---

## Tech Stack

### Backend
- Node.js  
- Express.js  
- PostgreSQL  
- JWT (authentication)  
- Docker  

### Frontend
- React (Vite)  
- React Router  
- Axios  
- Tailwind CSS  
- React Toastify  

### DevOps
- Docker  
- Docker Compose  

---

## Architecture Overview

# Multi-Tenant SaaS Platform

A role-based, multi-tenant SaaS application built with Node.js, Express, PostgreSQL, React, and Docker.  
The platform supports system-level administration, tenant-level management, and tenant users with strict role-based access control and tenant isolation.

This project demonstrates real-world SaaS architecture, RBAC, and containerized development workflows.

---

## Table of Contents

- Overview  
- Features  
- Roles & Access Control  
- Tech Stack  
- Architecture Overview  
- Project Structure  
- Environment Variables  
- Running the Project (Docker)  
- Database Migrations & Seeds  
- UI Flow  
- Error Handling  
- Design Decisions  
- Future Improvements  

---

## Overview

This application implements a **multi-tenant SaaS architecture**, where:

- A **Super Admin** manages tenants (organizations)
- Each **Tenant** has its own users, projects, and tasks
- **Tenant Admins** manage users and projects inside their tenant
- **Users** can view projects and project details (tasks)

All data is strictly isolated by tenant.

---

## Features

- JWT-based authentication  
- Role-based access control (RBAC)  
- Tenant isolation at database and API level  
- Subscription plan limits (users, projects)  
- Project and task management  
- Read-only tenant plans  
- Protected frontend routes  
- Centralized error handling with toast notifications  
- Fully Dockerized backend, frontend, and database  

---

## Roles & Access Control

### Super Admin
- Login  
- View tenants  
- View subscription plan and limits (read-only)  
- No access to tenant data (projects, users, tasks)  

### Tenant Admin
- Login  
- View dashboard (projects & users count)  
- Create and manage projects  
- Create and manage tasks inside projects  
- Create and manage users (within limits)  

### User
- Login  
- View dashboard (projects count)  
- View projects  
- View project details (tasks)  
- Read-only access  

---

## Tech Stack

### Backend
- Node.js  
- Express.js  
- PostgreSQL  
- JWT (authentication)  
- Docker  

### Frontend
- React (Vite)  
- React Router  
- Axios  
- Tailwind CSS  
- React Toastify  

### DevOps
- Docker  
- Docker Compose  

---

## Architecture Overview

Client (React)
    |
    v
   JWT
    |
    v
API Gateway (Express)
    |
    v
Tenant & Role Enforcement
    |
    v
PostgreSQL (Tenant-isolated data)

- Authentication middleware extracts user identity from JWT  
- RBAC middleware enforces role permissions  
- Tenant middleware enforces tenant isolation  
- Frontend protected routes prevent unauthorized navigation  

---

## Project Structure

### Backend

├── src/
│ ├── app.js
│ ├── server.js
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── migrations/
│ ├── seeds/
│ └── utils/
├── Dockerfile
└── package.json

### Frontend
frontend/
├── src/
│ ├── api/
│ ├── auth/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ ├── App.jsx
│ └── main.jsx
├── Dockerfile
└── package.json


---

## Environment Variables

### Backend (`.env`)


---

## Environment Variables

### Backend (`.env`)


### Frontend (`.env`)


---

## Running the Project (Docker)

### Prerequisites
- Docker  
- Docker Compose  

### Build and Run


---

## Running the Project (Docker)

### Prerequisites
- Docker  
- Docker Compose  

### Build and Run

docker-compose up -d --build


### Stop Containers
docker-compose down

### view logs
docker-compose logs backend
docker-compose logs frontend


---

## Database Migrations & Seeds

- Migrations run automatically on container startup  
- Seed data initializes:
  - Super Admin account  
  - Sample tenant  
  - Tenant Admin user  

This ensures the application is usable immediately after startup.

---

## UI Flow

### Super Admin

Login → Tenants Dashboard

### Tenant Admin

Login → Dashboard → Projects → Project Details (Tasks) → Users


### User

Login → Dashboard → Projects → Project Details (Tasks)


Tasks are part of **Project Details**, not a standalone module.

---

## Error Handling

- Backend returns consistent error messages  
- Frontend displays errors using toast notifications  
- Global Axios interceptor handles:
  - 401 (session expired)  
  - 403 (unauthorized access)  
- Subscription limits are enforced and surfaced clearly  

---

## Design Decisions

- No task assignment to users (not required by specification)  
- No billing or plan upgrade UI (plans are configuration-based)  
- Tenant-wide projects visible to all tenant users  
- Read-only subscription plans  
- Per-route RBAC (read and write permissions separated)  
- Super Admin isolated from tenant-scoped data  

These decisions keep the implementation aligned with requirements and avoid unnecessary complexity.

---

## Future Improvements

- Task assignment to users  
- Plan upgrade workflow  
- Activity and audit logs  
- Pagination and search  
- Production deployment (AWS, CI/CD)  

---

## Conclusion

This project demonstrates a clean and practical implementation of a multi-tenant SaaS system with proper role separation, tenant isolation, and containerized development.  
The focus is on correctness, clarity, and maintainability rather than over-engineering.

