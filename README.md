# Feed Interaction Dashboard

A full-stack web application for monitoring and managing user activity across a content feed. Built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**, this dashboard helps admins track saved and reported posts, manage user credits, and review detailed user activity logs.

---

## Features

### User Functionality

- Secure **login** and **registration**
- **Profile management** with password update
- View saved/reported feed activity (if applicable)
- Light/Dark mode toggle (persisted)

### Admin Functionality

- View and manage all registered users
- Inline **credit editing** with real-time update
- View total **saved/reported posts** count
- Open modal to **view detailed user logs**
- Visualize **aggregated analytics** over:
  - Last 6 weeks
  - Last 6 months
  - Last 6 years

---

## Tech Stack

### Frontend

- React + Vite
- React Router DOM
- Tailwind CSS v4 (`@custom-variant` for dark mode)
- Recharts (interactive graphs)
- React Hot Toast (notifications)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs, dotenv, cors

---
