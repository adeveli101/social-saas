# Social SaaS - Modern Social Media Management Platform

A comprehensive SaaS platform for managing social media accounts, scheduling posts, and analyzing performance. Built with Next.js 15, TypeScript, Tailwind CSS, Clerk for authentication, and Supabase for database.

## 🚀 Features

- **Authentication**: Secure user authentication with Clerk
- **Paywall System**: Subscription-based access control with plan management
- **Social Media Management**: Connect and manage multiple social media accounts
- **Post Scheduling**: Schedule posts across different platforms
- **Analytics**: Track performance and engagement metrics
- **Responsive Design**: Modern, mobile-first UI with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/UI components
- **Authentication**: Clerk (latest version)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Clerk account
- Supabase account

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd social-saas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory using the `env.example` as a template:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase Database

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key to the environment variables

### 5. Set up Clerk

1. Create a new Clerk application
2. Configure your sign-in and sign-up URLs to match your environment variables
3. Copy your publishable and secret keys to the environment variables

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── pricing/           # Pricing page
│   ├── sign-in/           # Sign-in page (Clerk)
│   ├── sign-up/           # Sign-up page (Clerk)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with ClerkProvider
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard_page/   # Dashboard-specific components
│   ├── landing_page/     # Landing page components
│   ├── paywall/          # Paywall and pricing components
│   └── ui/               # Shadcn/UI components
├── lib/                  # Utility functions and configurations
│   ├── clerk.ts          # Clerk configuration and helpers
│   ├── supabase.ts       # Supabase client and database types
│   └── utils.ts          # Utility functions
└── middleware.ts         # Clerk middleware
```

## 🔐 Authentication Flow

1. **User Registration**: Users sign up through Clerk's built-in components
2. **Database Sync**: User data is automatically synced to Supabase
3. **Plan Management**: User plans are stored in Supabase and synced with Clerk metadata
4. **Access Control**: Paywall guards control feature access based on subscription plans

## 💳 Subscription Plans

- **Free**: 3 social accounts, basic analytics, 5 scheduled posts/month
- **Pro ($29/month)**: Unlimited accounts, advanced analytics, unlimited posts
- **Business ($99/month)**: Everything in Pro + white-label reports, API access

## 🗄️ Database Schema

The application uses the following main tables:

- `users`: User profiles and subscription plans
- `social_accounts`: Connected social media accounts
- `posts`: Scheduled and published posts
- `analytics`: Performance metrics and engagement data

## 🔒 Security Features

- Row Level Security (RLS) policies in Supabase
- Clerk authentication with JWT tokens
- Protected API routes
- Paywall guards for feature access control

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

Stay updated with the latest features and improvements by:

1. Following the repository
2. Checking the releases page
3. Reading the changelog

---

Built with ❤️ using Next.js, Clerk, and Supabase
