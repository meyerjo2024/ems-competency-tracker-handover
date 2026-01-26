# Deployment Guide - EMS Competency Tracker

## Pre-Deployment Checklist

Before deploying to production, please note:

- [ ] This is work-in-progress code from a halted project
- [ ] Review **PROJECT_STATUS.md** for incomplete features
- [ ] Test all implemented features thoroughly
- [ ] Review and understand all code
- [ ] Consider security audit
- [ ] Ensure Firebase rules are production-ready
- [ ] Have backup and rollback plan

## Vercel Deployment (Recommended)

### Prerequisites

- Vercel account (free tier available)
- GitHub account
- Firebase project fully configured
- All environment variables ready

### Step 1: Prepare Repository

```bash
# Ensure code is committed
git add .
git commit -m "Prepare for deployment"

# Create GitHub repository and push
git remote add origin [your-github-repo-url]
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next

### Step 3: Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables**

Add all variables from your `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_GENAI_API_KEY=your_google_ai_key (optional)
```

**Important:** Set these for all environments (Production, Preview, Development)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide a deployment URL

### Step 5: Configure Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Vercel domain (e.g., `your-app.vercel.app`)
5. Save changes

### Step 6: Test Production Deployment

- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Test login
- [ ] Test student features
- [ ] Test instructor features
- [ ] Test admin features
- [ ] Check browser console for errors
- [ ] Test on mobile devices

### Step 7: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings → Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Add custom domain to Firebase authorized domains

## Alternative Deployment: Firebase Hosting

### Prerequisites
- Firebase CLI installed
- Firebase project configured

### Steps

```bash
# Build the application
npm run build

# Initialize Firebase Hosting (if not already done)
firebase init hosting

# Configure firebase.json
# Set public directory to: out
# Configure as single-page app: No

# Deploy
firebase deploy --only hosting
```

### Post-Deployment
- Add Firebase hosting domain to authorized domains
- Test thoroughly

## Alternative Deployment: Self-Hosted

### Prerequisites
- Node.js server
- PM2 or similar process manager
- Nginx or Apache (optional, for reverse proxy)

### Steps

```bash
# Build the application
npm run build

# Start production server
npm run start

# Or use PM2
pm2 start npm --name "ems-tracker" -- start
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:9002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Tasks

### 1. Create Admin Account
- Register first user through the app
- Manually set role to "Admin" in Firestore
- Set `approved: true`

### 2. Security Review
- Review Firebase security rules
- Check environment variables are secure
- Verify no sensitive data exposed
- Test role-based access control

### 3. Monitoring Setup
- Set up Firebase usage alerts
- Monitor Vercel analytics
- Set up error tracking (optional: Sentry)

### 4. Backup Strategy
- Enable Firestore backups (requires Blaze plan)
- Document backup procedures
- Test restore procedures

## Troubleshooting

### Build Fails on Vercel
- Check build logs for specific errors
- Verify all dependencies in package.json
- Ensure TypeScript compiles locally
- Check for environment-specific code

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase authorized domains
- Review Firebase Console for errors
- Check browser console for specific errors

### Authentication Not Working
- Verify Firebase Auth is enabled
- Check authorized domains include deployment URL
- Verify environment variables are correct
- Check Firebase Console → Authentication for errors

## Important Production Considerations

### Performance
- Next.js automatically optimizes builds
- Consider enabling Vercel Analytics
- Monitor Firebase usage and costs

### Security
- Review all Firebase security rules
- Implement rate limiting if needed
- Monitor for suspicious activity
- Keep dependencies updated

### Scalability
- Firebase Firestore scales automatically
- Vercel scales automatically
- Monitor usage and upgrade plans as needed

### Maintenance
- Plan for regular updates
- Monitor error logs
- Keep documentation updated
- Have rollback procedures ready

## Cost Considerations

### Firebase (Free Tier Limits)
- Firestore: 50K reads/day, 20K writes/day
- Authentication: Unlimited
- Storage: 1GB

### Vercel (Free Tier)
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL

**Note:** Monitor usage and upgrade plans as needed.

---

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Check Firebase Console for errors
3. Review browser console for client errors
4. Check this documentation for troubleshooting steps

---

**Remember:** This is work-in-progress code. Test thoroughly before production use
