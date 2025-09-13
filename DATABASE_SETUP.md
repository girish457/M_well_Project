# Database Setup Guide

This guide will help you set up the MongoDB database and authentication system for the M-Well Healthcare application.

## Prerequisites

1. **MongoDB Atlas Account**: Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Node.js**: Version 18 or higher
3. **npm**: Latest version

## Step 1: MongoDB Atlas Setup

1. **Create a Cluster**:
   - Log in to MongoDB Atlas
   - Click "Create" to create a new cluster
   - Choose the free tier (M0)
   - Select a region close to your location
   - Click "Create Cluster"

2. **Create Database User**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

3. **Whitelist IP Address**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add your specific IP addresses
   - Click "Confirm"

4. **Get Connection String**:
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `mwell-healthcare`

## Step 2: Environment Variables

1. **Create `.env.local` file** in the project root:
```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/mwell-healthcare?retryWrites=true&w=majority"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

2. **Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

## Step 3: Database Setup

1. **Generate Prisma Client**:
```bash
npm run db:generate
```

2. **Push Schema to Database**:
```bash
npm run db:push
```

3. **Create Admin User**:
```bash
npm run db:seed
```

## Step 4: Start the Application

```bash
npm run dev
```

## Default Admin Credentials

After running the seed script, you can log in with:
- **Email**: admin@mwell.com
- **Password**: admin123
- **Role**: ADMIN

## Features

### Authentication
- ✅ Email/password authentication with NextAuth.js
- ✅ Secure password hashing with bcrypt
- ✅ JWT session management
- ✅ Role-based access control (USER/ADMIN)

### Database Models
- **User**: Stores user information and roles
- **Account**: NextAuth.js account data
- **Session**: NextAuth.js session data
- **Appointment**: User appointments with edit functionality
- **VerificationToken**: Email verification tokens

### Admin Features
- ✅ Admin dashboard at `/admin`
- ✅ User management table
- ✅ Role-based access control
- ✅ Statistics overview

### Security
- ✅ Middleware protection for admin routes
- ✅ Server-side authentication checks
- ✅ Secure password storage
- ✅ CSRF protection with NextAuth.js

## Troubleshooting

### Common Issues

1. **Connection Error**:
   - Check your DATABASE_URL format
   - Ensure your IP is whitelisted
   - Verify database user credentials

2. **Authentication Issues**:
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain
   - Ensure Prisma client is generated

3. **Admin Access**:
   - Run `npm run db:seed` to create admin user
   - Check user role in database
   - Clear browser cache/cookies

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create admin user
npm run db:seed

# View database in Prisma Studio
npx prisma studio
```

## Production Deployment

1. **Environment Variables**:
   - Set production DATABASE_URL
   - Use secure NEXTAUTH_SECRET
   - Set correct NEXTAUTH_URL

2. **Security**:
   - Restrict IP access in MongoDB Atlas
   - Use environment-specific secrets
   - Enable HTTPS

3. **Database**:
   - Use production MongoDB cluster
   - Set up database backups
   - Monitor performance

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB Atlas cluster is running
4. Check network connectivity
