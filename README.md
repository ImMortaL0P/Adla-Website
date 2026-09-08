# UMV Adla Website

A modern, full-stack application built for UMV Adla. This repository contains both the frontend React application and the backend Node.js/Express API.

## 🏗 Architecture

The project is structured as a monorepo, keeping the frontend and backend closely integrated.

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Radix UI, Tanstack Query, Zod.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer, Nodemailer, Twilio, Google APIs (Drive).
- **Storage:** Google Drive via OAuth 2.0 streaming upload, dynamically synced via backend API.

## 🌟 Features

- **Dynamic Content & Images**: Placeholder-free architecture. All images (including components like Hero background, About section, Staff gallery, etc.) are dynamically powered by Google Drive & MongoDB Atlas.
- **Admin Dashboard**: Full CRUD capabilities for Staff Profiles, Gallery, Notices, and System Images.
- **Google Drive Integration**: Direct, streams-based binary file uploads and downloads. (Resolving the `text/html` Google Docs corruption issue).

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- Google OAuth Desktop/Web App Credentials (for Drive integration)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/UMVAdla/UMV-Adla-Website.git
   cd UMV-Adla-Website/umv-adala
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Configuration (.env)

The application requires environment variables for both the backend and frontend. 

1. **Backend:**
   Create a `.env` file in the `umv-adala/backend/` directory:
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/adla
   JWT_SECRET=your_jwt_secret
   # Google Drive Application Credentials (OAuth 2.0)
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:10000/api/drive/oauth2callback
   ```

2. **Frontend:**
   Create a `.env` file in the `umv-adala/` directory:
   ```
   VITE_API_URL=http://localhost:10000
   ```

### Running Locally

You can run both the frontend and backend concurrently from the `umv-adala` directory:

```bash
# Inside the umv-adala folder
npm run dev
```

- Local Frontend: `http://localhost:5173`
- Local Backend: `http://localhost:10000`

## ☁️ Deployment Guide

### Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Configure **Network Access** to allow inbound connections (`0.0.0.0/0`).
3. Create a **Database User** and use the connection string in your `.env`.

### Backend (Render)
1. Connect this GitHub repository to Render.
2. Create a new **Web Service**.
3. Set the **Root Directory** to `umv-adala/backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Note: Ensure you remove static frontend serving in Render as the frontend is hosted independently and Render may throw `ENOENT` for `/dist/index.html`.

### Frontend (Vercel)
1. Connect this GitHub repository to Vercel.
2. Set the **Root Directory** to `umv-adala`.
3. Set the `VITE_API_URL` pointing to the Render backend (e.g. `https://umv-adla-backend.onrender.com`).
4. Deploy!

## 📸 System Media Mapping

Images across the website are controlled from the Admin Dashboard using absolute String labels as keys:
- **`main bg image`**: Renders on the Homepage Hero.
- **`about image`**: Renders on the About Us section background.
- **`headmaster_photo`**: Renders for the Headmaster element section.

Removing stock photographs ensures accurate dynamic delivery strictly relying on these keys.

## 📄 License & Credits

Developed by Mangalam. All rights reserved for UMV Adla.
