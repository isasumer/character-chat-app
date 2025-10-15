# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these from your Supabase project settings (https://app.supabase.com)
# Settings → API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Only needed for server-side operations
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Groq API Configuration
# Get your API key from https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here
```

## Setup Instructions:

### 1. Supabase Setup:
1. Go to https://app.supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy the Project URL and anon/public key
5. Run the SQL schema: `supabase/schema.sql`
6. Run the seed data: `supabase/seed.sql`
7. Enable Google OAuth in Authentication → Providers
   - Add your redirect URLs (e.g., http://localhost:3000/chat)

### 2. Groq API Setup:
1. Go to https://console.groq.com
2. Create an API key
3. Copy and paste it in your .env.local

### 3. Security:
- Never commit `.env.local` to git!
- The file is already in `.gitignore`

