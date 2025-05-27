# 🚀 JuridX Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Free)

1. **Create accounts:**
   - [GitHub](https://github.com) (if you don't have one)
   - [Vercel](https://vercel.com) (sign up with GitHub)
   - [Neon](https://neon.tech) (for PostgreSQL database)

2. **Set up database:**
   - Go to [Neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string (starts with `postgresql://`)

3. **Deploy to Vercel:**
   - Push code to GitHub
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (see below)
   - Deploy!

### Option 2: Railway (Alternative)

1. Go to [Railway.app](https://railway.app)
2. Connect GitHub repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

## Environment Variables Setup

### Local Development (.env file)
Create a `.env` file in your project root with:

```env
# Database - SQLite for local development
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Resend Email API (optional for local development)
RESEND_API_KEY="your-resend-api-key-here"

# JWT Secret
JWT_SECRET="your-jwt-secret-key-change-this-in-production"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin User (for seeding)
ADMIN_EMAIL="admin@juridx.com"
ADMIN_PASSWORD="admin123"
```

### Production Environment Variables
Add these in your Vercel dashboard:

```env
# Database (from Neon or your PostgreSQL provider)
DATABASE_URL="postgresql://username:password@host:5432/database"

# Security (generate random strings - use: openssl rand -base64 32)
NEXTAUTH_SECRET="your-super-secure-random-string-32-chars"
JWT_SECRET="another-super-secure-random-string-32-chars"

# URLs (replace with your actual domain)
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"

# Admin credentials
ADMIN_EMAIL="admin@juridx.com"
ADMIN_PASSWORD="your-secure-admin-password"

# Email (optional - for contact forms)
RESEND_API_KEY="your-resend-api-key"
```

## Database Schema Management

**Important:** The project uses different database providers for development and production:
- **Local Development:** SQLite (schema.prisma)
- **Production:** PostgreSQL (schema.production.prisma)

### For Production Deployment:
Before deploying, you need to switch to the PostgreSQL schema:

```bash
# Backup current schema
cp prisma/schema.prisma prisma/schema.sqlite.prisma

# Use production schema
cp prisma/schema.production.prisma prisma/schema.prisma

# Generate client and deploy
git add .
git commit -m "Switch to PostgreSQL for production"
git push origin main
```

### After Deployment:
Switch back to SQLite for local development:

```bash
# Restore SQLite schema for local development
cp prisma/schema.sqlite.prisma prisma/schema.prisma
npx prisma generate
```

## Step-by-Step Vercel Deployment

### 1. Prepare Repository
```bash
# Switch to production schema
cp prisma/schema.production.prisma prisma/schema.prisma

# Commit changes
git add .
git commit -m "Ready for deployment with PostgreSQL"
git push origin main
```

### 2. Create Neon Database
- Go to [neon.tech](https://neon.tech)
- Create account and new project
- Copy the connection string

### 3. Deploy on Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import from GitHub
- Configure environment variables (see above)
- Deploy

### 4. Post-Deployment Setup
After successful deployment, you'll need to set up the database:

1. Go to your Vercel project dashboard
2. Go to Functions tab and find a function
3. Use Vercel's terminal or create a simple API endpoint to run:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### 5. Switch Back to Local Development
```bash
# Restore SQLite for local development
cp prisma/schema.sqlite.prisma prisma/schema.prisma
npx prisma generate
```

## Custom Domain (Optional)

1. In Vercel dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

## Monitoring & Maintenance

- **Logs**: Check Vercel dashboard for deployment logs
- **Database**: Use Neon dashboard to monitor database
- **Updates**: Push to GitHub to trigger new deployments

## Troubleshooting

### Common Issues:

1. **Build fails with DATABASE_URL error**: 
   - Ensure you've set the DATABASE_URL environment variable in Vercel
   - Make sure you're using the PostgreSQL schema for production

2. **Database connection fails**: 
   - Verify DATABASE_URL format: `postgresql://username:password@host:5432/database`
   - Check Neon database is active

3. **404 errors**: 
   - Ensure all routes are properly configured
   - Check that environment variables are set correctly

4. **Prisma Client errors**:
   - Make sure `prisma generate` runs during build
   - Verify the schema matches your database provider

### Generate Secure Secrets:
```bash
# Generate secure secrets for production
openssl rand -base64 32
```

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Neon: [neon.tech/docs](https://neon.tech/docs)
- Prisma: [prisma.io/docs](https://prisma.io/docs)

## Security Notes

- Never commit `.env` files to Git
- Use strong passwords for admin account
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use different secrets for development and production

---

**Your app will be live at:** `https://your-app-name.vercel.app`

**Admin login:**
- Email: admin@juridx.com
- Password: (as set in environment variables) 