-- ================================================================
-- Admin User Creation — Shreeji Art
-- ================================================================
-- This file contains instructions only. Do NOT run it as-is.
-- Never insert a plain-text password into the database.
-- ================================================================


-- ================================================================
-- PREFERRED: Backend bootstrap (recommended)
-- ================================================================
-- Set these three environment variables on your Railway backend
-- service, then trigger a redeploy:
--
--   ADMIN_BOOTSTRAP_ENABLED = true
--   ADMIN_EMAIL             = admin@yourdomain.com
--   ADMIN_PASSWORD          = <strong-password>
--
-- The backend will:
--   1. Read the env vars on startup
--   2. Hash the password with BCrypt (cost 10)
--   3. Insert the admin row if the email does not already exist
--   4. Skip silently if the account already exists
--   5. Log the outcome (email only — never the password)
--
-- After the account is created:
--   1. Set ADMIN_BOOTSTRAP_ENABLED = false
--   2. Remove ADMIN_PASSWORD from the environment
--   3. Redeploy
--
-- The admin account persists in the database and is not affected
-- by disabling the bootstrap runner.
-- ================================================================


-- ================================================================
-- FALLBACK: Manual insert (only if bootstrap is unavailable)
-- ================================================================
-- Step 1 — Generate a BCrypt hash for your chosen password.
--
-- Option A — htpasswd (Linux/macOS):
--   htpasswd -bnBC 10 "" your-password | tr -d ':\n' && echo
--
-- Option B — Python 3:
--   python3 -c "import bcrypt; print(bcrypt.hashpw(b'your-password', bcrypt.gensalt(10)).decode())"
--
-- Option C — Node.js:
--   node -e "const b=require('bcrypt'); b.hash('your-password',10).then(console.log)"
--
-- Step 2 — Replace the placeholder below with the generated hash.
-- Step 3 — Run in the Supabase SQL editor.
-- Step 4 — Delete this file from the editor immediately after.
--
-- Do NOT commit this file with real values.
-- ================================================================

/*
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES (
    'admin@yourdomain.com',   -- replace with the actual admin email
    '$2a$10$REPLACE_THIS_WITH_BCRYPT_HASH',   -- generated in Step 1 above
    'Admin',
    '',
    'ROLE_ADMIN',
    true
)
ON CONFLICT (email) DO NOTHING;
*/
