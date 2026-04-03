# Quick Start: Deploy SkillSwap in 15 Minutes

This is a streamlined guide to get your SkillSwap application live as quickly as possible.

## 🚀 Prerequisites
- GitHub account
- Render account (sign up at [render.com](https://render.com))
- MongoDB Atlas account (sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## Step 1: MongoDB Atlas (5 minutes)

1. **Create free cluster** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Choose M0 FREE tier
   - Select AWS / us-east-1 region

2. **Create database user**
   - Go to "Database Access" → "Add New Database User"
   - Username: `skillswap-admin`
   - Generate strong password → **SAVE IT!**

3. **Allow network access**
   - Go to "Network Access" → "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)

4. **Get connection string**
   - Go to "Database" → Click "Connect" → "Connect your application"
   - Copy the connection string and replace:
     - `<username>` with `skillswap-admin`
     - `<password>` with your saved password
     - Add `/skillswap` before the `?`
   - Final format:
     ```
     mongodb+srv://skillswap-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority
     ```

---

## Step 2: Push to GitHub (2 minutes)

```bash
cd /Users/hithagatiputi/Documents/skillswap/skillswap

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/skillswap.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Render (5 minutes)

1. **Sign up at Render** using your GitHub account

2. **Deploy with Blueprint**
   - Click "New +" → "Blueprint"
   - Select your `skillswap` repository
   - Render detects `render.yaml` automatically
   - Click "Apply"

3. **Configure Backend Environment Variables**
   
   Go to `skillswap-backend` service → "Environment":
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB connection string from Step 1 |
   | `JWT_SECRET` | Run `openssl rand -base64 32` in terminal |
   | `FRONTEND_URL` | Leave blank for now |

4. **Configure Frontend Environment Variables**
   
   Go to `skillswap-frontend` service → "Environment":
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Leave blank for now |

5. **Wait for initial deploy** (3-5 minutes)

6. **Update URLs**
   
   After both services deploy, you'll get URLs like:
   - Backend: `https://skillswap-backend.onrender.com`
   - Frontend: `https://skillswap-frontend.onrender.com`
   
   Update environment variables:
   - Backend `FRONTEND_URL` → Your frontend URL
   - Frontend `VITE_API_URL` → Your backend URL
   
   Then manually redeploy both services.

---

## Step 4: Seed Database (3 minutes)

1. Go to `skillswap-backend` service on Render
2. Click "Shell" tab
3. Run:
   ```bash
   npm run seed
   ```

---

## ✅ Done!

Visit your frontend URL: `https://skillswap-frontend.onrender.com`

Your SkillSwap application is now live! 🎉

---

## ⚠️ Important Notes

- **Free tier limitations**: Services spin down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds after spin-down
- **Cost**: $0/month on free tier

---

## 📚 Need More Details?

See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide for:
- Detailed troubleshooting
- Custom domain setup
- Production best practices
- Monitoring and alerts
