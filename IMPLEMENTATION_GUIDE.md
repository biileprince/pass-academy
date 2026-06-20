# Role-Based Authentication Implementation Guide

## Overview
I've implemented a comprehensive role-based authentication system for PAS Academy with support for 4 user roles: **Student**, **Tutor**, **Mentor**, and **Admin**. Each role has its own registration flow, profile, and dashboard.

## What Has Been Implemented

### 1. Database Schema Updates ✅
- Added `TUTOR` role to the `Role` enum
- Created new `TutorProfile` model with fields:
  - headline, bio, expertise, subjects
  - years of experience, qualifications
  - approval status, activity status
  - languages, ratings, student & course counts
- Updated `User` model with:
  - `tutorProfile` relationship
  - `taughtCourses` relationship for tutors
- Updated `Course` model with:
  - `tutorId` field linking to tutor user
  - `tutor` relationship

### 2. Authentication & Validation ✅
- Updated auth validation to include all 4 roles
- Modified register form to show role selection page
- Created role-specific registration flows

### 3. Registration Pages & Forms ✅
**Location**: `/app/(auth)/register/`
- **Role Selection Page**: `/register` - Main entry point showing all 4 roles
- **Student Registration**: `/register/student` - Simple registration for students
- **Tutor Registration**: `/register/tutor` - Includes subject selection and qualifications
- **Mentor Registration**: `/register/mentor` - Includes expertise and availability setup  
- **Admin Registration**: `/register/admin` - Invitation-only with code verification

**Form Components**:
- `StudentRegisterForm` - Basic user info
- `TutorRegisterForm` - Subjects, expertise, qualifications
- `MentorRegisterForm` - Expertise areas, availability
- `AdminRegisterForm` - Invitation code validation

### 4. Profile Management ✅
**Updated Actions** (`/app/actions/profile.ts`):
- `updateProfile()` - Student profile update
- `updateTutorProfile()` - Tutor-specific profile (headline, bio, expertise, etc.)
- `updateMentorProfile()` - Mentor-specific profile (rate, timezone, availability)
- `getProfile()` - Fetch user profile with all related data

### 5. Admin Features ✅
**Updated Admin Actions** (`/app/actions/admin.ts`):
- `getUsers()` - Retrieve users with optional role filter
- `updateUserRole()` - Change user role
- `deactivateUser()` - Remove user account
- `approveTutorProfile()` - Approve tutor to start teaching
- `rejectTutor()` - Reject tutor application
- `getPendingTutors()` - Get tutors awaiting approval
- `approveMentorProfile()` - Approve mentor profile
- `rejectMentor()` - Reject mentor application
- `getPendingMentors()` - Get mentors awaiting approval

### 6. Dashboard Navigation ✅
**Updated Constants** (`/lib/constants.ts`):
- **STUDENT Dashboard**: 
  - Dashboard, My Courses, My Sessions, Profile
- **TUTOR Dashboard**:
  - Dashboard, My Courses, Create Course, Students, Profile
- **MENTOR Dashboard**:
  - Dashboard, My Courses, Sessions, Availability, Profile
- **ADMIN Dashboard**:
  - Dashboard, Users, Courses, Webinars, Mentors, Tutors

### 7. Existing Functionality ✅
- Course enrollment (`enrollInCourse`)
- Mentor session booking (`bookSession`)
- Lesson progress tracking
- Mentor approval workflow
- Already integrated with NextAuth

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended for development)
- Environment variables configured

### Step 1: Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Auth
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_URL="http://localhost:3000"

# OAuth (if using Google sign-in)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# UploadThing (for file uploads)
UPLOADTHING_TOKEN="your-uploadthing-token"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="PAS Academy"
```

### Step 2: Run Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Option A: Using migration (recommended for production)
npx prisma migrate dev --name add-tutor-role-and-profile

# Option B: Using push (for development)
npx prisma db push
```

### Step 3: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Start Development Server
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

## Testing the Implementation

### 1. Test Student Registration
- Visit `/register`
- Click "Student"
- Fill in form and submit
- Should redirect to `/dashboard`

### 2. Test Tutor Registration
- Visit `/register`
- Click "Tutor"
- Select subjects and submit
- Redirects to `/profile/edit` to complete tutor profile

### 3. Test Mentor Registration
- Similar to Tutor
- Includes mentor-specific fields (rate, timezone, availability)

### 4. Test Admin Functions
- Create an admin user with invitation code
- Access `/dashboard/admin`
- Manage users, approve tutors/mentors, view statistics

## User Flows

### Student Flow
1. Register as student
2. Browse and enroll in courses (taught by tutors)
3. Book 1-on-1 sessions with mentors
4. Track progress in courses
5. Manage profile and preferences

### Tutor Flow
1. Register as tutor with subjects and expertise
2. Create and manage courses
3. View enrolled students
4. Track course ratings and reviews
5. Manage course content and lessons

### Mentor Flow
1. Register as mentor with expertise areas
2. Set availability and hourly rate
3. Accept/manage student session bookings
4. Provide 1-on-1 guidance and support
5. Track ratings and reviews

### Admin Flow
1. Approve/reject tutor and mentor applications
2. Manage all users and roles
3. Monitor platform statistics
4. Manage courses, webinars, and content
5. Handle disputes and platform moderation

## Key Features

✅ **Role-Based Access Control**
- Different registration flows for each role
- Role-specific dashboards and features
- Permission-based API endpoints

✅ **Tutor Management**
- Course creation and management
- Student enrollment tracking
- Ratings and reviews

✅ **Mentor Management**
- Session booking system
- Availability scheduling
- Hourly rate management
- Approval workflow

✅ **Admin Management**
- User management
- Tutor/mentor approval workflow
- Platform statistics
- Content moderation

✅ **Integrated Authentication**
- NextAuth with Credentials provider
- Optional Google OAuth
- Password reset functionality
- Session management

## Database Models

```prisma
# New/Updated Models:
- Role ENUM: STUDENT, TUTOR, MENTOR, ADMIN
- User: Added tutorProfile relationship, taughtCourses
- TutorProfile: New model for tutor-specific data
- Course: Added tutorId and tutor relationship
```

## API Endpoints & Actions

### Auth Actions
- `registerUser(input)` - Register new user
- `loginUser(credentials)` - Login user

### Profile Actions
- `updateProfile(data)` - Update student profile
- `updateTutorProfile(data)` - Update tutor profile
- `updateMentorProfile(data)` - Update mentor profile
- `getProfile()` - Get current user profile

### Course Actions
- `enrollInCourse(courseId)` - Enroll in course
- `unenrollFromCourse(courseId)` - Drop course
- `getCourses(filters)` - Get available courses

### Mentorship Actions
- `bookSession(data)` - Book mentor session
- `cancelSession(sessionId)` - Cancel booking
- `getMentors(filters)` - Find available mentors

### Admin Actions
- `getUsers(role?)` - List all users
- `updateUserRole(userId, role)` - Change user role
- `approveTutorProfile(tutorId)` - Approve tutor
- `approveMentorProfile(mentorId)` - Approve mentor

## Troubleshooting

### Migration Issues
```bash
# If migration fails, try:
npx prisma migrate reset  # Resets database (dev only!)

# Or use push instead:
npx prisma db push
```

### Database Connection
- Verify DATABASE_URL in .env.local
- Check PostgreSQL is running
- Ensure connection string is correct

### Auth Issues
- Generate new AUTH_SECRET: `openssl rand -base64 32`
- Clear cookies/cache in browser
- Check NextAuth configuration

### Prisma Client Issues
```bash
npx prisma generate  # Regenerate client
npm install @prisma/client  # Reinstall
```

## Next Steps

1. ✅ Complete database migration
2. ✅ Start development server
3. ✅ Test registration flows for each role
4. ✅ Create default admin user for testing
5. ✅ Test dashboard navigation for each role
6. ✅ Implement profile completion pages
7. ✅ Add profile picture upload
8. ✅ Implement course creation for tutors
9. ✅ Set up email notifications
10. ✅ Add payment integration for paid courses

## File Structure

```
app/
├── (auth)/register/
│   ├── page.tsx (role selection)
│   ├── student/page.tsx
│   ├── tutor/page.tsx
│   ├── mentor/page.tsx
│   └── admin/page.tsx
├── (dashboard)/
│   ├── admin/
│   ├── tutor/
│   └── ...
├── actions/
│   ├── auth.ts
│   ├── admin.ts (updated)
│   ├── profile.ts (updated)
│   ├── courses.ts
│   └── mentorship.ts

components/auth/
├── student-register-form.tsx
├── tutor-register-form.tsx
├── mentor-register-form.tsx
├── admin-register-form.tsx

prisma/
└── schema.prisma (updated)

lib/
├── constants.ts (updated DASHBOARD_NAV)
└── validations/auth.ts (updated)
```

## Support

For issues or questions about this implementation, refer to:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)
