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
- **Deployment:** Firebase Hosting

## Documentation

- **SETUP.md** - Installation and configuration guide
- **DEPLOYMENT.md** - Production deployment instructions
- **USER_GUIDE.md** - End-user documentation for implemented features
- **SUPABASE_SETUP_GUIDE.md** - Firebase project configuration
- **PROJECT_STATUS.md** - Detailed feature implementation status

## Getting Started

### Prerequisites
- Node.js v18 or later
- Firebase account
- Firebase CLI installed globally

### Quick Start
1. Follow **SETUP.md** for detailed installation steps
2. Create your own Firebase project (see **SUPABASE_SETUP_GUIDE.md**)
3. Configure environment variables
4. Deploy Firebase security rules
5. Start development server

### Important Notes
- You will need to create your own Firebase project
- All environment variables must be configured with your values
- This codebase is provided as-is at the point of development halt
- Some features may require additional implementation based on your needs

**Note:** This is a development halt handover. The system has substantial functionality implemented and working, but should be considered work-in-progress rather than a complete, production-ready system.
