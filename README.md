# MediaHub Downloader 📥

MediaHub Downloader is a universal, production-ready media downloader SaaS platform designed with premium glassmorphism aesthetics. It enables users to parse media links, preview content statistics, convert formats, and download files directly from platforms like YouTube and Instagram.

Developed by **Sriramula Arun**.

---

## ✨ Features

- **Unified Downloader**: Paste links from YouTube, Instagram, Facebook, and Twitter/X into a single analysis bar.
- **Transcoder Options**: Choose resolutions between 360p, 720p, 1080p, and MP3 audio streams.
- **Premium Plan Restrictions**: Simulated SaaS paywall features, limiting 1080p downloads to subscribers.
- **Analytics Dashboard**: Custom-designed SVG interactive charts visualizing storage bandwidth and daily logs.
- **Admin Control Center**: Active subscriptions trackers, estimated MRR analytics, and role manipulation panels.
- **Progressive Web App (PWA)**: Completely installable on iOS and Android devices, caching core assets for faster load speeds.
- **Automatic Server Cleanup**: Built-in Python daemon thread cleaning cached downloads folder files older than 10 minutes.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v3, Framer Motion, Axios, React Router DOM
- **Backend**: Python Flask, Flask-JWT-Extended, Flask-SQLAlchemy, Flask-CORS, yt-dlp
- **Database**: SQLite (local development) / PostgreSQL (production)
- **Deployment**: Vercel (Frontend) / Railway (Backend)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- **FFmpeg** (Recommended for 1080p merging)
  - **Windows**: `winget install Gyan.FFmpeg`
  - **macOS**: `brew install ffmpeg`

### 2. Startup using the Batch Script (Single-Click)
Simply run the runner file located in the root of this project:
- **Double click** [run.bat](file:///c:/Users/srira/Desktop/DOWNLOADER/run.bat) in your file explorer.
- **OR** run `.\run.ps1` inside your PowerShell window.

This will automatically create your Python virtual environment, install all python and node requirements, and start both servers:
- **Frontend App**: http://localhost:5173
- **Backend API**: http://localhost:5093

---

## 🌐 Production Hosting

### 1. Backend (Railway)
1. Import repository on [Railway.app](https://railway.app).
2. Configure variables: `SECRET_KEY`, `JWT_SECRET_KEY`.
3. Click **Add Database** and select **PostgreSQL**.
4. Generate a public domain link in settings.

### 2. Frontend (Vercel)
1. Import repository on [Vercel.com](https://vercel.com).
2. Set **Root Directory** to `mediahub/frontend`.
3. Add environment variable: `VITE_API_URL` pointing to your Railway backend URL (with `/api` appended).
4. Click **Deploy**.
