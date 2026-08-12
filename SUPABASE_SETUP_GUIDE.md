# Supabase Setup Guide - EMS Competency Tracker

## 1) Create Supabase Project

1. Create a new Supabase project.
2. Copy:
   - Project URL
   - anon public key

## 2) Configure Environment

Create `.env.local` from `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_GENAI_API_KEY=...
```

## 3) Apply Database Schema + RLS

Run this SQL in Supabase SQL Editor:

- `supabase/migrations/20260812132000_initial_schema.sql`

This creates:
- `users`
- `shifts`
- `shift_bookings`
- `encounters`
- `shift_feedback`

It also creates:
- role + booking status enums
- RLS policies
- booking RPC transaction functions

## 4) Enable Auth

In Supabase Auth settings:

1. Enable Email provider.
2. Enable email confirmations.
3. Configure Site URL / redirect URLs for your deployed app.

## 5) Verify App

```bash
npm install
npm run dev
```

Validate:
- registration
- login/logout
- password reset
- shift booking and cancellation
- encounter save/submit
- feedback workflows
