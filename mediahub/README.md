# MediaHub Downloader - Complete Production Guide

MediaHub Downloader is a production-ready, universal media downloader platform styled with premium glassmorphic elements. It enables users to parse media links, preview content statistics, convert formats, and download files directly from platforms like YouTube and Instagram.

---

## 📂 Project Structure

```
mediahub/
├── frontend/
│   ├── public/             # Robots.txt & Sitemap.xml SEO mappings
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # LandingHero, DownloadResult, SupportedPlatforms, FAQs...
│   │   ├── pages/          # Home, Dashboard, History, Favorites, Settings, AdminPanel...
│   │   ├── layouts/        # MainLayout, DashboardLayout
│   │   ├── hooks/          # useAuth context hook for persistent sessions
│   │   └── services/       # Axios client config with JWT response interceptors
│   ├── package.json
│   ├── tailwind.config.js  # Styling tokens definitions
│   └── vite.config.js
├── backend/
│   ├── routes/             # Blueprinted API route divisions
│   ├── controllers/        # Core business route logic controls
│   ├── services/           # DB wrapper methods & yt-dlp service integration
│   ├── models/             # SQLAlchemy tables schemas (User, Favorite, BlogPost...)
│   ├── utils/              # Security hashes & validation format helpers
│   ├── downloads/          # Directory storing temporary downloads (auto-cleaned)
│   ├── app.py              # Application factory bootstraps
│   ├── config.py           # Database URL parser & scheduler keys config
│   └── requirements.txt    # Python packages
└── database/
    └── mediahub.db         # Local SQLite storage (created dynamically)
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- **FFmpeg** (Recommended for video quality merging and MP3 transcoding)
  - **Windows**: Download via `winget install Gyan.FFmpeg` or extract binaries and add them to your System PATH variables.
  - **macOS**: Install via `brew install ffmpeg`
  - **Linux**: Install via `sudo apt install ffmpeg`

### 2. Backend Setup
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   *The API will start running on [http://localhost:5093](http://localhost:5093).*

### 3. Frontend Setup
1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The UI will start running on [http://localhost:5173](http://localhost:5173).*

---

## 🌐 Production Deployment Guide

### Backend: Railway Deployment
1. Connect your Github Repository to **Railway** (or click Create New Project).
2. Add a **PostgreSQL Database** plugin.
3. Configure the following Environment Variables in the Flask service:
   - `DATABASE_URL` (Bind automatically from PostgreSQL connection string)
   - `SECRET_KEY` (Generate a secure unique key)
   - `JWT_SECRET_KEY` (Generate a secure unique JWT key)
   - `PORT` (Bind automatically from Railway environment)
4. Ensure the Railway configuration builds using python start command: `gunicorn app:create_app()`.
5. **Nixpack / Dockerfile setup**: Railway installs `ffmpeg` automatically if you declare it in a custom `nixpacks.toml` file at the root:
   ```toml
   [providers.apt]
   packages = ["ffmpeg"]
   ```

### Frontend: Vercel Deployment
1. Import the project in **Vercel** dashboard.
2. Select **Vite** as the build framework.
3. Set the Root Directory parameter to `frontend`.
4. Configure the Build Environment Variable:
   - `VITE_API_URL`: Points to your deployed Railway backend endpoint URL (e.g., `https://backend-production.up.railway.app/api`).
5. Deploy! Vercel will transpile Tailwind styles and deploy static assets automatically.

---

## 🔍 SEO & Webmaster Setup

### 1. Robots.txt and Sitemap.xml
The application already includes pre-configured robots crawling directives and a search engine sitemap inside `frontend/public/` targeting marketing landing pages while hiding private dashboard dashboards from spiders.

### 2. Google Search Console & Analytics Integration
- **Google Analytics**: Paste your tracking ID (`G-XXXXXXXXXX`) inside `frontend/index.html` by adding the global site tag script block inside the `<head>` tag:
  ```html
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  ```
- **Google Search Console**: To verify ownership of your custom domain, generate a Google HTML file (e.g. `google12345.html`) and place it inside `frontend/public/` directory or register the ownership via TXT DNS records on Cloudflare.
- **Bing Webmaster Tools**: Paste your Bing XML verification code file inside `frontend/public/` or verify using DNS records.
