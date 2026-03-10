# Complete Deployment & Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Firebase Setup](#firebase-setup)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment Checklist](#post-deployment-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **OS**: macOS, Ubuntu/Debian, or Windows 10+
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 500MB free space
- **Internet**: 10+ Mbps recommended

### Required Software
```bash
# Check versions
node --version          # Should be v18+
npm --version           # Should be v9+
git --version           # Should be v2.40+
```

### Installation

#### macOS (using Homebrew)
```bash
brew install node@18
brew install git
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install nodejs npm git
```

#### Windows
1. Download Node.js from https://nodejs.org/
2. Download Git from https://git-scm.com/
3. Run installers and follow prompts

---

## Local Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/gharpy-crm.git
cd gharpy-crm
cd gharpy-crm
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your Firebase credentials
nano .env.local
```

### Step 4: Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3200
```

### Step 5: Verify Installation
```bash
# Open browser and visit:
http://localhost:3200

# You should see:
- Login page
- Firebase authentication form
- Dashboard after login
```

---

## Environment Configuration

### Required Environment Variables

Create `.env.local` in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Backend only)
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3200
NODE_ENV=development

# API Configuration (optional)
API_BASE_URL=http://localhost:3200/api
WEBHOOK_SECRET=your_webhook_secret
```

### For Production
```env
# Use production URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
WEBHOOK_SECRET=use_strong_random_string
```

---

## Firebase Setup

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a new project"
3. Enter project name: `gharpy-crm`
4. Accept terms and create

### Step 2: Enable Authentication
```
In Firebase Console:
1. Go to Authentication
2. Click "Get started"
3. Enable Email/Password provider
4. Copy config values to .env.local
```

### Step 3: Create Firestore Database
```
1. Go to Firestore Database
2. Click "Create database"
3. Choose region: asia-south1 (India)
4. Start in test mode (for development)
5. Create
```

### Step 4: Set Security Rules
```bash
# Go to Firestore > Rules
# Replace with production rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write their own data
    match /leads/{leadId} {
      allow read, write: if request.auth != null;
    }
    
    match /agents/{agentId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    
    // Add similar rules for other collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 5: Create Service Account (for Admin SDK)
```
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save JSON file
4. Add credentials to .env.local
```

### Step 6: Initialize Collections (Optional)
```bash
# Run seed script to populate test data
npm run seed

# This creates sample data for:
# - Agents
# - Properties
# - Leads
# - Visits
```

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Prerequisites
- GitHub account
- Vercel account

#### Steps
```bash
# 1. Push code to GitHub
git remote add origin https://github.com/your-org/gharpy-crm.git
git branch -M main
git push -u origin main

# 2. Create Vercel account at https://vercel.com/

# 3. Import project
- Go to Vercel dashboard
- Click "New Project"
- Select GitHub repo
- Click Import

# 4. Configure environment variables
- Go to Settings > Environment Variables
- Add all .env.local variables
- Mark as "Sensitive" for secrets

# 5. Deploy
- Click "Deploy"
- Wait for build to complete
```

#### Post-Deployment
```bash
# Your app is live at: https://gharpy-crm.vercel.app
# Custom domain: Settings > Domains > Add domain
```

---

### Option 2: Firebase Hosting

#### Prerequisites
- Firebase project (setup above)
- Google Cloud project

#### Steps
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase
firebase init hosting

# 4. Build the project
npm run build

# 5. Deploy
firebase deploy

# Your app is live at: https://your-project.web.app
```

---

### Option 3: Docker + VPS (Advanced)

#### Prerequisites
- Docker installed
- VPS with 2GB RAM minimum
- SSH access to VPS

#### Steps
```bash
# 1. Create Dockerfile
# (included in repo as Dockerfile)

# 2. Build Docker image
docker build -t gharpy-crm .

# 3. Push to Docker Hub (optional)
docker tag gharpy-crm your-username/gharpy-crm
docker push your-username/gharpy-crm

# 4. On VPS, pull and run
docker pull your-username/gharpy-crm
docker run -p 3200:3200 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=xxx \
  -e FIREBASE_PRIVATE_KEY=xxx \
  your-username/gharpy-crm

# 5. Setup reverse proxy (Nginx)
# (configuration file included)
```

---

### Option 4: AWS Amplify

#### Steps
```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configure AWS
amplify configure

# 3. Initialize Amplify
amplify init

# 4. Add hosting
amplify add hosting

# 5. Deploy
amplify publish

# Your app is live at: https://your-domain.amplifyapp.com
```

---

## Post-Deployment Checklist

### Security
- [ ] Update Firestore security rules (not test mode)
- [ ] Enable HTTPS/SSL certificate
- [ ] Setup API rate limiting
- [ ] Configure CORS properly
- [ ] Setup webhook secret
- [ ] Enable 2FA for admin accounts
- [ ] Review Firebase authentication settings
- [ ] Setup backup retention policies

### Performance
- [ ] Enable CDN caching
- [ ] Setup image optimization
- [ ] Configure database indexes
- [ ] Enable compression
- [ ] Setup monitoring and alerts
- [ ] Test page load speed
- [ ] Optimize bundle size

### Operations
- [ ] Setup error tracking (Sentry)
- [ ] Configure logging (CloudLogging)
- [ ] Setup uptime monitoring
- [ ] Create runbook documentation
- [ ] Setup automated backups
- [ ] Configure email notifications
- [ ] Test disaster recovery

### Compliance
- [ ] Add privacy policy page
- [ ] Add terms of service
- [ ] Enable audit logging
- [ ] Configure data retention
- [ ] Add GDPR compliance notice
- [ ] Setup cookie consent banner

---

## Testing After Deployment

### Functional Testing
```bash
# Test main flows
1. Login/logout
2. Create lead
3. Update lead
4. View dashboard
5. Run reports
6. Test API endpoints
```

### Performance Testing
```bash
# Check performance metrics
1. Page load time < 2 seconds
2. API response < 200ms
3. Database query < 100ms
4. Error rate < 0.1%
```

### Security Testing
```bash
# Verify security
1. SQL injection attempts
2. XSS attack attempts
3. CSRF token validation
4. Authentication bypass attempts
5. Authorization checks
```

---

## Monitoring & Maintenance

### Daily Checks
```bash
# Monitor these metrics
- Uptime status
- Error rates
- API response time
- User activity
```

### Weekly Tasks
```bash
- Review error logs
- Check performance metrics
- Verify backups
- Update dependencies (if needed)
```

### Monthly Tasks
```bash
- Security audit
- Performance optimization
- User feedback review
- Database maintenance
- Capacity planning
```

---

## Troubleshooting

### Build Errors

#### Error: "Module not found"
```bash
# Solution 1: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Solution 2: Update npm
npm install -g npm@latest
```

#### Error: "Firebase initialization failed"
```bash
# Check if .env.local exists
ls -la .env.local

# Verify Firebase credentials
npm run test:firebase

# Reinitialize Firebase
firebase init
```

### Runtime Errors

#### Error: "Firestore connection timeout"
```bash
# Check internet connection
ping google.com

# Check Firebase status
# Go to: https://status.firebase.google.com/

# Verify .env variables
cat .env.local | grep FIREBASE
```

#### Error: "Authentication failed"
```bash
# Clear browser cache and cookies
# Try in incognito window
# Check Firebase authentication rules
# Verify user exists in Firebase console
```

### Deployment Errors

#### Vercel: "Build failed"
```bash
# Check build logs in Vercel dashboard
# Verify all environment variables are set
# Test locally: npm run build
# Check Node version compatibility
```

#### Firebase: "Deploy failed"
```bash
# Update Firebase CLI
npm install -g firebase-tools@latest

# Verify firebase.json exists
ls -la firebase.json

# Check permissions
firebase auth:import --help

# Try with verbose logging
firebase deploy --debug
```

---

## Local Development Tips

### Hot Reload
```bash
# Changes automatically reload during development
npm run dev

# Press Ctrl+C to stop
```

### Database Inspection
```bash
# View Firestore data in real-time
firebase shell

# Query collections
db.collection('leads').get().then(snap => console.log(snap))
```

### API Testing
```bash
# Test API endpoints locally
curl -X GET http://localhost:3200/api/leads

# With authentication headers
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3200/api/leads
```

### Performance Profiling
```bash
# Build analysis
npm run build -- --analyze

# Runtime profiling
node --prof app.js
node --prof-process isolate-*.log > output.txt
```

---

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Firebase: https://firebase.google.com/docs
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/

### Community
- Next.js Discord: https://discord.gg/nextjs
- Firebase Community: https://firebase.google.com/community
- Stack Overflow: Tag your questions with [nextjs] [firebase]

### Paid Support
- Vercel Pro Support
- Firebase Professional Services
- Custom consulting

---

## Deployment Success Checklist

- [ ] Code deployed and running
- [ ] All pages accessible
- [ ] Database connected and working
- [ ] API endpoints functional
- [ ] Authentication working
- [ ] Environment variables configured
- [ ] Monitoring and alerts active
- [ ] Backups configured
- [ ] Security rules updated
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Email notifications working
- [ ] Error tracking enabled
- [ ] Performance acceptable
- [ ] Team trained on system

---

**Version**: 1.0
**Last Updated**: March 2026
**Status**: Ready for Production

For additional help, contact: support@gharpy-crm.com
