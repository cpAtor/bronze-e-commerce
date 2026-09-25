# Google OAuth for Both Admin and Customer Authentication

Both Admin and Customer authenticate via Google OAuth (NextAuth.js). Admin is distinguished by an `ADMIN_EMAILS` environment variable whitelist. Phone number collection and SMS/WhatsApp OTP verification are deferred to a future iteration — for now, Customers optionally provide a phone number in their profile for WhatsApp/SMS follow-up, but it is not used for authentication.

## Considered Options

- **SMS OTP as primary Customer login**: Rejected because no provider offers a permanently free SMS tier; even the cheapest (MSG91 at ~₹0.20/OTP) adds recurring cost and requires DLT registration with Indian telecoms.
- **Google OAuth + one-time WhatsApp OTP phone verification**: A strong hybrid, deferred to a future iteration to keep the initial build simple and ₹0/month.
- **Phone + password (no OTP)**: Rejected because Indian users expect passwordless flows, and it adds password-reset maintenance.
