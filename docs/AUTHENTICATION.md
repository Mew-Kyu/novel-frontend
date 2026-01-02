# Authentication & Authorization Guide

This document explains how to use authentication and role-based access control in the Novel Frontend application.

## Components

### RequireAuth

Conditionally renders content only for authenticated users.

**Usage:**

```tsx
import { RequireAuth } from "@/components/auth";

// Simple usage
<RequireAuth>
  <button>Upload Story</button>
</RequireAuth>

// With fallback
<RequireAuth fallback={<button>Login to Upload</button>}>
  <button>Upload Story</button>
</RequireAuth>
```

### RequireRole

Conditionally renders content based on user roles.

**Usage:**

```tsx
import { RequireRole } from "@/components/auth";

// Single role
<RequireRole roles="ADMIN">
  <button>Delete User</button>
</RequireRole>

// Multiple roles (user needs ANY of these roles)
<RequireRole roles={["ADMIN", "MODERATOR"]}>
  <button>Manage Stories</button>
</RequireRole>

// Multiple roles (user needs ALL of these roles)
<RequireRole roles={["ADMIN", "SUPER_ADMIN"]} requireAll>
  <button>System Settings</button>
</RequireRole>

// With fallback
<RequireRole roles="ADMIN" fallback={<p>Admin access required</p>}>
  <AdminPanel />
</RequireRole>
```

## Auth Store Functions

### hasRole(role: string)

Check if the current user has a specific role.

```tsx
import { useAuthStore } from "@/lib/store/authStore";

function MyComponent() {
  const { hasRole } = useAuthStore();

  if (hasRole("ADMIN")) {
    // Show admin features
  }
}
```

### isAuthenticated

Check if user is logged in.

```tsx
import { useAuthStore } from "@/lib/store/authStore";

function MyComponent() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // Show user-specific content
  }
}
```

## Auto Logout on Auth Errors

The application automatically logs out users when:

- 401 Unauthorized response
- 403 Forbidden response

This happens globally via axios interceptor configured in:

- `lib/generated-api/index.ts`
- `lib/contexts/AuthProvider.tsx`

When logout occurs:

1. User receives toast notification: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
2. Auth token is cleared
3. User is redirected to `/login`

## Page Protection

### Protected Auth Pages

Login, register, forgot-password, and reset-password pages automatically redirect authenticated users to home page.

### Protected Admin Pages

Dashboard pages check for ADMIN or MODERATOR roles in `app/(admin)/dashboard/layout.tsx`:

```tsx
useEffect(() => {
  if (!user || (!hasRole("ADMIN") && !hasRole("MODERATOR"))) {
    router.push("/");
  }
}, [user, hasRole, router]);
```

## Examples

### Navbar Menu Items

```tsx
// Show only for authenticated users
{
  isAuthenticated && <Link href="/library/favorites">My Library</Link>;
}

// Show only for ADMIN or MODERATOR
{
  (hasRole("ADMIN") || hasRole("MODERATOR")) && (
    <Link href="/dashboard">Dashboard</Link>
  );
}

// Show only for ADMIN
{
  hasRole("ADMIN") && <Link href="/dashboard/users">Manage Users</Link>;
}
```

### Component with Role-based Features

```tsx
import { RequireAuth, RequireRole } from "@/components/auth";

function StoryPage() {
  return (
    <div>
      <h1>Story Title</h1>

      {/* Anyone can see */}
      <p>Story content...</p>

      {/* Only authenticated users can see */}
      <RequireAuth>
        <button>Add to Favorites</button>
      </RequireAuth>

      {/* Only ADMIN or MODERATOR can see */}
      <RequireRole roles={["ADMIN", "MODERATOR"]}>
        <button>Edit Story</button>
      </RequireRole>

      {/* Only ADMIN can see */}
      <RequireRole roles="ADMIN">
        <button>Delete Story</button>
      </RequireRole>
    </div>
  );
}
```

## Available Roles

Based on the codebase, the following roles are used:

- `USER` - Regular user (default)
- `MODERATOR` - Can access dashboard and manage stories
- `ADMIN` - Full access to all features including user management

## Error Handling in Components

When making API calls that might fail with auth errors:

```tsx
try {
  const response = await apiClient.cloudinary.uploadImage(file);
  // Handle success
} catch (error: any) {
  // Check for auth errors
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    logout();
    router.push("/login");
  } else {
    // Handle other errors
    toast.error("An error occurred");
  }
}
```

Note: The global interceptor will also handle this, but you may want to provide specific error messages.
