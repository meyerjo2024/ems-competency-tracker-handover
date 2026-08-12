# Demo Guide - EMS Competency Tracker

This guide will help you set up and demo the EMS Competency Tracker application with test accounts.

## Quick Start (5-10 minutes)

### Prerequisites
- Node.js v18 or later installed
- Git installed
- A terminal/command line interface
- A Firebase project (free tier works fine)

### Step 1: Clone the Repository

```bash
git clone https://github.com/meyerjo2024/ems-competency-tracker-handover.git
cd ems-competency-tracker-handover
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project" (or use an existing one)
3. Name it something like "EMS-Demo"
4. Click "Create project"
5. Wait for it to complete, then click "Continue"

### Step 4: Enable Firestore Database

1. In Firebase Console, click "Firestore Database" (left sidebar)
2. Click "Create database"
3. Choose **"Start in test mode"** (for demo purposes)
4. Select a region (us-central1 recommended)
5. Click "Create"

### Step 5: Enable Authentication

1. Click "Authentication" (left sidebar)
2. Click "Get Started"
3. Click "Email/Password"
4. Toggle **"Enable"** on
5. Click "Save"

### Step 6: Get Your Firebase Config

1. Click the ⚙️ (Settings) icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the `</>` (Web) app, or create one if needed
4. Copy the Firebase config object (should look like below)

### Step 7: Configure Environment File

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your Firebase credentials from Step 6
# It should look like:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false

# Optional: AI features
GOOGLE_GENAI_API_KEY=your-api-key
```

### Step 8: Start the Development Server

```bash
# Use a different port if 9002 is in use
npm run dev -- -p 3000
```

The application will start at **`http://localhost:3000`**

### Step 9: Create Test Accounts

#### Creating a Student Account

1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - **Full Name:** `John Student`
   - **Email:** `student@demo.local`
   - **Password:** `demo12345`
   - **Confirm Password:** `demo12345`
   - **Role:** Select "Student"
3. Click **Register**

#### Creating an Instructor Account

1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - **Full Name:** `Jane Instructor`
   - **Email:** `instructor@demo.local`
   - **Password:** `demo12345`
   - **Confirm Password:** `demo12345`
   - **Role:** Select "Instructor"
3. Click **Register**

#### Creating an Admin Account

1. Register a user as described above:
   - **Full Name:** `Admin User`
   - **Email:** `admin@demo.local`
   - **Password:** `demo12345`
   - **Role:** Select "Administrator"

2. Set up as Admin (in Firestore):
   - Open your [Firebase Console](https://console.firebase.google.com)
   - Go to Firestore Database → Collections
   - Find the `users` collection
   - Click on the admin user document
   - Edit the document and set:
     - `role` = `"Administrator"`
     - `approved` = `true`
   - Click "Update"

## Demo Credentials Quick Reference

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Student | student@demo.local | demo12345 | View shifts, submit patient encounters |
| Instructor | instructor@demo.local | demo12345 | Create shifts, review student work |
| Administrator | admin@demo.local | demo12345 | Manage users, approve instructors |

## Troubleshooting Registration Errors

### Error: "Firebase: Error (auth/configuration-not-found)"

**Solution:** Your `.env.local` is missing Firebase credentials.

```bash
# Make sure you have:
1. Created a Firebase project
2. Enabled Email/Password authentication
3. Copied your Firebase config to .env.local
4. Restarted the development server after editing .env.local

# Restart the server:
npm run dev -- -p 3000
```

### Error: "Port 9002 already in use"

**Solution:** Use a different port

```bash
npm run dev -- -p 3000
```

Then access at `http://localhost:3000`

### Error: "Permission denied" in Firestore

**Solution:** Firestore security rules need to allow registration in test mode. In test mode, all reads/writes are allowed. Make sure you're in "Start in test mode" when creating the database.

## Demo Workflows

### Workflow 1: Student Experience (15 minutes)

**Login as:** student@demo.local / demo12345

1. **View Dashboard:**
   - Go to `/dashboard/student`
   - See upcoming shifts and statistics

2. **Browse Available Shifts:**
   - Click "Browse Shifts" or go to `/shifts`
   - View all available clinical shifts
   - Click "Book Shift" on any shift

3. **Log Patient Encounters:**
   - Go to `/dashboard/student`
   - Click "View Encounters" or go to `/encounters`
   - Click "New Encounter"
   - Fill out the patient care form:
     - Select a shift (must be a booked shift)
     - Enter patient demographics
     - Add clinical assessment data
     - Add treatments and interventions
   - Save as draft and return to edit, or submit for instructor review

4. **View Feedback:**
   - Go to `/dashboard/student`
   - Scroll to "Recent Feedback"
   - Click on a shift to see instructor-provided feedback

### Workflow 2: Instructor Experience (20 minutes)

**Login as:** instructor@demo.local / demo12345

1. **Create a Shift:**
   - Go to `/shifts`
   - Click "Create Shift"
   - Fill in shift details:
     - **Title:** "Tuesday Evening Clinic"
     - **Date:** Select a future date
     - **Time:** 18:00 - 22:00
     - **Type:** Clinical
     - **Location:** Main Campus
     - **Capacity:** 5
     - **Notes:** (optional)
   - Click "Create Shift"

2. **View Enrolled Students:**
   - Go to `/shifts`
   - Click "View Details" on the shift you created
   - See list of students who booked the shift

3. **Review Student Encounters:**
   - On the shift detail page, click on a student's accordion
   - See all encounters they logged during this shift
   - Review individual encounter details
   - Click "View Full Encounter" to see complete patient care form

4. **Provide Shift Feedback:**
   - On the shift detail page, scroll to student feedback section
   - Fill out:
     - **Overall Feedback** (required) - comment on student's performance
     - **Performance Rating** - select from dropdown
     - **Areas of Strength** - highlight what student did well
     - **Areas for Improvement** - constructive feedback
   - Click "Save Shift Feedback"

5. **View Your Dashboard:**
   - Go to `/dashboard/instructor`
   - See statistics:
     - Total shifts created
     - Upcoming shifts
     - Active students
     - Pending reviews
   - Quick access to manage shifts and provide feedback

### Workflow 3: Admin Experience (10 minutes)

**Login as:** admin@demo.local / demo12345

1. **User Management:**
   - Go to `/admin/users` or click "Admin Panel" in navbar
   - See all registered users with their:
     - Name and email
     - Role (Student/Instructor/Administrator)
     - Approval status
     - Join date

2. **Approve Instructors:**
   - Find a user with role "Instructor"
   - Click the "Approve" button if they're pending approval
   - User will now have full instructor access

3. **View User Details:**
   - Click on a user to see:
     - Account creation date
     - Last login
     - Role information
   - Return to main list with back button

## Testing Tips

### Creating Test Data Efficiently

1. **Create multiple students:** Register 2-3 student accounts to populate a shift
2. **Book shifts:** Log in as each student and book the same instructor shift
3. **Submit encounters:** As each student, log different patient encounters
4. **Test feedback flow:** As instructor, provide feedback and see it appear for students

### Testing Key Features

- **Authentication:** Register/login with different roles
- **Authorization:** Try accessing instructor pages as a student (should be blocked)
- **Data isolation:** Verify students only see their own encounters
- **Shift management:** Create, view, and manage shifts as instructor
- **Feedback workflow:** Submit encounters and receive instructor feedback
- **Mobile responsiveness:** Open the app on a phone/tablet

## Getting Firebase Credentials (Step-by-Step)

1. Open [Firebase Console](https://console.firebase.google.com)
2. Click on your project
3. Click ⚙️ (Settings) → "Project settings"
4. Scroll to "Your apps" section
5. Find or create your web app (click `</>` icon)
6. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

7. Use these values in your `.env.local`:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## Environment File Template

Create a `.env.local` file with (fill in your Firebase values):

```env
# Firebase Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Optional: AI-powered narrative assistance
GOOGLE_GENAI_API_KEY=your-google-ai-key

# Optional: Use Firebase Emulators instead of real Firebase
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

## Documentation Files

For more detailed information, see:

- **SETUP.md** - Installation and configuration
- **USER_GUIDE.md** - End-user documentation
- **DEPLOYMENT.md** - Production deployment
- **FIREBASE_SETUP_GUIDE.md** - Detailed Firebase setup
- **PROJECT_STATUS.md** - Feature implementation status

## Next Steps After Demo

1. **Explore the code** - Review `src/` directory to understand architecture
2. **Read documentation** - Check PROJECT_STATUS.md for what's implemented
3. **Customize** - Modify shifts, encounter form fields, or UI as needed
4. **Deploy** - Follow DEPLOYMENT.md to deploy to production
5. **Database setup** - Set up Firestore rules for production use

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review console logs (browser DevTools F12)
3. Check SETUP.md for common issues
4. Verify your Firebase credentials in `.env.local`
5. Make sure Firestore Database is in "test mode"

---

**Enjoy demoing the EMS Competency Tracker!** 🚑
