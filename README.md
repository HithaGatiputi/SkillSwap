# 🚀 SkillSwap – Peer-to-Peer Skill Exchange Platform
SkillSwap is a full-stack web application that enables users to **learn, teach, and exchange skills collaboratively**.
The platform connects individuals with complementary skills, creating a community-driven ecosystem for continuous learning.

---

## 🌟 Overview

In today’s fast-paced world, learning new skills is essential. SkillSwap bridges the gap between **skill seekers and skill providers** by offering a platform where users can exchange knowledge without monetary barriers.

Users can:

* Offer skills they are good at
* Learn new skills from others
* Connect, collaborate, and grow together

👉 The idea is based on **peer-to-peer learning**, where everyone can be both a teacher and a learner ([GitHub][1])

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React (Vite)
* 🎨 HTML, CSS, JavaScript

### Backend

* 🟢 Node.js
* 🚀 Express.js

### Database

* 🍃 MongoDB (or your DB if used)

### Deployment

* 🌐 Vercel (Frontend)

---

## ⚙️ Features

* 👤 User Authentication (Signup/Login)
* 🧑‍💼 User Profiles with Skills
* 🔍 Skill Matching System
* 🤝 Peer-to-Peer Skill Exchange
* 📊 Dashboard for managing skills
* 💬 (Optional) Chat / Interaction system

---

## 📂 Project Structure

```text
SkillSwap/
├── frontend/      # React (Vite) frontend
├── backend/       # Express backend
├── README.md
```

---

## 🚀 Getting Started

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/HithaGatiputi/SkillSwap.git
cd SkillSwap
```

---

### 🔹 2. Install Dependencies

```bash
npm install
```

---

### 🔹 3. Setup Environment Variables

Create `.env` files in both frontend and backend:

#### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

#### Frontend `.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

### 🔹 4. Run the Project

```bash
npm run dev
```

👉 Frontend runs on:

```text
http://localhost:5173
```

---

## 🌐 Deployment

This project is deployed using **Vercel**.

### Deploy via CLI:

```bash
vercel
vercel --prod
```

---

## 🎯 Use Case

Example:

* 👩‍🎨 A user knows **Graphic Design**
* 👨‍💻 Another user wants to learn it but knows **Python**

👉 SkillSwap connects them → both learn from each other




