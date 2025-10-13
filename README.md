# Character Chat App 🤖💬

A modern, mobile-first AI character chat application built with Next.js, Supabase, and Groq AI. Chat with unique AI personalities in a beautifully animated interface.

## ✨ Features

- 🎭 **Multiple AI Characters** - Chat with 5 unique AI personalities, each with distinct conversation styles
- 🔐 **Google Authentication** - Secure sign-in with Google OAuth via Supabase
- 💬 **Real-time Chat** - Seamless messaging with AI streaming responses
- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive layouts
- 🎨 **Smooth Animations** - Beautiful transitions and micro-interactions with Framer Motion
- 📜 **Chat History** - Access and continue previous conversations
- ⚡ **Fast Performance** - Built with Next.js 15 and optimized for speed

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication & Database**: Supabase
- **AI Integration**: Groq API (Llama 3.3)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account
- A Groq API account
- Google OAuth credentials (for authentication)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd character-chat-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Follow the instructions in [supabase/README.md](./supabase/README.md) to:
   - Run the database schema
   - Seed initial character data
   - Configure Google OAuth
3. Get your API keys from Settings → API

### 4. Set Up Groq API

1. Sign up at [Groq Console](https://console.groq.com)
2. Create an API key
3. Note down your API key

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Then fill in your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq API
GROQ_API_KEY=your_groq_api_key
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
character-chat-app/
├── src/
│   └── app/                    # Next.js app directory
│       ├── layout.tsx          # Root layout with AuthProvider
│       ├── page.tsx            # Home/Login page
│       ├── chat/               # Chat routes
│       │   ├── page.tsx        # Chat history list
│       │   └── [characterId]/  # Individual chat interface
│       └── globals.css         # Global styles
├── components/                 # Reusable UI components
├── context/                    # React contexts
│   └── AuthContext.tsx         # Authentication context
├── lib/                        # Utility functions
│   ├── supabaseClient.ts       # Supabase client
│   ├── groqClient.ts           # Groq AI client
│   └── utils.ts                # Helper functions
├── types/                      # TypeScript type definitions
│   └── database.ts             # Supabase database types
├── supabase/                   # Database setup files
│   ├── schema.sql              # Database schema
│   ├── seed.sql                # Initial data
│   └── README.md               # Setup instructions
└── public/                     # Static assets
```

## 🎭 Available Characters

1. **Luna** - Creative writer and poet
2. **Alex** - Friendly tech expert
3. **Dr. Sage** - Thoughtful philosopher
4. **Kai** - Energetic fitness coach
5. **Echo** - Curious scientist

Each character has a unique personality and conversation style!

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `GROQ_API_KEY` | Groq API key for AI responses | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side) | Optional |

## 📱 Page Routes

- `/` - Login page with Google authentication
- `/chat` - Chat history list
- `/chat/[characterId]` - Chat interface with specific character
- `/characters` - (Bonus) Character selection page

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

This app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/character-chat-app)

## 📝 Key Features Implementation

### Authentication
- Google OAuth via Supabase Auth
- Session persistence and management
- Protected routes with authentication middleware

### Real-time Chat
- Supabase real-time subscriptions for instant updates
- Streaming AI responses from Groq
- Optimistic UI updates

### Mobile-First Design
- Touch-friendly interface (44px+ tap targets)
- Responsive layouts (320px+)
- Bottom navigation for easy access
- Swipe gestures support

### Animations
- Page transitions with Framer Motion
- Message enter/exit animations
- Loading states and skeleton screens
- Micro-interactions on all interactive elements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built as part of a coding challenge to showcase modern web development skills
- Character avatars generated by [DiceBear](https://dicebear.com)
- AI powered by [Groq](https://groq.com)

---

Built with ❤️ using Next.js, Supabase, and Groq
