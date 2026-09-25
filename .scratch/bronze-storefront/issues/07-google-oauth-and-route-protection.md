# 07: Google OAuth & route protection

**What to build:** Add Google OAuth authentication as a clean security overlay across the storefront and admin portals without disrupting existing functionality. On mobile and desktop, customers and the admin can sign in via Google with a touch-friendly "Sign in with Google" button in the navigation header/drawer. Once signed in, a Customer sees their profile and a "My Orders" link (`/my/orders`) listing all Orders placed under their account, with an optional field to save their WhatsApp/contact phone number. When a user with an email listed in the `ADMIN_EMAILS` environment variable signs in, they are granted access to `/admin/*`. Non-admin users attempting to access `/admin` routes receive an unauthorized notice and are redirected. Sign-out clears the session cleanly. All previously-open mutations (admin CRUD, customer-scoped order history) are gated behind authenticated sessions.

**Blocked by:** 06: Store Snapshot disaster recovery & health check

**Status:** ready-for-agent

- [ ] NextAuth.js configured with Google OAuth provider
- [ ] User session persisted to `Customer` table upon first login (storing googleId, email, name, avatar)
- [ ] Responsive navigation shell updated: shows user avatar & "Sign Out" when logged in; "Sign In" button when guest
- [ ] Mobile-optimized user account menu / drawer with quick links to "My Orders"
- [ ] Customer dashboard (`/my/orders`) displaying only orders associated with the authenticated customer
- [ ] Route middleware protecting `/admin/*` routes: checks session email against `ADMIN_EMAILS` env var whitelist
- [ ] Non-admin access to `/admin` blocked with clear 403 / redirect to homepage
- [ ] Customer checkout flow automatically associates the placed order with the authenticated customer ID
- [ ] Verified Google OAuth login, session persistence, and sign-out on mobile viewport (375px/390px) and desktop
- [ ] Integration tests verifying admin route gating and customer order scoping
