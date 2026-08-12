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

## Firebase Hosting Deployment (Recommended)

### Prerequisites
- Firebase CLI installed
- Firebase project configured
- GitHub account

### Step 1: Prepare Repository

```bash
# Ensure code is committed
git add .
git commit -m "Prepare for deployment"

# Create GitHub repository and push
git remote add origin [your-github-repo-url]
git push -u origin main
```

### Step 2: Build the Application

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

### Step 3: Initialize Firebase Hosting

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init hosting
```

When prompted:
- **Public directory:** `out` (for static export) or `.next/public`
- **Single-page app:** No (Next.js handles routing)
- **Automatic deploys with GitHub:** Choose based on your preference

### Step 4: Configure Environment Variables

Create a `.env.production` file with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_GENAI_API_KEY=your_google_ai_key (optional)
```

**Important:** Only `NEXT_PUBLIC_*` variables will be available in the browser.

### Step 5: Deploy

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting
```

You should see:
```
✔ Deploy complete!
✔ Hosting URL: https://your-project.firebaseapp.com
```

### Step 6: Configure Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Firebase Hosting domain (e.g., `your-project.firebaseapp.com`)
5. Save changes

### Step 7: Test Production Deployment

- [ ] Visit your Firebase Hosting URL
- [ ] Test user registration
- [ ] Test login
- [ ] Test student features
- [ ] Test instructor features
- [ ] Test admin features
- [ ] Check browser console for errors
- [ ] Test on mobile devices

### Step 8: Custom Domain (Optional)

1. In Firebase Console, go to **Hosting**
2. Click **"Add custom domain"**
3. Enter your custom domain
4. Follow DNS configuration instructions
5. Add custom domain to Firebase authorized domains

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
- Monitor Firebase performance
- Set up error tracking (optional: Sentry)

### 4. Backup Strategy
- Enable Firestore backups (requires Blaze plan)
- Document backup procedures
- Test restore procedures

## Troubleshooting

### Build Fails on Firebase Hosting
- Check build logs: `firebase deploy --only hosting`
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
- Firebase Hosting serves content via CDN
- Monitor Firebase usage and costs

### Security
- Review all Firebase security rules
- Implement rate limiting if needed
- Monitor for suspicious activity
- Keep dependencies updated

### Scalability
- Firebase Firestore scales automatically
- Firebase Hosting scales automatically
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
- Hosting: 10GB storage, 360MB/day transfer

**Note:** Monitor usage and upgrade plans as needed.

---

## Support

For deployment issues:
1. Check Firebase Hosting deploy logs
2. Check Firebase Console for errors
3. Review browser console for client errors
4. Check this documentation for troubleshooting steps

---

**Remember:** This is work-in-progress code. Test thoroughly before production use.
