# Deployment Guideline - Vercel

This guide provides step-by-step instructions for deploying the AGT HUB Hackathon Timeline to Vercel.

## 1. Prerequisites
- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account (you can sign up using your GitHub account).

## 2. Prepare for Deployment

### A. Push to GitHub
1. Create a new repository on GitHub.
2. Open your terminal in the project folder and run:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

## 3. Deploy to Vercel

### Option 1: Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account if you haven't already.
3. Import the `hackathon-timeline` repository.
4. Vercel will automatically detect **Vite** as the framework.
5. Click **Deploy**.
6. Once finished, Vercel will provide a production URL (e.g., `hackathon-timeline.vercel.app`).

### Option 2: Vercel CLI
If you have the Vercel CLI installed:
```bash
npm i -g vercel
vercel
```
Follow the prompts, and your site will be live in seconds.

## 4. Configuration Details
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 5. Troubleshooting
- If you see a blank page, ensure the `base` property in `vite.config.ts` is either unset or set to `'/'`.
- If the countdown shows `NaN`, double-check that the `EVENT_DATE_EAT` constant in `App.tsx` is in `YYYY-MM-DD` format.

---
*Created by Antigravity for AGT HUB Hackathon 2026*
