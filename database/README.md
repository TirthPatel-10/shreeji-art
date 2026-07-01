# Database — Shreeji Art

## Setup (Supabase)

1. Create a project at https://supabase.com
2. Go to **SQL Editor** in the Supabase dashboard
3. Paste and run `schema.sql` — it creates all tables, indexes, and seed data
4. Go to **Settings → Database → Connection string** and copy the **Transaction** pooler URI
5. Set it as `DB_URL` in your Railway environment variables (for the backend)

## Connection String Format

```
jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Use the **Transaction** mode pooler (port `6543`) for Railway deployments — not the direct connection (port `5432`) — to avoid exhausting the connection pool.

## Tables

| Table              | Purpose                                    |
|--------------------|--------------------------------------------|
| users              | Core auth — admins and customers           |
| customers          | Extended customer profile (linked to users)|
| leads              | Incoming enquiries from public forms       |
| services           | Signage service catalog                    |
| portfolio_items    | Completed project showcase                 |
| gallery_items      | Image gallery                              |
| quotes             | Formal quotations                          |
| quote_items        | Line items within a quote                  |
| projects           | Active work orders                         |
| blog_posts         | Blog articles                              |
| testimonials       | Customer reviews                           |
| contact_requests   | Contact form submissions                   |
| site_settings      | Key-value website configuration            |

## Schema Changes

When you need to alter the schema after initial deployment:

1. Write a new SQL migration file (`migration_002_add_column.sql`)
2. Run it in the Supabase SQL Editor
3. Update the JPA entity class to match
4. Change `spring.jpa.hibernate.ddl-auto` to `validate` in production (already set)

**Never** rely on `ddl-auto: create-drop` or `update` in production — use explicit migrations.

## Backup

Supabase provides automatic daily backups on paid plans. For the free tier, export manually via:
```
pg_dump -h db.<ref>.supabase.co -U postgres -d postgres > backup.sql
```
