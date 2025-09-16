# STI Myanmar Fresher Welcome - Voting Dashboard

## 🚀 Quick Deploy to Free Hosting

### Backend (FastAPI) - Deploy to Railway

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Python and deploy

3. **Get your API URL:**
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

### Frontend (React) - Deploy to Vercel

1. **Set Environment Variable:**
   - Create `.env` file in frontend folder:
   ```
   VITE_API_URL=https://your-railway-app.railway.app
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set Root Directory to `frontend`
   - Add Environment Variable: `VITE_API_URL` = your Railway URL
   - Deploy

## 🎯 Alternative Free Hosting Options

### Backend Options:
- **Railway** (Recommended) - Easy Python deployment
- **Render** - Good free tier
- **Heroku** - Limited free tier

### Frontend Options:
- **Vercel** (Recommended) - Best for React
- **Netlify** - Good alternative
- **GitHub Pages** - Simple static hosting

## 📱 Features
- Real-time voting dashboard
- 7 categories: King, Queen, Prince, Princess, Best Costume Male, Best Costume Female, Best Performance Award
- Live results with leading candidates
- Device-based voting prevention
- Purple and black gothic theme

## 🛠️ Local Development

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```