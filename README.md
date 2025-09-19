# CampusSwap Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)  
![Express.js](https://img.shields.io/badge/Express.js-Framework-blue?logo=express)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)  
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-orange)  
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black?logo=socket.io)  
![JWT](https://img.shields.io/badge/JWT-Authentication-red?logo=jsonwebtokens)  

---

The backend for a full-stack web  designed for college students to exchange, buy, or sell second-hand items within their campus.

---

## 📑 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#1-clone-the-repository)
  - [Setup Environment Variables](#2-setup-environment-variables)
  - [Database Setup with Docker](#3-database-setup-with-docker)
  - [Install Dependencies](#4-install-dependencies)
  - [Run Database Migrations](#5-run-database-migrations)
  - [Start the Server](#6-start-the-server)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Items](#items)
- [Real-Time Chat](#real-time-chat)
- [Core Concepts Explained](#core-concepts-explained)
- [Project Structure](#project-structure)

---

## 🚀 Features
- **User Authentication:** Secure sign-up and login with password hashing and JSON Web Tokens (JWT).  
- **User Profiles:** Manage user information, including name, course, and contact details.  
- **Item Listings:** Full CRUD (Create, Read, Update, Delete) API for managing product listings.  
- **Real-Time Chat:** Integrated chat system using WebSockets for live communication between users.  
- **Secure Data Handling:** Use of environment variables and password hashing for data privacy.  
- **Database Migrations:** Version-controlled database schema management.  

---

## 🛠️ Technology Stack
- **Platform:** Node.js  
- **Web Framework:** Express.js  
- **Database:** PostgreSQL  
- **ORM:** Drizzle ORM  
- **Real-Time Communication:** Socket.io  
- **Authentication:** JSON Web Tokens (JWT) with `jsonwebtoken`  
- **Password Hashing:** bcrypt  
- **Environment Variables:** dotenv  
- **CORS:** cors  

---

## 🏁 Getting Started

### Prerequisites
You need the following software installed on your machine:
- Node.js (LTS version)  
- npm (comes with Node.js)  
- Docker (for running the PostgreSQL database)  

### 1. Clone the Repository
```bash
git clone https://github.com/your_username/your_repo_name.git
cd your_repo_name
```
### 2. Setup Environment Variables
```bash
# Database connection details for the PostgreSQL Docker container
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=postgres
PG_PASSWORD=your_password
PG_PORT=5432

# Drizzle ORM specific
DATABASE_URL=postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}

# JWT secret for authentication
JWT_SECRET=your_long_and_secure_secret_key
```
### 3. Database Setup with Docker 
```bash
 docker run --name campus-swap-postgres -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres
```
### 4. Install Dependencies
```bash
npm install
```
### 5. Run Database Migrations
```bash
# Generate the migration file from the schema
npx drizzle-kit generate

# Run the migration script to apply changes to the database
node migrate.js
```
### 6. Start the Server
```bash
node server.js


The server will run on http://localhost:5000
.
```
## 📡 API Endpoints
| Method | Endpoint             | Description            | Auth Required |
| ------ | -------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/register` | Create a new user      | No            |
| POST   | `/api/auth/login`    | Log in and get a token | No            |

## 📦 Items
| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| GET    | `/api/items`     | Get all items     | No            |
| GET    | `/api/items/:id` | Get a single item | No            |
| POST   | `/api/items`     | Create a new item | Yes           |
| PUT    | `/api/items/:id` | Update an item    | Yes           |
| DELETE | `/api/items/:id` | Delete an item    | Yes           |

## 💬 Real-Time Chat
 - Implemented with Socket.io.

- WebSocket connection is secured with the same JWT token used for the REST API.

 - Server URL: ws://localhost:5000

- Authentication: The client must send a JWT token in the auth object of the connection handshake.

Events:

- chat message: Sent from client → server with a message.

- chat message: Emitted from server → all clients when a new message is received.

## 📘 Core Concepts Explained
-  Password Hashing: User passwords are hashed using bcrypt before storage to ensure security.

- JWT Authentication: JWT provides stateless, self-contained authentication for users.

- Database Migrations: Drizzle Kit is used for schema versioning and migrations.

- Real-Time Communication: Socket.io provides instant two-way communication for chat.

## 📂 Project Structure
| Folder/File      | Description |
|------------------|-------------|
| middleware/      | JWT authentication middleware |
| routes/          | API routes (auth, items) |
| socket/          | Socket.io chat logic |
| src/db/          | Database client & schema |
| .env             | Environment variables |
| drizzle.config.js| Drizzle configuration |
| migrate.js       | Database migration script |
| server.js        | Main Express server |




