# Setup Guide - EMS Competency Tracker

## Important Notice

This is a development halt handover. The system has core functionality working but is not feature-complete. Please review PROJECT_STATUS.md for details on what's implemented vs. what's incomplete.

## Prerequisites

- Node.js v18 or later
- npm or yarn package manager
- Firebase account (you'll create your own project)
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Git (for version control)

## Installation Steps

### 1. Clone or Extract Repository

If from GitHub:
```bash
git clone [repository-url]
cd ems-competency-tracker-handover
```

If from ZIP file:
```bash
unzip ems-competency-tracker-handover.zip
cd ems-competency-tracker-handover
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Firebase, and UI libraries

### 3. Firebase Project Setup

**Critical:** You must create your own Firebase project. Do not use any existing Firebase configuration.

Follow **FIREBASE_SETUP_GUIDE.md** for detailed step-by-step instructions:
- Create new Firebase project
- Enable Firestore database
- Enable Authentication (Email/Password)
- Configure security rules
- Get your Firebase configuration values

### 4. Environment Configuration

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your Firebase configuration
# Use your favorite text editor (nano, vim, VS Code, etc.)
nano .env.local
```

Add your Firebase configuration values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: For AI features
GOOGLE_GENAI_API_KEY=your_google_ai_key
```

### 5. Initialize Firebase CLI

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore (for database rules)
# - Use existing project (select your project)
# - Accept default files (firestore.rules, firestore.indexes.json)
```

### 6. Deploy Firebase Security Rules

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

**Important:** Security rules must be deployed before the app will work properly.

### 7. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:9002`

### 8. Create First Admin User

**Option A: Manual Creation in Firestore**
1. Register a user account through the app
2. Go to Firebase Console → Firestore Database
3. Find the user document in the `users` collection
4. Edit the document and set `role: "Admin"`
5. Set `approved: true`
6. Log out and log back in

**Option B: Through Firebase Console**
1. Go to Firebase Console → Authentication
2. Add user manually
3. Then follow Option A steps 2-6

### 9. Verify Installation

- [ ] Can access login page
- [ ] Can register new account
- [ ] Can log in successfully
- [ ] Dashboard loads without errors
- [ ] No console errors in browser
- [ ] Firebase connection working

## Troubleshooting

### "Firebase configuration not found"
- Verify `.env.local` exists in project root
- Check all environment variables are set
- Restart development server

### "Permission denied" errors
- Ensure Firebase rules are deployed
- Check user is authenticated
- Verify user role is set correctly

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### Port 9002 already in use
- Change port in package.json: `"dev": "next dev -p 3000"`
- Or kill process using port 9002

## Next Steps

1. Review **USER_GUIDE.md** to understand system functionality
2. Review **PROJECT_STATUS.md** to understand what's implemented
3. Test core features with test accounts
4. Review code for any customizations needed
5. Plan any additional development required

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript errors
```

## Important Notes

- This is work-in-progress code from a halted project
- Some features may be incomplete or require additional work
- Review all code before deploying to production
- Test thoroughly with your specific use cases
- Consider security audit before production deployment

---

For detailed Firebase setup, see **FIREBASE_SETUP_GUIDE.md**  
For deployment instructions, see **DEPLOYMENT.md**  
For user documentation, see **USER_GUIDE.md**
