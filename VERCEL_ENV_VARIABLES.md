# Vercel Environment Variables Setup

## Required Environment Variables for Production

Copy and paste these exact variable names and values into your Vercel project settings:

### 1. Database Configuration
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mwell-healthcare?retryWrites=true&w=majority
```
**Note:** Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### 2. JWT Authentication (Required)
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-67890
```
**Note:** Generate strong, unique secrets for production. You can use: `openssl rand -base64 32`

### 3. NextAuth.js Configuration (Required)
```
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production-abcdef
NEXTAUTH_URL=https://your-domain.vercel.app
```
**Note:** Replace `your-domain.vercel.app` with your actual Vercel domain.

### 4. Optional Variables (with defaults)
```
JWT_EXPIRES_IN=1h
REFRESH_EXPIRES_IN=7d
NEXT_PUBLIC_SITE_NAME=M-Well
OPENAI_API_KEY=your-openai-api-key-if-needed
```

## How to Add Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each variable with its corresponding value
5. Make sure to set the environment to "Production" for all variables
6. Click "Save" after adding each variable

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | ✅ | JWT token signing secret | `your-secret-key-12345` |
| `REFRESH_SECRET` | ✅ | Refresh token signing secret | `your-refresh-secret-67890` |
| `NEXTAUTH_SECRET` | ✅ | NextAuth.js session secret | `your-nextauth-secret-abcdef` |
| `NEXTAUTH_URL` | ✅ | Your production domain | `https://your-app.vercel.app` |
| `JWT_EXPIRES_IN` | ❌ | JWT token expiration | `1h` |
| `REFRESH_EXPIRES_IN` | ❌ | Refresh token expiration | `7d` |
| `NEXT_PUBLIC_SITE_NAME` | ❌ | Site name displayed in UI | `M-Well` |
| `OPENAI_API_KEY` | ❌ | OpenAI API key for chatbot | `sk-...` |

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Rotate secrets regularly
- Use different secrets for different environments
- Keep your MongoDB credentials secure

## Testing

After setting up the environment variables:
1. Redeploy your Vercel project
2. Check the build logs for any missing variable errors
3. Test all authentication features
4. Verify database connectivity
