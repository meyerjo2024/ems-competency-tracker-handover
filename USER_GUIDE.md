# EMS Competency Tracker - User Guide

**Last Updated:** January 26, 2026  
**Audience:** Students, Instructors, Administrators

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Student Guide](#student-guide)
4. [Instructor Guide](#instructor-guide)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Introduction

### What is the EMS Competency Tracker?

The EMS Competency Tracker is a web-based application designed to help EMS students log patient encounters during clinical shifts and receive feedback from instructors. It streamlines the process of tracking clinical experience and competency development.

### Key Features

**For Students:**
- View and book available clinical shifts
- Log patient encounters with detailed assessments
- Track completed encounters and view feedback
- Monitor shift attendance and submission status

**For Instructors:**
- Create and manage clinical shifts
- Review student encounters
- Provide shift-level and encounter-level feedback
- Track student progress and performance

### System Requirements

- **Web Browser:** Chrome, Firefox, Safari, or Edge (latest version)
- **Internet Connection:** Required
- **Device:** Desktop, laptop, tablet, or smartphone
- **Account:** Valid student or instructor account

---

## Getting Started

### Creating an Account

1. Navigate to the registration page: `/register`
2. Fill in the required information:
   - **Full Name:** Your first and last name
   - **Email:** Your institutional or personal email
   - **Password:** At least 6 characters (recommended: mix of letters, numbers, symbols)
   - **Confirm Password:** Re-enter your password
   - **Role:** Select **Student** or **Instructor**
3. Click **"Register"**
4. You'll be redirected to the login page
5. Check your email for verification (if enabled)

### Logging In

1. Navigate to the login page: `/login`
2. Enter your **email** and **password**
3. Click **"Sign In"**
4. You'll be redirected to your role-specific dashboard

### First-Time Login

After your first login:
1. You'll see a dashboard tailored to your role
2. Explore the navigation menu to familiarize yourself with available features
3. Update your profile information if needed

---

## Student Guide

### Dashboard Overview

Your student dashboard (`/dashboard/student`) shows:

- **Quick Stats:**
  - Total Encounters: Number of encounters you've logged
  - Submitted Encounters: Encounters awaiting or reviewed
  - Draft Encounters: Incomplete encounters
  - Shifts Booked: Upcoming shifts you're registered for

- **My Encounters (Recent):**
  - List of your most recent encounters
  - Click "View All" to see complete list

- **Upcoming Shifts:**
  - Shifts you've booked
  - Shift dates, times, locations
  - Quick access to log encounters

### Viewing Available Shifts

**Path:** `/shifts`

1. Click **"My Shifts"** in the navigation menu
2. Scroll to the **"Available Shifts"** section
3. Each shift card shows:
   - **Type:** Lab, Clinical, or Field
   - **Date & Time**
   - **Location**
   - **Instructor Name**
   - **Available Spots:** e.g., "3/10 spots booked"

### Booking a Shift

1. In the **"Available Shifts"** section, find a shift you want to attend
2. Click **"Book Shift"**
3. Confirm the booking in the dialog
4. Success! The shift moves to your **"My Bookings"** section

**Note:** You can only book shifts with available spots.

### Canceling a Booking

1. In the **"My Bookings"** section, find the shift you want to cancel
2. Click **"Cancel Booking"**
3. Confirm the cancellation
4. The shift returns to **"Available Shifts"**

**Important:** Cancel at least 24 hours in advance when possible.

### Logging an Encounter

#### Starting a New Encounter

**Option 1: From Shifts Page**
1. Go to **"My Bookings"** on `/shifts`
2. Find the shift you attended
3. Click **"Log Encounter"**
4. You'll be taken to the patient care form with the shift pre-selected

**Option 2: From Dashboard**
1. Click **"Log Encounter"** in the navigation menu
2. You'll see the shift selector
3. Choose the shift from the dropdown
4. Click **"Select Shift"**

#### Filling Out the Patient Care Form

The form has multiple tabs:

**1. Patient Info Tab**
- Patient demographics (age, sex)
- Chief complaint and history
- Time and location information

**2. Assessment Tab**
- SAMPLE History (Signs/Symptoms, Allergies, Medications, etc.)
- Primary Impression (condition/diagnosis)
- Differential diagnoses

**3. Vitals & Interventions Tab**
- Initial and subsequent vital signs
- Interventions performed (medications, procedures)
- Patient response

**4. Obstetrics/Neonatal Tab** (if applicable)
- Maternal assessment
- Delivery information
- Neonatal assessment

**5. Narrative Tab**
- Detailed case narrative
- Skills performed
- AI-assisted narrative suggestions

#### Saving as Draft

1. Fill in at least the required fields
2. Click **"Save as Draft"** at the bottom
3. Your progress is saved
4. You can return later to complete it

#### Submitting an Encounter

1. Complete all required fields (marked with *)
2. Review your entries for accuracy
3. Click **"Submit Report"**
4. Confirm submission
5. Encounter is submitted and awaits instructor review

**Note:** Once submitted, you cannot edit the encounter. Make sure all information is accurate before submitting.

### Viewing Your Encounters

**Path:** `/encounters`

1. Click **"My Encounters"** in the navigation menu
2. You'll see a list of all your logged encounters
3. Each encounter card shows:
   - **Shift Information:** Date, type, location
   - **Patient Info:** Age, sex, chief complaint
   - **Primary Impression**
   - **Status:** Draft or Submitted
   - **Date Logged**
   - **Instructor Feedback:** (if provided)

4. Click on any encounter to view full details

### Submitting a Shift for Review

After attending a shift and logging all your encounters:

1. Go to **"My Bookings"** on `/shifts`
2. Find the shift you attended
3. Click **"Submit Shift for Review"**
4. Instructor will be notified to review your shift

**Note:** You should log all encounters before submitting the shift for review.

### Viewing Instructor Feedback

**Shift-Level Feedback:**
1. Go to **"My Bookings"** on `/shifts`
2. Shifts with feedback show a **"Reviewed"** badge
3. Click **"View Feedback"** to see instructor's comments

**Encounter-Level Feedback:**
1. Go to **"My Encounters"**
2. Encounters with feedback show a **"Reviewed"** badge
3. Click on the encounter to view feedback

Feedback includes:
- **Overall Performance Rating:** Excellent, Good, Satisfactory, Needs Improvement
- **Strengths:** What you did well
- **Areas for Improvement:** What to work on
- **Additional Comments:** Specific guidance

---

## Instructor Guide

### Dashboard Overview

Your instructor dashboard (`/dashboard/instructor`) shows:

- **Quick Stats:**
  - Total Shifts: Shifts you've created
  - Upcoming Shifts: Shifts scheduled in the future
  - Pending Reviews: Students awaiting feedback

- **Quick Actions:**
  - **Create New Shift:** Add a new clinical opportunity
  - **Review Shifts:** See shifts with students to review
  - **View All Encounters:** Access all student encounters from your shifts

- **My Shifts (Upcoming):**
  - List of your next 5 shifts
  - Quick access to shift details and reviews

### Creating a Shift

**Path:** `/shifts` → "Create New Shift"

1. Click **"Create New Shift"** in the navigation menu or dashboard
2. Fill in the shift details:
   - **Type:** Lab, Clinical, or Field
   - **Date & Time:** When the shift takes place
   - **Location:** Where students should report
   - **Capacity:** Maximum number of students (e.g., 10)
   - **Notes:** Additional instructions or requirements

3. Click **"Create Shift"**
4. Shift is created and visible to students

### Managing Your Shifts

**Path:** `/shifts`

Your shifts page has three sections:

**1. Shifts Awaiting Review** (Priority)
- Highlighted in yellow
- Shows shifts where students have submitted for review
- **Badge:** Shows number of students pending
- **Action:** Click **"Review Now"**

**2. Upcoming Shifts with Students**
- Shifts with student bookings
- Shows date, location, number of students booked
- **Action:** Click **"View Details"**

**3. All My Shifts** (Collapsible)
- Complete list of all shifts you've created
- Sorted by date
- **Actions:** Edit, Delete, View

### Viewing Shift Details

**Path:** `/instructor/shifts/[shiftId]`

1. Click on any shift from your shifts page
2. You'll see:
   - **Shift Information:** Date, time, location, type, capacity
   - **Students Enrolled:** List of students who booked the shift
   - **Encounter Counts:** How many encounters each student logged
   - **Submission Status:** Awaiting Review, In Progress, Reviewed

### Providing Shift-Level Feedback (Per Student)

**Important:** Feedback is provided **per student**, not for the entire shift.

1. On the shift detail page, you'll see an **Accordion** with each student listed
2. Click on a student's name to expand their feedback form
3. Fill in the feedback form:
   - **Overall Feedback:** Required text describing the student's performance
   - **Performance Rating:** Excellent, Good, Satisfactory, Needs Improvement
   - **Strengths:** What the student did well
   - **Areas for Improvement:** What to work on
   - **Clinical Competence Rating:** 1-5 scale
   - **Professionalism Rating:** 1-5 scale
   - **Communication Rating:** 1-5 scale

4. Click **"Save Feedback"**
5. Feedback is saved and the student's booking status changes to **"Reviewed"**

**Tip:** You can save feedback and return later to update it. It's not final until you mark it as complete.

### Viewing Student Encounters

**Path:** `/instructor/encounters`

1. Click **"Review Center"** in the navigation menu
2. Select the shift you want to review from the dropdown
3. You'll see all encounters logged by students for that shift
4. Each encounter card shows:
   - **Student Name**
   - **Patient Info:** Age, sex, chief complaint
   - **Primary Impression**
   - **Date Logged**
   - **Review Status**

5. Click **"Review"** to provide encounter-level feedback

### Providing Encounter-Level Feedback (Optional)

**Path:** `/instructor/encounters/[encounterId]`

1. Review the student's encounter details:
   - Patient assessment
   - Vitals and interventions
   - Narrative

2. Scroll to the **"Instructor Feedback"** section at the bottom
3. Provide optional feedback:
   - **Feedback Comments:** Specific observations or guidance
   - **Skills Rating:** How well skills were performed
   - **Documentation Quality:** How well the encounter was documented

4. Click **"Save Feedback"**
5. Feedback is saved and visible to the student

**Note:** Encounter-level feedback is **optional**. Shift-level feedback is **required**.

### Editing a Shift

1. Go to `/shifts`
2. In the **"All My Shifts"** section, find the shift
3. Click **"Edit"**
4. Modify the shift details
5. Click **"Update Shift"**
6. Changes are saved

**Note:** Be careful editing shifts with student bookings. Notify students of changes.

### Deleting a Shift

1. Go to `/shifts`
2. In the **"All My Shifts"** section, find the shift
3. Click **"Delete"**
4. Confirm deletion
5. Shift is removed

**Important:** You cannot delete shifts with student bookings. Cancel bookings first or notify students.

---

## Common Tasks

### Updating Your Profile

1. Click your name in the top-right corner
2. Select **"Profile"** from the dropdown
3. Update your information:
   - Full Name
   - Email (read-only)
   - Role (read-only)
4. Click **"Update Profile"**
5. Changes are saved

### Changing Your Password

1. Go to your profile page
2. Scroll to the **"Change Password"** section
3. Enter your current password
4. Enter your new password
5. Confirm your new password
6. Click **"Change Password"**
7. Password updated

### Forgot Password

1. On the login page, click **"Forgot Password?"**
2. Enter your email address
3. Click **"Send Reset Link"**
4. Check your email for a password reset link
5. Click the link and follow instructions to reset your password

### Logging Out

1. Click your name in the top-right corner
2. Select **"Sign Out"** from the dropdown
3. You're logged out and redirected to the login page

---

## Troubleshooting

### Can't Log In

**Problem:** "Invalid email or password" error

**Solutions:**
1. Check your email and password for typos
2. Ensure Caps Lock is off
3. Try the **"Forgot Password"** link to reset
4. Contact your administrator if the issue persists

---

### Shift Not Showing Up

**Problem:** Can't find a shift I know exists

**Solutions:**
1. Check if you're looking at the correct date range
2. Refresh the page (Ctrl+R or Cmd+R)
3. Check if the shift is fully booked
4. Ask the instructor if the shift is still available

---

### Can't Submit Encounter

**Problem:** "Submit Report" button disabled

**Solutions:**
1. Ensure all required fields (marked with *) are filled
2. Check that you've selected a shift
3. Verify your internet connection
4. Try saving as draft first, then submitting

---

### Feedback Not Visible

**Problem:** Can't see instructor feedback

**Solutions:**
1. Check if the shift/encounter has been reviewed (look for "Reviewed" badge)
2. Refresh the page
3. Ask your instructor if feedback has been provided
4. Check the correct shift/encounter

---

### Page Loads Slowly

**Problem:** Application is slow or unresponsive

**Solutions:**
1. Check your internet connection
2. Clear browser cache and cookies
3. Close other browser tabs
4. Try a different browser
5. Check if the server is under maintenance

---

## FAQ

### General Questions

**Q: What browsers are supported?**  
**A:** Chrome, Firefox, Safari, and Edge (latest versions). Chrome is recommended for best performance.

**Q: Can I use this on my phone?**  
**A:** Yes! The application is mobile-responsive and works on smartphones and tablets.

**Q: Is my data secure?**  
**A:** Yes. All data is encrypted in transit and at rest. Firestore security rules ensure students can only access their own data, and instructors can only access data from their shifts.

**Q: Can I use this offline?**  
**A:** No. An internet connection is required to use the application.

---

### Student Questions

**Q: How many shifts can I book?**  
**A:** There's no hard limit, but be realistic about your availability. Don't book more shifts than you can attend.

**Q: Can I edit a submitted encounter?**  
**A:** No. Once submitted, encounters are locked to maintain data integrity. Double-check all information before submitting.

**Q: When should I submit a shift for review?**  
**A:** After you've logged all encounters from that shift and are ready for instructor feedback.

**Q: How long does it take to get feedback?**  
**A:** It depends on your instructor's schedule. Typically, feedback is provided within 3-5 business days.

**Q: Can I delete an encounter?**  
**A:** You can delete **draft** encounters. Once submitted, only administrators can delete them.

---

### Instructor Questions

**Q: Can I assign shifts to specific students?**  
**A:** Currently, students self-select shifts on a first-come, first-served basis. This feature may be added in future updates.

**Q: Can I see all my students' progress?**  
**A:** You can see progress for students enrolled in your shifts. A comprehensive student dashboard may be added in future updates.

**Q: What's the difference between shift-level and encounter-level feedback?**  
**A:** 
- **Shift-level feedback (required):** Overall performance assessment for the entire shift experience
- **Encounter-level feedback (optional):** Specific feedback on individual patient encounters

**Q: Can I edit feedback after submitting?**  
**A:** Yes. You can update feedback at any time by returning to the shift detail page.

**Q: How do I know if students have submitted shifts for review?**  
**A:** Your dashboard shows "Pending Reviews" count, and the shifts page highlights shifts awaiting review in yellow.

---

## Support & Contact

**For Technical Issues:**
- Check this user guide first
- Try the troubleshooting section
- Contact your system administrator

**For Account Issues:**
- Contact your program administrator
- Email: [administrator email]

**For Feature Requests or Bugs:**
- Document the issue (screenshots help!)
- Report to your system administrator
- Include: What you were trying to do, what happened, what you expected

---

## Tips for Success

**For Students:**
1. Log encounters immediately after the shift while details are fresh
2. Fill in all fields thoroughly - good documentation skills are essential
3. Review feedback carefully and apply it to future encounters
4. Book shifts early - popular times fill up quickly
5. Use the draft feature to save progress if you're interrupted

**For Instructors:**
1. Create shifts well in advance to give students time to book
2. Provide specific, actionable feedback
3. Review encounters promptly to keep students engaged
4. Balance constructive criticism with positive reinforcement
5. Use the priority system (shifts awaiting review) to stay organized

---



