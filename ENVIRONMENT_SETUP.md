# 🔧 Environment Setup Guide

## 📋 Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# =============================================================================
# AI Generation System Environment Variables
# =============================================================================

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Queue System
QUEUE_PROCESSOR_SECRET=your-random-secret-key-here

# AI Services (Phase 2)
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_API_KEY=your-gemini-api-key

# System Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔑 How to Get These Values

### Supabase Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings > API**
4. Copy the following values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret**: `SUPABASE_SERVICE_ROLE_KEY`

### Clerk Authentication
1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Select your application
3. Go to **API Keys**
4. Copy the following values:
   - **Publishable Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key**: `CLERK_SECRET_KEY`

### Queue Processor Secret
Generate a secure random string:
```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# https://generate-secret.vercel.app/32
```

### AI Services (Phase 2)
1. **OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy to `OPENAI_API_KEY`

2. **Google AI API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy to `GOOGLE_AI_API_KEY`

## ✅ Verification Steps

After setting up your environment variables:

1. **Test Supabase Connection**:
   ```bash
   # Run this in your terminal
   curl -X GET "https://your-project-id.supabase.co/rest/v1/" \
     -H "apikey: your-anon-key" \
     -H "Authorization: Bearer your-anon-key"
   ```

2. **Test Clerk Authentication**:
   - Start your development server
   - Try to sign in/sign up
   - Check browser console for any auth errors

3. **Test Queue System**:
   ```bash
   # Test job processor API
   curl -X POST "http://localhost:3000/api/queue/process" \
     -H "Authorization: Bearer your-queue-processor-secret"
   ```

## 🚨 Security Notes

- **Never commit `.env.local` to version control**
- **Use different keys for development and production**
- **Rotate secrets regularly**
- **Use environment-specific configurations**

## 🔄 Production Deployment

For AWS Amplify deployment:

1. Go to your Amplify app dashboard
2. Navigate to **Environment variables**
3. Add all the required variables
4. Make sure to use production values (not development)

## 📊 Environment Variable Reference

| Variable | Required | Phase | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | 1 | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | 1 | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | 1 | Supabase service role key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | 1 | Clerk publishable key |
| `CLERK_SECRET_KEY` | ✅ | 1 | Clerk secret key |
| `QUEUE_PROCESSOR_SECRET` | ✅ | 1 | Queue processor API key |
| `OPENAI_API_KEY` | ❌ | 2 | OpenAI API key |
| `GOOGLE_AI_API_KEY` | ❌ | 2 | Google AI API key |
| `NODE_ENV` | ✅ | 1 | Environment mode |
| `NEXT_PUBLIC_APP_URL` | ✅ | 1 | Application URL |

## 🆘 Troubleshooting

### Common Issues:

1. **"Supabase connection failed"**:
   - Check your Supabase URL and keys
   - Ensure your project is active
   - Verify RLS policies are set up

2. **"Clerk authentication error"**:
   - Verify Clerk keys are correct
   - Check if your app is properly configured
   - Ensure domain is whitelisted

3. **"Queue processor unauthorized"**:
   - Verify `QUEUE_PROCESSOR_SECRET` is set
   - Check API key in request headers
   - Ensure secret is at least 32 characters

4. **"Database migration failed"**:
   - Run the migration SQL manually in Supabase
   - Check if tables exist
   - Verify RLS policies are applied

### Getting Help:

1. Check the browser console for errors
2. Review server logs in terminal
3. Verify environment variables are loaded
4. Test each service individually 