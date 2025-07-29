# Authentication Temporarily Disabled

## Overview

The sign-in/sign-up functionality has been temporarily disabled to prevent users from accessing authentication features while maintenance is being performed.

## Changes Made

### 1. Navigation Bar (`components/NavBar/NavBar.tsx`)

- Added `AUTH_ENABLED = false` feature flag
- Wrapped authentication UI components with conditional rendering
- Sign-in and Sign-up buttons are now hidden from both desktop and mobile views

### 2. Middleware (`middleware.ts`)

- Added `AUTH_ENABLED = false` feature flag
- Extended protected routes to include `/my-garden(.*)` and `/my-garden/(.*)`
- Added redirect logic for disabled auth state
- Users trying to access protected routes are redirected to home page with message

### 3. API Routes

Updated the following API routes to use new auth utilities:

- `app/api/user-gardens/route.ts`
- `app/api/plant-tracking/route.ts`
- `app/api/garden-recommendations/route.ts`

### 4. Auth Utilities (`lib/auth-utils.ts`)

- Created centralized authentication utility functions
- `getUserId()` - Returns null when auth is disabled
- `handleUnauthorizedResponse()` - Returns 503 status for disabled features
- `isAuthenticated()` - Always returns false when auth is disabled

### 5. User Feedback (`components/FeatureUnavailableMessage.tsx`)

- Created notification component for disabled features
- Added to layout to show messages when users are redirected
- Auto-hides after 10 seconds

## How to Re-enable Authentication

### Quick Re-enable

To quickly re-enable authentication, change the following constants to `true`:

1. **NavBar**: `components/NavBar/NavBar.tsx`

   ```typescript
   const AUTH_ENABLED = true;
   ```

2. **Middleware**: `middleware.ts`

   ```typescript
   const AUTH_ENABLED = true;
   ```

3. **Auth Utils**: `lib/auth-utils.ts`
   ```typescript
   export const AUTH_ENABLED = true;
   ```

### Complete Re-enable

After changing the flags to `true`, you may also want to:

1. **Remove the notification component** from `app/layout.tsx` if no longer needed
2. **Update API routes** to remove the auth utility imports if you prefer the original auth pattern
3. **Test all authentication flows** to ensure everything works correctly

## Affected Features

### Currently Disabled

- Sign-in/Sign-up buttons in navigation
- User garden management (`/my-garden/*`)
- AI chat functionality (`/chat/*`)
- Plant tracking features
- Garden recommendations

### Still Available

- Plant database browsing
- Gardening tips
- Contact form
- About page
- All public content

## Notes

- The authentication system (Clerk) remains fully functional in the background
- No user data has been affected
- All authentication-related code is preserved and can be easily re-enabled
- The site remains fully functional for non-authenticated users

## Date Disabled

- **Date**: [Current Date]
- **Reason**: Temporary maintenance
- **Expected Duration**: [To be determined]
