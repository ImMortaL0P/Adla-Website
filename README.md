# UMV Adla Website

A modern, full-stack application built for UMV Adla. This repository contains both the frontend React application and the backend Node.js/Express API.

## 🏗 Architecture

The project is structured as a monorepo, keeping the frontend and backend closely integrated.

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Radix UI, Tanstack Query, Zod.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer, Nodemailer, Twilio, Google APIs (Drive).
- **Automation:** GitHub Actions is configured to automatically mirror commits from the source repository to the client's repository.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- Google Service Account (for Drive integration)

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
   Create a `.env` file in the `umv-adala/backend/` directory (you can use `.env.example` as a template):
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/adla
   JWT_SECRET=your_jwt_secret
   # Mail & Twilio configuration
   # Google Drive configuration
   ```
   Also, ensure you place the `service-account.json` (Google Drive credentials) in the `umv-adala/backend/` folder.

2. **Frontend:**
   Create a `.env` file in the `umv-adala/` directory (if needed, configured by Vite). Commonly this includes the API URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

### Running Locally

You can run both the frontend and backend concurrently from the `umv-adala` directory:

```bash
# Inside the umv-adala folder
npm run dev
```

- Local Frontend: `http://localhost:5173`
- Local Backend: `http://localhost:5000`

## ☁️ Deployment Guide

### Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Configure **Network Access** to allow inbound connections (add `0.0.0.0/0` for universal access or restrict to Render IPs).
3. Create a **Database User**.
4. Retrieve the connection string (`MONGODB_URI`) and update your production environment variables.

### Backend (Render)
1. Connect this GitHub repository to Render.
2. Create a new **Web Service**.
3. Set the **Root Directory** to `umv-adala/backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add the `.env` variables in the Render dashboard, particularly `MONGODB_URI` and any Google API keys. If your app relies on a `service-account.json` file, consider encoding it as a base64 variable or generating it dynamically before launch.

### Frontend (Vercel)
1. Connect this GitHub repository to Vercel.
2. Set the **Root Directory** to `umv-adala`.
3. Vercel will automatically detect **Vite**. Add your environment variables (like `VITE_API_URL` pointing to the Render backend).
4. Deploy!

## 🔄 Automatic Repository Mirroring

This repository automatically mirrors branch changes to another remote using GitHub Actions. Check `.github/workflows/mirror.yml` for the configuration details. 
- Ensure a valid Personal Access Token is stored in GitHub Secrets at `CLIENT_REPO_PAT`.

## 📄 License & Credits

Developed by Mangalam. All rights reserved for UMV Adla.
