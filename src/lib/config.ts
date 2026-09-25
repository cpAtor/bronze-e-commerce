/**
 * Central application configuration.
 * Reads environment variables with sensible defaults for local development.
 */

export const ADMIN_CONFIG = {
  phone: process.env.NEXT_PUBLIC_ADMIN_PHONE || process.env.ADMIN_PHONE || '+919876543210',
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'contact@heritagebronze.in',
  emailsWhitelist: (process.env.ADMIN_EMAILS || 'artisan@heritagebronze.in')
    .split(',')
    .map((e) => e.trim().toLowerCase()),
};
