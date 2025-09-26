# 🚀 Vercel Deployment Guide for MegaMart

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode

```bash
# Run frontend and backend separately (recommended for development)
npm run dev          # Starts Vite dev server on port 3000/3001
npm run dev:server   # Starts Express server on port 5001

# Or run both together
npm run dev:full     # Runs both frontend and backend concurrently
```

### 3. Production Mode (Local)

```bash
npm run build        # Build the frontend
npm start           # Start the production server (serves built frontend + API)
```

## 🌐 Vercel Deployment

### Step 1: Prepare Environment Variables

In your Vercel dashboard, add these environment variables:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
```

### Step 2: Deploy

```bash
# Using Vercel CLI
npm i -g vercel
vercel

# Or push to GitHub and connect to Vercel dashboard
```

### Step 3: MongoDB Atlas Setup

1. Whitelist `0.0.0.0/0` (all IPs) in MongoDB Atlas Network Access
2. Or whitelist Vercel's IP ranges

## 🔧 How It Works

### Development Mode

- **Frontend**: Vite dev server (http://localhost:3000 or 3001)
- **Backend**: Express server (http://localhost:5001)
- **API Calls**: Frontend makes requests to `http://localhost:5001/api`

### Production Mode

- **Everything**: Single Express server serves both frontend and API
- **Frontend**: Served from `/dist` folder (static files)
- **Backend**: API routes on `/api/*`
- **API Calls**: Frontend makes requests to `/api` (same domain)

## 🛠️ Architecture

```
Development:
Frontend (Vite) :3001  →  Backend (Express) :5001  →  MongoDB Atlas

Production:
Vercel (Express) → Static Files + API Routes → MongoDB Atlas
```

## 📁 Key Files for Deployment

- `vercel.json` - Vercel configuration
- `server.js` - Express server (handles both API and static files)
- `.env.production.example` - Production environment template
- `package.json` - Build and start scripts
