# 🎓 DevCamper API

A production-ready RESTful API for a bootcamp directory platform — built with Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/express-4.x-blue?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/license-ISC-orange?style=flat-square)
![API Version](https://img.shields.io/badge/API-v1-blueviolet?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Database Seeding](#-database-seeding)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)
  - [Authentication](#authentication--auth)
  - [Bootcamps](#bootcamps)
  - [Courses](#courses)
  - [Reviews](#reviews)
  - [Users (Admin)](#users-admin)
- [Security](#-security)
- [Project Structure](#-project-structure)


---

## 🔭 Overview

**DevCamper** is a comprehensive backend API that powers a coding bootcamp directory platform. It enables users to discover bootcamps, browse courses, leave reviews, and manage their accounts — while publishers can list and manage their own bootcamp offerings. The API features JWT-based authentication, role-based access control, geospatial queries, file uploads, and interactive Swagger documentation.

---

## ✨ Features

| Category | Details |
|---|---|
| **CRUD Operations** | Full create, read, update, delete for bootcamps, courses, reviews, and users |
| **Authentication** | JWT token-based auth with secure HTTP-only cookie support |
| **Authorization** | Role-based access control (`user`, `publisher`, `admin`) |
| **Password Management** | Forgot password flow with email token + reset endpoint |
| **Geospatial Queries** | Find bootcamps within a radius using geocoded addresses |
| **File Uploads** | Bootcamp photo upload with file type & size validation |
| **Advanced Filtering** | Select, sort, pagination, and MongoDB query operators (`$gt`, `$gte`, `$lt`, `$lte`, `$in`) |
| **Aggregation** | Auto-calculated average course cost and average review rating |
| **API Documentation** | Interactive Swagger UI available at `/api-docs` |
| **Database Seeding** | CLI-based seeder for bootstrapping bootcamp and course data |
| **Security Hardening** | Helmet, XSS protection, rate limiting, HPP, CORS, NoSQL injection sanitization |

---

## 🏗 Architecture

```
Client Request
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│                     Express Server                       │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │  Security   │  │  Body    │  │  Morgan Logger       │ │
│  │  Middleware  │→ │  Parser  │→ │  (dev mode)          │ │
│  └─────────────┘  └──────────┘  └──────────────────────┘ │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                   Router Layer                       │ │
│  │  /api/v1/auth  /bootcamps  /courses  /reviews /users │ │
│  └──────────────────────────────────────────────────────┘ │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │  Auth       │  │  Advanced      │  │  Async        │  │
│  │  Middleware  │→ │  Results       │→ │  Handler      │  │
│  │  (JWT)      │  │  (filter/page) │  │  (try/catch)  │  │
│  └─────────────┘  └────────────────┘  └───────────────┘  │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                   Controllers                        │ │
│  │  Business logic · Validation · Error responses       │ │
│  └──────────────────────────────────────────────────────┘ │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │             Mongoose Models / MongoDB                │ │
│  │  Bootcamp · Course · Review · User                   │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express 4.x |
| **Database** | MongoDB (Mongoose 6.x ODM) |
| **Authentication** | JSON Web Tokens (jsonwebtoken) + bcryptjs |
| **Email** | Nodemailer (SMTP via Mailtrap) |
| **Geocoding** | node-geocoder (OpenStreetMap) |
| **File Upload** | express-fileupload |
| **API Docs** | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| **Security** | helmet · cors · express-rate-limit · hpp · xss-clean · express-mongo-sanitize |
| **Dev Tools** | nodemon · morgan |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16.x
- **npm** ≥ 8.x
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/devcamper-api.git
cd devcamper-api

# Install dependencies
npm install
```

### Environment Variables

Create a `config/config.env` file at the project root. Refer to the `config/config.env` file for the required variables (MongoDB URI, JWT secret, SMTP credentials, geocoder settings, etc.).

### Running the Server

```bash
# Development (with hot-reload via nodemon)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:5000` by default.

---

## 🌱 Database Seeding

Populate the database with sample bootcamps and courses from the `_data/` directory:

```bash
# Import seed data
node seeder _import

# Destroy all data
node seeder _delete
```

---

## 📖 API Documentation

Interactive **Swagger UI** documentation is auto-generated from JSDoc annotations in the route files and is available at:

| Resource | URL |
|---|---|
| Swagger UI | [`http://localhost:5000/api-docs`](http://localhost:5000/api-docs) |
| JSON Spec | [`http://localhost:5000/api-docs.json`](http://localhost:5000/api-docs.json) |
| Redirect | [`http://localhost:5000/docs`](http://localhost:5000/docs) → Swagger UI |

---

## 📡 API Endpoints

> **Base URL:** `http://localhost:5000/api/v1`

### Authentication — `/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Log in and receive JWT |
| `POST` | `/auth/logout` | Public | Log out / clear cookie |
| `GET` | `/auth/me` | Private | Get current logged-in user |
| `PUT` | `/auth/updatedetails` | Private | Update name and email |
| `PUT` | `/auth/updatepassword` | Private | Update password |
| `POST` | `/auth/forgotpassword` | Public | Send password reset email |
| `PUT` | `/auth/resetpassword/:resettoken` | Public | Reset password via token |

### Bootcamps

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/bootcamps` | Public | Get all bootcamps (with filtering, sorting, pagination) |
| `GET` | `/bootcamps/:id` | Public | Get single bootcamp |
| `POST` | `/bootcamps` | Private (Publisher/Admin) | Create new bootcamp |
| `PUT` | `/bootcamps/:id` | Private (Owner/Admin) | Update bootcamp |
| `DELETE` | `/bootcamps/:id` | Private (Owner/Admin) | Delete bootcamp (cascades to courses) |
| `GET` | `/bootcamps/radius/:zipcode/:distance` | Public | Find bootcamps within radius (miles) |
| `PUT` | `/bootcamps/:id/photo` | Private (Owner/Admin) | Upload bootcamp photo |

### Courses

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/courses` | Public | Get all courses |
| `GET` | `/bootcamps/:bootcampId/courses` | Public | Get courses for a specific bootcamp |
| `GET` | `/courses/:id` | Public | Get single course |
| `POST` | `/bootcamps/:bootcampId/courses` | Private (Publisher/Admin) | Add course to bootcamp |
| `PUT` | `/courses/:id` | Private (Owner/Admin) | Update course |
| `DELETE` | `/courses/:id` | Private (Owner/Admin) | Delete course |

### Reviews

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/reviews` | Public | Get all reviews |
| `GET` | `/bootcamps/:bootcampId/reviews` | Public | Get reviews for a bootcamp |
| `GET` | `/reviews/:id` | Public | Get single review |
| `POST` | `/bootcamps/:bootcampId/reviews` | Private (User) | Add review to bootcamp |
| `PUT` | `/reviews/:id` | Private (Owner/Admin) | Update review |
| `DELETE` | `/reviews/:id` | Private (Owner/Admin) | Delete review |

### Users (Admin)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users` | Private (Admin) | Get all users |
| `GET` | `/users/:id` | Private (Admin) | Get single user |
| `POST` | `/users` | Private (Admin) | Create user |
| `PUT` | `/users/:id` | Private (Admin) | Update user |
| `DELETE` | `/users/:id` | Private (Admin) | Delete user |

---

## 🔒 Security

This API implements multiple layers of security hardening:

| Measure | Package | Purpose |
|---|---|---|
| **HTTP Headers** | `helmet` | Sets security-related HTTP response headers |
| **Rate Limiting** | `express-rate-limit` | 100 requests per 10-minute window |
| **XSS Protection** | `xss-clean` | Sanitizes user input against cross-site scripting |
| **NoSQL Injection** | `express-mongo-sanitize` | Prevents MongoDB operator injection |
| **HPP** | `hpp` | Protects against HTTP Parameter Pollution |
| **CORS** | `cors` | Enables cross-origin resource sharing |
| **Password Hashing** | `bcryptjs` | Salted hashing with 10 rounds |
| **JWT Cookies** | `cookie-parser` | HTTP-only cookies in production (secure flag enabled) |

---

## 📁 Project Structure

```
devcamper-api/
├── _data/                    # Seed data (JSON fixtures)
│   ├── bootcamps.json
│   ├── courses.json
│   ├── reviews.json
│   └── users.json
├── config/
│   ├── config.env            # Environment variables (git-ignored)
│   ├── db.js                 # MongoDB connection handler
│   └── swagger.js            # Swagger/OpenAPI configuration
├── controllers/
│   ├── auth.js               # Auth logic (register, login, password reset)
│   ├── bootcamps.js          # Bootcamp CRUD + photo upload + geospatial
│   ├── courses.js            # Course CRUD with avg cost aggregation
│   ├── reveiw.js             # Review CRUD with avg rating aggregation
│   └── users.js              # Admin user management
├── middleware/
│   ├── advancedResults.js    # Filtering, sorting, pagination middleware
│   ├── async.js              # Async/await error wrapper
│   ├── auth.js               # JWT verification + role authorization
│   └── error.js              # Centralized error handler
├── models/
│   ├── Bootcamp.js           # Bootcamp schema (geocoding, slugs, virtuals)
│   ├── Course.js             # Course schema (avg cost statics)
│   ├── Review.js             # Review schema (avg rating statics)
│   └── User.js               # User schema (JWT, bcrypt, password reset)
├── public/                   # Static assets & uploaded files
├── routes/
│   ├── auth.js               # Auth routes with Swagger annotations
│   ├── bootcamps.js          # Bootcamp routes with Swagger annotations
│   ├── courses.js            # Course routes with Swagger annotations
│   ├── reviews.js            # Review routes with Swagger annotations
│   └── users.js              # User routes with Swagger annotations
├── util/
│   ├── errorResponse.js      # Custom ErrorResponse class
│   ├── geocoder.js            # Geocoder client configuration
│   └── sendEmail.js           # Nodemailer transport & send helper
├── .gitignore
├── package.json
├── seeder.js                 # Database import/delete CLI tool
├── server.js                 # Application entry point
└── README.md
```

## API Documentation

[View API Documentation](https://apibootcamp.onrender.com/api-docs)

Built with ❤️ using Node.js, Express & MongoDB
