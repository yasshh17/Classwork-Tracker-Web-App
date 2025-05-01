
# Classwork Tracker

## Project Description

The **Classwork Tracker** is a full-stack web application that allows students to manage and monitor their coursework efficiently. Built using **React (Vite SPA)** and **Express.js**, this project demonstrates secure session-based authentication, RESTful services, and dynamic user interaction without relying on persistent browser storage.

Key aspects:
- **User Registration & Login**
- **Session Management via Cookies (`sid`)**
- **CRUD Operations for Assignments**
- **Course-wise Status Dashboard**
- **Semantic HTML & Modular CSS Design**
- **Strict Compliance with Course Security & Structural Guidelines**

---

## Features

- **Secure Authentication**
- **Assignment Management (CRUD)**
- **Course Status Dashboard**
- **No Persistent Client Storage**
- **Responsive UI with Semantic HTML & CSS**

---

## 📡 API Endpoints

| Method  | Endpoint               | Description              |
|---------|------------------------|--------------------------|
| POST    | `/api/session`         | Login user               |
| DELETE  | `/api/session`         | Logout user              |
| GET     | `/api/session`         | Get current session user |
| POST    | `/api/users`           | Register new user        |
| GET     | `/api/assignments`     | List assignments         |
| POST    | `/api/assignments`     | Create assignment        |
| GET     | `/api/assignments/:id` | Get assignment           |
| PUT     | `/api/assignments/:id` | Update assignment        |
| DELETE  | `/api/assignments/:id` | Delete assignment        |
| GET     | `/api/courses`         | List courses             |
| GET     | `/`                    | Serve frontend SPA       |

---

## Tech Stack

- React + Vite
- Node.js + Express
- Cookie-Parser
- HTML5, CSS3 (modular)

---

## Running the Project

```bash
npm install
npm run build
npm start
```

---

## Styling & Design

- Font: **Inter** (Google Fonts)
- Clean, modular CSS per component
- Semantic HTML5 structure
- Responsive layout using Flexbox/Grid

---

## Security Highlights

- No password storage
- `"dog"` username banned
- Session-based auth via `sid` cookie
- Input validation (frontend & backend)
- No use of localStorage/sessionStorage

---

