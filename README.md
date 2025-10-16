# Character Chat App

A modern, mobile-first AI character chat application inspired by Character.AI, built to showcase UI/UX design, animation quality, and modern web development skills. This project was developed as a technical case study.

**[View Live Application](https://character-chat-app-virid.vercel.app/)** *(Deployed on Vercel)*

## ✨ Features

### 1. Authentication
- ✅ Google Sign-in via Supabase Auth
- ✅ Session management and persistence
- ✅ Protected routes with authentication middleware

### 2. Character System
- ✅ 5 predefined AI characters with unique personalities
- ✅ Each character includes: name, avatar, description, and conversation style
- ✅ Dedicated character selection page
- ✅ Character-specific system prompts and conversation styles

### 3. Chat Interface
- ✅ Mobile-first responsive design (320px+)
- ✅ 1-on-1 messaging with AI characters
- ✅ Real-time message synchronization via Supabase
- ✅ Complete message history
- ✅ AI streaming responses using Groq API (Llama 3.3)
- ✅ Touch-friendly interface (44px+ tap targets)

### 4. Chat History Screen
- ✅ Mobile-first design
- ✅ Real-time synchronization
- ✅ Continue previous conversations

### Component Consistency
- Reusable and modular component architecture
- Consistent spacing, typography, and color scheme
- Ant Design integration for complex UI elements


## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Ant Design
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Redux Toolkit

### Backend & Services
- **Authentication & Database**: Supabase
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
- **AI Integration**: Groq API (Llama 3.3)
- **Deployment**: Vercel

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Database Scripts**: tsx for TypeScript execution

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ installed
- A **Supabase** account ([Sign up](https://supabase.com))
- A **Groq API** account ([Sign up](https://console.groq.com))
- **Google OAuth** credentials (for authentication)


### 1. Clone the Repository

```bash
git clone https://github.com/isasumer/character-chat-app.git
cd character-chat-app
```

### 2. Install Dependencies

From the root directory:

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Navigate to the SQL Editor in your Supabase dashboard
3. Run the database schema:
   - Copy and execute the contents of `supabase/schema.sql`
4. Seed initial character data:
   - Copy and execute the contents of `supabase/seed.sql`
5. Configure Google OAuth:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URLs (e.g., `http://localhost:3000/chat` for local development)
6. Get your API keys from Settings → API

For detailed Supabase setup instructions, see [supabase/README.md](./supabase/README.md).

### 4. Set Up Groq API

1. Sign up at [Groq Console](https://console.groq.com)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key for the next step

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then add your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key

# Optional: For server-side operations
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important**: Never commit `.env.local` to version control. The file is already included in `.gitignore`.

### 6. Verify Database Setup (Optional)

Run the database verification script:

```bash
npm run db:check
```

This will verify that your characters are properly seeded in the database.

### 7. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
character-chat-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home/Login page
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # Chat API endpoint (streaming)
│   │   ├── characters/
│   │   │   └── page.tsx        # Character selection page
│   │   ├── chat/
│   │   │   ├── page.tsx        # Chat history list
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx    # Individual chat interface
│   │   ├── profile/
│   │   │   └── page.tsx        # User profile page
│   │   ├── components/         # Page-specific components
│   │   └── globals.css         # Global styles
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript type definitions
├── components/                 # Reusable UI components
│   ├── ui/                     # Base UI components
│   ├── providers/              # Context providers
│   ├── AppLayout.tsx           # Main app layout
│   ├── BottomNav.tsx           # Mobile bottom navigation
│   └── protected-route.tsx     # Route protection HOC
├── context/
│   └── AuthContext.tsx         # Authentication context
├── lib/                        # Utility functions & clients
│   ├── supabaseClient.ts       # Supabase client instance
│   ├── groqClient.ts           # Groq AI client instance
│   ├── antdTheme.ts            # Ant Design theme config
│   ├── utils.ts                # General utilities
│   └── helpers/                # Helper functions
│       ├── auth.ts             # Authentication helpers
│       ├── chat.ts             # Chat utilities
│       ├── stream.ts           # AI streaming helpers
│       └── message-handler.ts  # Message processing
├── store/                      # Redux store
│   ├── index.ts                # Store configuration
│   ├── hooks.ts                # Typed Redux hooks
│   └── services/
│       └── chatApi.ts          # RTK Query API
├── types/
│   └── database.ts             # Supabase database types
├── supabase/                   # Database setup files
│   ├── schema.sql              # Database schema
│   ├── seed.sql                # Initial character data
│   └── README.md               # Supabase setup guide
├── scripts/                    # Utility scripts
│   ├── seed.ts                 # Database seeding script
│   ├── check-db.ts             # Database verification
│   └── test-connection.ts      # Connection testing
├── constants/
│   └── index.ts                # App constants
└── public/                     # Static assets
```


## 🔑 Environment Variables

| Variable | Description | Required | Where to Get |
|----------|-------------|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes | Supabase Dashboard → Settings → API |
| `GROQ_API_KEY` | Groq API key for AI responses | Yes | [Groq Console](https://console.groq.com/keys) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side) | Optional | Supabase Dashboard → Settings → API |

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup instructions.


```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Database operations
npm run db:seed          # Seed database with characters
npm run db:check         # Verify database setup
npm run setup:verify     # Verify complete setup
```
