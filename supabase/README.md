# Supabase Setup Guide

This guide will help you set up your Supabase database for the Character Chat App.

## Prerequisites
- A Supabase account (sign up at https://supabase.com)

## Step 1: Create a New Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: `character-chat-app` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
4. Click "Create new project"
5. Wait for the project to be set up (takes ~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the contents of `schema.sql` from this directory
4. Paste it into the SQL Editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see "Success. No rows returned" message

This creates:
- `profiles` table (user profiles)
- `characters` table (AI characters)
- `chat_sessions` table (chat conversations)
- `messages` table (individual messages)
- Row Level Security (RLS) policies
- Database indexes for performance

## Step 3: Seed Character Data

1. In the SQL Editor, create another new query
2. Copy the contents of `seed.sql` from this directory
3. Paste it into the SQL Editor
4. Click "Run" or press `Ctrl+Enter`

This populates the database with 5 predefined AI characters:
- Luna (Creative writer)
- Alex (Tech expert)
- Dr. Sage (Philosopher)
- Kai (Fitness coach)
- Echo (Scientist)

## Step 4: Configure Google OAuth

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Find "Google" in the list
3. Enable the Google provider
4. You have two options:

### Option A: Use Supabase's Google OAuth (Easiest)
- Just toggle "Enable Google provider"
- Supabase handles everything
- Good for development

### Option B: Use Your Own Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen if not done
6. Application type: "Web application"
7. Add authorized redirect URIs:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for local development)
   ```
8. Copy the Client ID and Client Secret
9. Paste them in Supabase's Google provider settings
10. Add your site URL and redirect URLs in Supabase:
    - Site URL: `http://localhost:3000` (for development)
    - Redirect URLs: `http://localhost:3000/chat`

## Step 5: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. You'll need these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
3. Copy these values to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
```

## Step 6: Verify Setup

You can verify your database is set up correctly by running the check script:

```bash
npm run db:check
```

This will:
- Connect to your Supabase database
- Check if all tables exist
- Verify character data was seeded
- Test authentication setup

## Troubleshooting

### Characters not showing up?
- Make sure you ran `seed.sql` after `schema.sql`
- Check the `characters` table in the Table Editor

### Authentication not working?
- Verify Google OAuth is enabled
- Check redirect URLs match your configuration
- Make sure your `.env.local` has the correct keys

### Connection errors?
- Double-check your `NEXT_PUBLIC_SUPABASE_URL`
- Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure your project is active in Supabase dashboard

## Database Structure

```
public
├── profiles (user accounts)
│   ├── id (UUID, primary key)
│   ├── email
│   ├── full_name
│   ├── avatar_url
│   └── timestamps
│
├── characters (AI personalities)
│   ├── id (UUID, primary key)
│   ├── name
│   ├── avatar_url
│   ├── description
│   ├── personality
│   ├── system_prompt
│   └── conversation_style
│
├── chat_sessions (conversations)
│   ├── id (UUID, primary key)
│   ├── user_id (foreign key → profiles)
│   ├── character_id (foreign key → characters)
│   ├── title
│   └── timestamps
│
└── messages (chat messages)
    ├── id (UUID, primary key)
    ├── chat_session_id (foreign key → chat_sessions)
    ├── role ('user' | 'assistant')
    ├── content
    └── created_at
```

## Security

All tables have Row Level Security (RLS) enabled:
- Users can only see their own profiles, chat sessions, and messages
- Characters are read-only and visible to all authenticated users
- Server-side operations use the service role key (keep it secret!)

## Next Steps

After completing this setup:
1. ✅ Update your `.env.local` with Supabase credentials
2. ✅ Add your Groq API key to `.env.local`
3. ✅ Run `npm run dev` to start the development server
4. ✅ Test Google login at `http://localhost:3000`

Happy coding! 🚀

