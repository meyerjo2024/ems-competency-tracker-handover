# Firebase Setup Guide - EMS Competency Tracker

**Purpose:** Step-by-step instructions to create and configure a new, isolated Firebase project for the EMS Competency Tracker MVP.

---

## **Prerequisites**

Before starting, ensure you have:
- [ ] A Google account
- [ ] Node.js installed (v18 or later)
- [ ] npm or yarn package manager
- [ ] Terminal/command line access
- [ ] Code editor (VS Code recommended)

---

## **Part 1: Create Firebase Project**

### Step 1.1: Access Firebase Console

1. Open your browser and go to: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Click **"Add project"** or **"Create a project"**

### Step 1.2: Configure Project

1. **Project Name:**
   - Enter: `EMS Competency Tracker MVP`
   - Note: Firebase will auto-generate a unique Project ID
   - Click **Continue**

2. **Google Analytics (Optional):**
   - Toggle **OFF** for simplicity (recommended for MVP)
   - OR toggle **ON** if you want usage analytics
   - Click **Continue**

3. **Create Project:**
   - Click **Create project**
   - Wait for project creation (30-60 seconds)
   - Click **Continue** when ready

4. **Note Your Project ID:**
   - You'll see it in the format: `ems-competency-tracker-mvp-xxxxx`
   - **Write this down** - you'll need it later

---

## **Part 2: Configure Firestore Database**

### Step 2.1: Create Firestore Database

1. In Firebase Console, click **"Build"** in left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"**

### Step 2.2: Choose Security Mode

1. Select **"Start in production mode"**
   - We'll deploy custom rules later
   - This ensures database starts secure
2. Click **Next**

### Step 2.3: Choose Location

1. Select a location close to your users:
   - **South Africa:** `europe-west1` (closest available)
2. Click **Enable**
3. Wait for database creation (1-2 minutes)

### Step 2.4: Verify Database Created

You should see:
- Database created successfully
- "Cloud Firestore" tab open
- Empty database with "Start collection" option

---

## **Part 3: Configure Firebase Authentication**

### Step 3.1: Enable Authentication

1. In Firebase Console, click **"Build"** in left sidebar
2. Click **"Authentication"**
3. Click **"Get started"**

### Step 3.2: Enable Email/Password Provider

1. Click on **"Sign-in method"** tab
2. Find **"Email/Password"** in the provider list
3. Click on it to expand
4. Toggle **"Enable"**
5. Leave **"Email link (passwordless sign-in)"** disabled
6. Click **"Save"**

### Step 3.3: Configure Email Templates (Optional)

1. Click on **"Templates"** tab
2. You can customize:
   - Email verification template
   - Password reset template
   - Email address change template
3. For MVP, default templates are fine

### Step 3.4: Configure Authorized Domains

1. Click on **"Settings"** tab
2. Scroll to **"Authorized domains"**
3. Should see `localhost` already added
4. Later, add your Vercel domain here (e.g., `your-app.vercel.app`)

---

## **Part 4: Install Firebase CLI**

### Step 4.1: Install Firebase Tools

Open your terminal and run:

```bash
npm install -g firebase-tools
```

Verify installation:

```bash
firebase --version
```

You should see version 13.x.x or later.

### Step 4.2: Login to Firebase

```bash
firebase login
```

This will:
1. Open a browser window
2. Ask you to sign in with Google
3. Request permissions for Firebase CLI
4. Show success message in terminal

If you see "✔ Success! Logged in as [your-email]", you're ready!

---

## **Part 5: Initialize Firebase in Your Project**

### Step 5.1: Navigate to Project Directory

```bash
cd /path/to/your/project
```

Replace `/path/to/your/project` with the actual path to your project directory.

### Step 5.2: Initialize Firebase

```bash
firebase init
```

You'll see the Firebase CLI interactive setup.

### Step 5.3: Select Features

Use arrow keys and spacebar to select:
- [x] Firestore: Configure security rules and indexes files
- [x] Functions: Configure a Cloud Functions directory (optional, but recommended)
- [x] Hosting: Configure files for Firebase Hosting (optional)

Press **Enter** to continue.

### Step 5.4: Select Project

1. Choose: **"Use an existing project"**
2. Select your project: `ems-competency-tracker-mvp-xxxxx`
3. Press **Enter**

### Step 5.5: Configure Firestore

**Question:** What file should be used for Firestore Rules?
- **Answer:** `firestore.rules` (press Enter - already exists)

**Question:** What file should be used for Firestore indexes?
- **Answer:** `firestore.indexes.json` (press Enter - already exists)

### Step 5.6: Configure Functions (if selected)

**Question:** What language would you like to use?
- **Answer:** `TypeScript` (or skip if not using functions now)

**Question:** Do you want to use ESLint?
- **Answer:** `No` (already have linting configured)

**Question:** Do you want to install dependencies?
- **Answer:** `Yes`

### Step 5.7: Configure Hosting (if selected)

**Question:** What do you want to use as your public directory?
- **Answer:** `out` (for Next.js static export) or `public`

**Question:** Configure as a single-page app?
- **Answer:** `No` (Next.js handles routing)

**Question:** Set up automatic builds and deploys with GitHub?
- **Answer:** `No` (using Vercel)

### Step 5.8: Verify Initialization

You should see files created:
-  `.firebaserc` - Project configuration
-  `firebase.json` - Firebase configuration
-  `firestore.rules` - Security rules (already existed)
-  `firestore.indexes.json` - Database indexes (already existed)

---

## **Part 6: Get Firebase Configuration**

### Step 6.1: Register Web App

1. Go to Firebase Console
2. Click the gear icon next to "Project Overview"
3. Click **"Project settings"**
4. Scroll down to **"Your apps"** section
5. Click the **Web icon** (`</>`)

### Step 6.2: Register App

1. **App nickname:** Enter `EMS Competency Tracker Web`
2. **Firebase Hosting:** Leave unchecked (using Vercel)
3. Click **"Register app"**

### Step 6.3: Copy Configuration

You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "ems-competency-tracker-xxxxx.firebaseapp.com",
  projectId: "ems-competency-tracker-xxxxx",
  storageBucket: "ems-competency-tracker-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Copy all these values** - you'll need them for `.env.local`

Click **"Continue to console"**

---

## **Part 7: Configure Environment Variables**

### Step 7.1: Create .env.local File

In your project root, create a file named `.env.local`:

```bash
touch .env.local
```

### Step 7.2: Add Firebase Configuration

Open `.env.local` and add:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ems-competency-tracker-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ems-competency-tracker-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ems-competency-tracker-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Google AI (for Genkit - optional for MVP)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

**Replace the values** with your actual Firebase config from Step 6.3.

### Step 7.3: Verify .gitignore

Ensure `.env.local` is in `.gitignore`:

```bash
# Check if .env.local is ignored
grep ".env.local" .gitignore
```

If not present, add it:

```bash
echo ".env.local" >> .gitignore
```

### Step 7.4: Create .env.local.example (Template)

Create a template for other developers:

```bash
cat > .env.local.example << 'EOF'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI (optional)
GOOGLE_GENAI_API_KEY=your_google_ai_key
EOF
```

---

## **Part 8: Deploy Firestore Security Rules**

### Step 8.1: Review Current Rules

Open `firestore.rules` and verify it contains proper rules for:
- `users` collection
- `shifts` collection
- `shiftBookings` collection
- `patientCareForms` collection (will be renamed to `encounters` in M1)

### Step 8.2: Deploy Rules

```bash
firebase deploy --only firestore:rules
```

You should see:
```
✔ Deploy complete!
```

### Step 8.3: Verify Rules in Console

1. Go to Firebase Console
2. Click **"Firestore Database"**
3. Click **"Rules"** tab
4. Verify your rules are showing
5. Check the publish date is current

---

## **Part 9: Create Initial Firestore Collections**

### Step 9.1: Create Collections Structure

In Firebase Console:

1. Go to **"Firestore Database"**
2. Click **"Start collection"**

**Create these collections:**

#### Collection: `users`
1. Collection ID: `users`
2. Click **"Next"**
3. Add first document:
   - Document ID: `AUTO-ID` (click auto-generate)
   - Fields (leave empty for now)
4. Click **"Save"**
5. Delete this placeholder document after creating

#### Collection: `shifts`
1. Repeat above process
2. Collection ID: `shifts`

#### Collection: `shiftBookings`
1. Collection ID: `shiftBookings`

#### Collection: `encounters`
1. Collection ID: `encounters`
2. This will replace `patientCareForms` collection

### Step 9.2: Verify Collections

You should see four empty collections:
-  `users`
-  `shifts`
-  `shiftBookings`
-  `encounters`

---

## **Part 10: Test Firebase Connection**

### Step 10.1: Install Dependencies

```bash
npm install
```

### Step 10.2: Start Development Server

```bash
npm run dev
```

Server should start on: `http://localhost:9002`

### Step 10.3: Check Console Logs

Open browser console (F12) and check for:
-  "Initializing Firebase app..."
-  "Getting existing Firebase app..." (on subsequent loads)
-  No errors about missing Firebase config

### Step 10.4: Test Registration

1. Go to: `http://localhost:9002/register`
2. Fill out registration form:
   - Full Name: Test Student
   - Email: student@test.com
   - Password: test123
   - Role: Student
3. Click **"Register"**
4. Check for success message
5. Verify in Firebase Console → Authentication → Users

### Step 10.5: Verify User in Firestore

1. Go to Firebase Console
2. Click **"Firestore Database"**
3. Open `users` collection
4. Should see one document with your test user
5. Verify fields: `fullName`, `email`, `role`, `approved`, `createdAt`

### Step 10.6: Test Login

1. Go to: `http://localhost:9002/login`
2. Login with: `student@test.com` / `test123`
3. Should redirect to dashboard
4. Verify no console errors

---

## **Part 11: Set Up Firestore Indexes**

### Step 11.1: Review Indexes File

Open `firestore.indexes.json` and verify it's configured.

### Step 11.2: Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

### Step 11.3: Monitor Index Creation

1. Go to Firebase Console → Firestore → Indexes
2. You'll see indexes building (can take 5-10 minutes)
3. Wait for all indexes to show "Enabled"

**Common Indexes Needed:**
- `shifts`: composite index on `date` and `instructorId`
- `shiftBookings`: composite index on `studentId` and `status`
- `encounters`: composite index on `studentId`, `shiftId`, and `isDraft`

### Step 11.4: Add Missing Indexes

As you develop, Firebase will suggest missing indexes in the console:

```
The query requires an index. You can create it here:
https://console.firebase.google.com/...
```

Click the link or manually add to `firestore.indexes.json`.

---

## **Part 12: Optional - Set Up Firebase Emulator (Development)**

For local testing without hitting production database:

### Step 12.1: Install Emulator

```bash
firebase init emulators
```

Select:
- [x] Authentication Emulator
- [x] Firestore Emulator

### Step 12.2: Configure Emulator

In `firebase.json`, add:

```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### Step 12.3: Start Emulator

```bash
firebase emulators:start
```

### Step 12.4: Configure App to Use Emulator

In `src/lib/firebase/config.ts`, add (for development only):

```typescript
if (process.env.NODE_ENV === 'development' && process.env.USE_EMULATOR === 'true') {
  connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}
```

Add to `.env.local`:
```env
USE_EMULATOR=false  # Set to true when you want to use emulator
```

---

## **Part 13: Backup & Security Best Practices**

### Step 13.1: Enable Point-in-Time Recovery (Optional)

1. Go to Firebase Console → Firestore
2. Click on **"Usage"** tab
3. Consider enabling backups (requires Blaze plan)

### Step 13.2: Set Up Budget Alerts

1. Go to Firebase Console
2. Click gear icon → **"Usage and billing"**
3. Set up budget alerts to avoid unexpected charges
4. Recommended: Set alert at $25, $50, $75

### Step 13.3: Review Security Rules Regularly

Schedule regular reviews of:
- Firestore security rules
- Authentication settings
- API key restrictions

### Step 13.4: Restrict API Keys (Production)

Before going to production:

1. Go to Google Cloud Console
2. Navigate to **"APIs & Services" → "Credentials"**
3. Find your Firebase API key
4. Click **"Restrict key"**
5. Add application restrictions (HTTP referrers)
6. Add your Vercel domain

---

## **Part 14: Troubleshooting**

### Issue: "Firebase: Error (auth/configuration-not-found)"

**Solution:**
- Verify `.env.local` exists and has correct values
- Restart dev server: `npm run dev`
- Check environment variables are prefixed with `NEXT_PUBLIC_`

### Issue: "Permission denied" when writing to Firestore

**Solution:**
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check user is authenticated: `console.log(firebaseAuth.currentUser)`
- Verify rules allow the operation

### Issue: "The query requires an index"

**Solution:**
- Click the link in error message
- OR manually add index to `firestore.indexes.json`
- Deploy: `firebase deploy --only firestore:indexes`
- Wait 5-10 minutes for index to build

### Issue: Firebase CLI not found

**Solution:**
```bash
npm install -g firebase-tools
# OR if using nvm:
npm install -g firebase-tools --prefix=/usr/local
```

### Issue: "Cannot find module 'firebase/app'"

**Solution:**
```bash
npm install firebase@latest
```

### Issue: Environment variables not loading

**Solution:**
- Verify `.env.local` is in project root (not in `src/`)
- Restart dev server completely
- Check for typos in variable names
- Ensure no quotes around values in `.env.local`

---

## **Part 15: Verification Checklist**

Before moving to M1, verify:

- [ ] Firebase project created
- [ ] Firestore database initialized
- [ ] Authentication enabled (Email/Password)
- [ ] Firebase CLI installed and logged in
- [ ] Project initialized with `firebase init`
- [ ] `.env.local` created with Firebase config
- [ ] `.env.local` is in `.gitignore`
- [ ] Security rules deployed
- [ ] Test user created and can login
- [ ] User data visible in Firestore `users` collection
- [ ] No console errors when running app
- [ ] Collections created: `users`, `shifts`, `shiftBookings`, `encounters`
- [ ] Firebase config verified in Firebase Console

---

## **Part 16: Next Steps**

 Firebase setup complete!

**Now you can:**

1. Commit your changes:
```bash
git add .
git commit -m "M0: Complete Firebase setup and configuration"
git tag -a v0.1-firebase-setup -m "Milestone 0: Firebase Setup Complete"
git push origin main --tags
```

2. Move to **M1: Data Model Updates & Firestore Integration**
   - See `IMPLEMENTATION_PLAN.md` for next steps
   - Update type definitions
   - Implement real Firestore operations

3. Continue following the implementation plan systematically

---

## **Quick Reference**

### Useful Commands

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes

# Deploy everything
firebase deploy

# Start emulator
firebase emulators:start

# View logs
firebase functions:log

# Check Firebase CLI version
firebase --version

# List projects
firebase projects:list
```

### Useful Links

- **Firebase Console:** https://console.firebase.google.com/
- **Your Project:** https://console.firebase.google.com/project/your-project-id/
- **Documentation:** https://firebase.google.com/docs
- **Firestore Docs:** https://firebase.google.com/docs/firestore
- **Auth Docs:** https://firebase.google.com/docs/auth

---

## **Support**

If you encounter issues not covered in troubleshooting:

1. Check Firebase Console for errors
2. Review browser console logs
3. Check Network tab for failed requests
4. Consult Firebase documentation
5. Search Firebase GitHub issues

---

** Congratulations!** Your Firebase project is now set up and ready for development.

