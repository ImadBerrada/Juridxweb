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

## Environment Variables for Production

Add these in your deployment platform:

```env
# Database (from Neon or your PostgreSQL provider)
DATABASE_URL="postgresql://username:password@host:5432/database"

# Security (generate random strings)
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

## Step-by-Step Vercel Deployment

### 1. Prepare Repository
```bash
git add .
git commit -m "Ready for deployment"
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
- Configure environment variables
- Deploy

### 4. Post-Deployment
The app will automatically:
- Generate Prisma client
- Create database tables
- Seed initial data (admin user, services, testimonials)

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
1. **Build fails**: Check environment variables
2. **Database connection**: Verify DATABASE_URL
3. **404 errors**: Ensure all routes are properly configured

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Neon: [neon.tech/docs](https://neon.tech/docs)

## Security Notes

- Never commit `.env` files to Git
- Use strong passwords for admin account
- Regularly update dependencies
- Monitor for security vulnerabilities

---

**Your app will be live at:** `https://your-app-name.vercel.app`

**Admin login:**
- Email: admin@juridx.com
- Password: (as set in environment variables) 