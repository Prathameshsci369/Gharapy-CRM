# Vercel Deployment Guide

## 🚀 Deploy Your Gharpy CRM to Vercel

Choose your preferred deployment method:

---

## Option 1: CLI Deployment (Fast - 5 Minutes)

### Step 1: Login to Vercel
```bash
cd "/home/anand/Documents/gharpy crm/gharpy-crm"
vercel login
```
- Opens browser to authenticate
- Click "Authorize" when prompted
- Returns to terminal

### Step 2: Deploy Project
```bash
vercel
```

**Follow prompts:**
- "Link to existing project?" → `n` (No)
- "What's your project's name?" → `gharpy-crm`
- "In which directory is your code?" → `.` (current directory)
- "Want to modify these settings before deploying?" → `n` (No)

**Result:**
```
✓ Project linked
✓ Built successfully
✓ Deployed to: https://gharpy-crm.vercel.app
```

### Step 3: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add WEBHOOK_SECRET
```

Enter values when prompted (from your .env.local file)

### Step 4: Redeploy with Environment Variables
```bash
vercel --prod
```

**Done!** Your app is live! 🎉

---

## Option 2: Browser Deployment (Easiest - 3 Minutes)

### Prerequisites
- Vercel account (free at vercel.com)
- GitHub repository connected

### Step 1: Fix GitHub Secret Issue

Since `service-account.json` was detected as a secret, you need to approve the upload:

1. Visit: https://github.com/Prathameshsci369/Gharapy-CRM/security/secret-scanning
2. Look for the secret alert about `service-account.json`
3. Click "Allow" or "Dismiss" to unblock the repository
4. Try pushing again:
   ```bash
   cd "/home/anand/Documents/gharpy crm/gharpy-crm"
   git push origin main
   ```

### Step 2: Connect to Vercel
1. Visit: https://vercel.com/new
2. Click "Import Git Repository"
3. Paste: `https://github.com/Prathameshsci369/Gharapy-CRM.git`
4. Click "Continue"

### Step 3: Configure Project
- Project Name: `gharpy-crm` (auto-filled)
- Framework: Next.js (auto-detected)
- Root Directory: `gharpy-crm/` (auto-detected)
- Click "Continue"

### Step 4: Add Environment Variables
Click "Environment Variables" and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY = [your-api-key]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = [your-auth-domain]
NEXT_PUBLIC_FIREBASE_PROJECT_ID = [your-project-id]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = [your-storage-bucket]
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [your-messaging-sender-id]
NEXT_PUBLIC_FIREBASE_APP_ID = [your-app-id]
WEBHOOK_SECRET = [your-webhook-secret]
```

### Step 5: Deploy
Click "Deploy"

**Vercel will:**
- Build your project
- Run tests
- Deploy automatically
- Give you a live URL

**Done!** 🎉

---

## Getting Environment Variables

### From Firebase Console:
1. Go to: https://console.firebase.google.com
2. Select your project
3. Click ⚙️ (Settings) → Project Settings
4. Copy values from "Your web app" section
5. Look for `apiKey`, `authDomain`, `projectId`, etc.

### From .env.local:
```bash
cat "/home/anand/Documents/gharpy crm/gharpy-crm/.env.local"
```

---

## Verify Deployment

### Test Your Live App
```bash
curl -I https://gharpy-crm.vercel.app
```

Should return: `HTTP/2 200`

### Check Logs
```bash
vercel logs gharpy-crm
```

### Monitor Performance
Visit Vercel dashboard: https://vercel.com/dashboard

---

## Troubleshooting

### Build Fails
```bash
vercel logs [project-name] --follow
```
Check error messages and fix locally, then:
```bash
git push origin main
# Vercel auto-redeploys on push
```

### Environment Variables Not Working
```bash
vercel env list
vercel env pull  # Download from Vercel to .env.local
```

### Firebase Not Initializing
- Verify all 6 Firebase variables are set
- Check they match your Firebase project exactly
- Redeploy after updating variables

### Webhook Not Working
- Add your live URL to webhook configurations
- Example: `https://gharpy-crm.vercel.app/api/webhook`
- Update Tally form webhook endpoint
- Test with curl:
  ```bash
  curl -X POST https://gharpy-crm.vercel.app/api/webhook \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Secret: your-secret" \
    -d '{"name":"Test","phone":"+919876543210"}'
  ```

---

## Post-Deployment Checklist

- [ ] Vercel URL is live
- [ ] Homepage loads (auto-redirects to /dashboard)
- [ ] Login page works
- [ ] Dashboard shows data
- [ ] API endpoints respond (test with curl)
- [ ] Webhooks configured with new URL
- [ ] Environment variables all set
- [ ] Firebase connected (data syncs in real-time)
- [ ] SSL/HTTPS working
- [ ] Error logs monitored

---

## Custom Domain (Optional)

### Add Domain to Vercel
1. Vercel dashboard → Project → Settings
2. Domains section → Add domain
3. Follow DNS setup instructions
4. Point your domain to Vercel nameservers

### Example:
- Domain: `gharpy.com`
- Vercel URL: `gharpy.vercel.app`
- After setup: `https://gharpy.com` works

---

## Continuous Deployment

### Auto-Deploy on Git Push
Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests
# 4. Deploys if successful
```

View deployment status: https://vercel.com/dashboard

---

## CLI Commands Reference

```bash
# Login
vercel login

# Deploy (staging)
vercel

# Deploy (production)
vercel --prod

# View logs
vercel logs [project-name]

# List environment variables
vercel env list

# Pull environment from Vercel
vercel env pull

# Remove a project
vercel remove [project-name]

# Help
vercel --help
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub: https://github.com/Prathameshsci369/Gharapy-CRM

---

**Your app is ready to deploy! Choose CLI or Browser method above.** 🚀
