# 🛡️ Authentication Flow

This app uses a secure two-step authentication flow for admin
access, leveraging Supabase Auth with custom logic to protect
sensitive food bank data.

---

## The Two-Login Flow

**First Login: Magic Link**

- User navigates to `/admin/magic` (unguarded route)
- Requests a magic link to their email
- Clicks the magic link in their inbox
- Supabase creates a session (first login)
- App verifies admin status via
  `ensureAuthenticatedSessionAction`
- Immediate forced sign-out: Magic link session is destroyed
- User lands on the main login page, identity verified but not
  logged in

**Second Login: Password**

- User enters email and password in the login form
- A persistent app session is created via `useSessionStore`
- User is now authenticated and can access protected data

---

## Security Rationale

- **Two-factor by design:** Magic link = identity ticket,
  Password = access key
- **Mitigates intercepted links:** Even if the magic link is
  intercepted, it cannot be reused—password is always required
- **Immediate signout:** Magic link sessions are destroyed after
  identity verification, closing the loop for session hijacks
- **Sensitive data remains secure:** Both identity factors are
  required to access food bank recipient data

---

## Password Reset Sub-Flow

If user forgets their password at login:

- Login form toggles in place to a password reset form (no page
  reload)
- User requests password reset link
- User clicks the reset link, lands on updateRecipients password
  page
- After updating password, user is redirected to login page
- User can now log in with the new password

---

**Summary:**  
This architecture provides strong defense against unauthorized
access—combining the convenience of magic links with the security
of password-based authentication, purpose-built for protecting
sensitive nonprofit data.
