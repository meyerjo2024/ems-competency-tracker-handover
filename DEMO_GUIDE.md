# Demo Guide - EMS Competency Tracker

This guide will help you set up and demo the EMS Competency Tracker application with test accounts.

## Quick Start (5-10 minutes)

### Prerequisites
- Node.js v18 or later installed
- Git installed
- A terminal/command line interface

### Step 1: Clone the Repository

```bash
git clone https://github.com/meyerjo2024/ems-competency-tracker-handover.git
cd ems-competency-tracker-handover
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment (Local Mode)

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:

```env
# Supabase Configuration (get these from your Supabase project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: AI features
GOOGLE_GENAI_API_KEY=your-api-key
```

**Don't have Supabase yet?** See **Option B: Using Firebase Emulators** below.

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:9002`

### Step 5: Create Test Accounts

#### Creating a Student Account

1. Go to `http://localhost:9002/register`
2. Fill in the form:
   - **Full Name:** `John Student`
   - **Email:** `student@demo.local`
   - **Password:** `demo12345`
   - **Confirm Password:** `demo12345`
   - **Role:** Select "Student"
3. Click **Register**

#### Creating an Instructor Account

1. Go to `http://localhost:9002/register`
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

2. Open your Supabase console or database management tool
3. Find the user record in the `users` table
4. Update the following columns:
   - `role` = `'Administrator'`
   - `approved` = `true`

## Demo Credentials Quick Reference

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Student | student@demo.local | demo12345 | View shifts, submit patient encounters |
| Instructor | instructor@demo.local | demo12345 | Create shifts, review student work |
| Administrator | admin@demo.local | demo12345 | Manage users, approve instructors |

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

## Troubleshooting

### Application won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 9002 already in use

Either:
1. Kill the process using port 9002, or
2. Change port in package.json: `"dev": "next dev -p 3000"`

### Environment variables not loading

1. Verify `.env.local` exists in project root (not in `src/`)
2. Restart dev server after editing `.env.local`
3. Check that variables start with `NEXT_PUBLIC_` for client-side access

### Type errors on startup

```bash
npm run typecheck
```

If errors persist, see TypeScript errors and fix the issues, then restart dev server.

### Authentication not working

1. Verify Supabase credentials in `.env.local`
2. Check Supabase project is accessible
3. Ensure row-level security (RLS) policies are enabled but allow registration
4. Check browser console for specific auth errors

## Environment File Template

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: AI-powered narrative assistance
GOOGLE_GENAI_API_KEY=your-google-ai-key

# Optional: Change development port
# Set in package.json "dev" script if needed
```

## Documentation Files

For more detailed information, see:

- **SETUP.md** - Installation and configuration
- **USER_GUIDE.md** - End-user documentation
- **DEPLOYMENT.md** - Production deployment
- **SUPABASE_SETUP_GUIDE.md** - Supabase project setup
- **PROJECT_STATUS.md** - Feature implementation status

## Next Steps After Demo

1. **Explore the code** - Review `src/` directory to understand architecture
2. **Read documentation** - Check PROJECT_STATUS.md for what's implemented
3. **Customize** - Modify shifts, encounter form fields, or UI as needed
4. **Deploy** - Follow DEPLOYMENT.md to deploy to production
5. **Database setup** - Set up PostgreSQL/Supabase for production use

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review console logs (browser DevTools F12)
3. Check SETUP.md for common issues
4. Review the specific documentation files listed above

---

**Enjoy demoing the EMS Competency Tracker!** 🚑
