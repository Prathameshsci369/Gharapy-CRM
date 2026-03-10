# ⚠️ IMPORTANT: Add Real Firebase Credentials to Vercel

Your project is now linked to Vercel, but the Firebase credentials being used appear to be test/placeholder values.

## To Complete Deployment:

### Option A: Add Credentials via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Project**: `gharpy-crm`
3. **Settings → Environment Variables**
4. **Add these 7 variables:**

```
NEXT_PUBLIC_FIREBASE_API_KEY = [Get from Firebase Console]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = silken-elevator-438310-i7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = silken-elevator-438310-i7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = silken-elevator-438310-i7.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [Get from Firebase Console]
NEXT_PUBLIC_FIREBASE_APP_ID = [Get from Firebase Console]
WEBHOOK_SECRET = your-secure-webhook-secret
```

### Option B: Get Credentials from Firebase Console

1. Go to: https://console.firebase.google.com
2. Select: **silken-elevator-438310-i7**
3. Click: ⚙️ Settings → Project Settings
4. Scroll to: **"Your apps"** section
5. Find: **Web app configuration**
6. Copy the values for:
   - `apiKey` → **NEXT_PUBLIC_FIREBASE_API_KEY**
   - `authDomain` → **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
   - `projectId` → **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
   - `storageBucket` → **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
   - `messagingSenderId` → **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
   - `appId` → **NEXT_PUBLIC_FIREBASE_APP_ID**

### Option C: Via CLI (After getting real credentials)

```bash
cd "/home/anand/Documents/gharpy crm/gharpy-crm"

# Update your .env.local with REAL credentials first
# Then push to GitHub:
git add .env.local
git commit -m "Update Firebase credentials"
git push origin main

# Vercel will auto-rebuild and deploy
```

## Verification Steps

After adding credentials and deploying:

1. **Check Deployment Status**
   ```bash
   vercel logs gharpy-crm
   ```

2. **Test Live URL**
   ```bash
   curl https://gharpy-crm.vercel.app
   ```

3. **Expected Response**: Should redirect to `/dashboard` (307 status)

4. **Check Firebase Connection**
   - Visit: https://gharpy-crm.vercel.app
   - Open: Browser DevTools → Console
   - Should see no Firebase auth errors

## Current Status

✅ Project linked to Vercel: `gharpy-crm`  
✅ Vercel CLI installed  
⏳ Waiting for: Real Firebase credentials  
⏳ Waiting for: Environment variables added to Vercel  

## Next Action

1. Go to Firebase Console and get real credentials
2. Add them to Vercel Dashboard (Environment Variables)
3. Trigger redeploy: Push a small change or manually trigger in Vercel dashboard

---

**Your project is ready! Just add the credentials and you're live.** 🚀
