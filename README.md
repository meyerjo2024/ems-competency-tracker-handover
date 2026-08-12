# EMS Competency Tracker

A modern web application for EMS training programs to manage clinical shifts, track student encounters, and monitor competency development.

## Project Status

**Development Status:** Halted - Partial Implementation  
**Last Updated:** January 26, 2026  

This project represents work completed up to the point of development halt. The system has core functionality implemented and working, but is not feature-complete.

## Implemented & Working Features

### Student Features
- User registration and authentication
- Shift browsing and booking
- Patient encounter logging with comprehensive form
- Draft and submit encounter workflow
- View personal encounters list
- View instructor feedback

### Instructor Features
- Shift creation and management
- View booked students per shift
- Review student encounters
- Provide per-student shift-level feedback (required)
- Provide optional encounter-level feedback
- Priority-based review workflow

### Admin Features
- User management panel
- Instructor approval workflow
- System-wide user overview

### Technical Features
- Role-based access control (Student/Instructor/Admin)
- Firebase Authentication integration
- Firestore database with security rules
- AI-powered narrative assistance (Google Genkit)
- Responsive design (mobile-friendly)

## Known Limitations & Incomplete Features

- Skills tracking dashboard (planned but not implemented)
- Advanced reporting and analytics
- Bulk data import/export
- Email notifications
- Advanced search and filtering
- Some UI polish and refinements

## Technology Stack

- **Frontend:** Next.js 15 with TypeScript
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **UI Framework:** Tailwind CSS + Shadcn UI
- **AI Integration:** Google Genkit (Gemini 2.0 Flash)
- **Deployment:** Vercel-ready

## Documentation

- **SETUP.md** - Installation and configuration guide
- **DEPLOYMENT.md** - Production deployment instructions
- **USER_GUIDE.md** - End-user documentation for implemented features
- **FIREBASE_SETUP_GUIDE.md** - Firebase project configuration
- **PROJECT_STATUS.md** - Detailed feature implementation status

## Getting Started

### Prerequisites
- Node.js v18 or later
- Firebase account
- Firebase CLI installed globally

### Quick Start
1. Follow **SETUP.md** for detailed installation steps
2. Create your own Firebase project (see **FIREBASE_SETUP_GUIDE.md**)
3. Configure environment variables
4. Deploy Firebase security rules
5. Start development server

## Docker Usage

1. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   ```
2. Build and run as a single container:
   ```bash
   docker build -t ems-competency-tracker:latest .
   docker run --rm -p 3000:3000 --env-file .env ems-competency-tracker:latest
   ```
3. Use Docker Compose (production-like local orchestration):
   ```bash
   docker compose up -d --build
   docker compose down
   ```
   By default Compose serves on port `3000` (set `HOST_PORT` in `.env` to change the host-side port).
4. Export image and run on another host:
   ```bash
   docker save ems-competency-tracker:latest -o ems-competency-tracker.tar
   # transfer tar file to target host
   docker load -i ems-competency-tracker.tar
   docker run --rm -p 3000:3000 --env-file .env ems-competency-tracker:latest
   ```

### First-run note
- This app uses Firebase (not a local SQL database). Ensure your Firebase project is created and all required env vars are set before first run.
- Deploy Firestore rules/indexes at least once before production use:
  ```bash
  firebase deploy --only firestore:rules,firestore:indexes
  ```

### Important Notes
- You will need to create your own Firebase project
- All environment variables must be configured with your values
- This codebase is provided as-is at the point of development halt
- Some features may require additional implementation based on your needs

**Note:** This is a development halt handover. The system has substantial functionality implemented and working, but should be considered work-in-progress rather than a complete, production-ready system.
