# 🚀 Deployment Guide - Blessing Poultry

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Vercel or Netlify account (for hosting)

## Step-by-Step Deployment

### 1. Supabase Setup

#### A. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `blessing-poultry`
   - Database Password: (save this securely)
   - Region: Choose closest to your users

#### B. Get API Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key

#### C. Create Database Tables
1. Go to SQL Editor
2. Copy and paste contents from `supabase-setup.sql`
3. Click "Run"
4. Verify tables are created in Table Editor

#### D. Create Storage Buckets
1. Go to Storage
2. Create these buckets (all public):
   - `hero-images`
   - `product-images`
   - `gallery-images`
   - `about-images`
   - `testimonials`

For each bucket:
- Click "New Bucket"
- Name it
- Make it **Public**
- Click "Create Bucket"

#### E. Configure Storage Policies
For each bucket, add this policy:
```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'bucket-name' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'bucket-name' );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'bucket-name' );
```

#### F. Create Admin User
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Click "Create User"
5. Save credentials securely

### 2. Local Development Setup

```bash
# Clone or navigate to project
cd blessing-poultry

# Install dependencies
npm install

# Create .env.local file
echo "VITE_SUPABASE_URL=your_project_url" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### 3. Test Locally

#### Test Landing Page
- [ ] Navigate to homepage
- [ ] Check all sections load
- [ ] Test product filtering
- [ ] Test gallery lightbox
- [ ] Test testimonials carousel
- [ ] Verify WhatsApp button works

#### Test Admin Dashboard
- [ ] Go to `/admin/login`
- [ ] Login with admin credentials
- [ ] Test adding a product
- [ ] Test uploading gallery images
- [ ] Test adding testimonials
- [ ] Test updating about section
- [ ] Test updating contact info

### 4. Deploy to Vercel

#### A. Prepare for Deployment
```bash
# Build the project
npm run build

# Test production build locally
npm run preview
```

#### B. Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: blessing-poultry
# - Directory: ./
# - Override settings? No
```

#### C. Add Environment Variables
```bash
# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your anon key

# Redeploy with environment variables
vercel --prod
```

#### D. Via Vercel Dashboard (Alternative)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### 5. Deploy to Netlify (Alternative)

#### A. Via Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### B. Via Netlify Dashboard
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to Git repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy site"

### 6. Post-Deployment Checklist

#### A. Verify Deployment
- [ ] Visit deployed URL
- [ ] Test all landing page sections
- [ ] Test admin login at `/admin/login`
- [ ] Test CRUD operations in admin dashboard
- [ ] Test image uploads
- [ ] Test on mobile devices
- [ ] Test on different browsers

#### B. Configure Custom Domain (Optional)
**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Netlify:**
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

#### C. Setup SSL
Both Vercel and Netlify automatically provision SSL certificates.

#### D. Performance Optimization
- [ ] Enable Vercel/Netlify CDN
- [ ] Compress images before uploading
- [ ] Monitor Core Web Vitals
- [ ] Setup analytics (optional)

### 7. Maintenance

#### Update Content
1. Login to admin dashboard
2. Update products, gallery, testimonials as needed
3. Changes reflect immediately on live site

#### Update Code
```bash
# Make changes locally
git add .
git commit -m "Update description"
git push

# Vercel/Netlify auto-deploys from Git
```

#### Backup Database
```bash
# In Supabase Dashboard
# Go to Database → Backups
# Enable automatic backups
# Or manually export data
```

### 8. Troubleshooting

#### Images Not Loading
- Check storage bucket is public
- Verify storage policies are correct
- Check image URLs in database

#### Admin Can't Login
- Verify user exists in Supabase Auth
- Check email/password are correct
- Verify environment variables are set

#### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Database Connection Issues
- Verify Supabase URL and key are correct
- Check RLS policies allow public read
- Verify tables exist

### 9. Security Best Practices

- [ ] Never commit `.env.local` to Git
- [ ] Use strong admin password
- [ ] Enable 2FA on Supabase account
- [ ] Regularly update dependencies
- [ ] Monitor Supabase logs for suspicious activity
- [ ] Keep RLS policies restrictive
- [ ] Use HTTPS only (automatic with Vercel/Netlify)

### 10. Monitoring & Analytics

#### Setup Google Analytics (Optional)
1. Create GA4 property
2. Add tracking code to `index.html`
3. Monitor traffic and user behavior

#### Supabase Monitoring
- Check Database → Logs for errors
- Monitor Storage usage
- Track API usage

### 11. Cost Estimation

**Supabase Free Tier:**
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- Sufficient for small to medium farms

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Perfect for this project

**Total Cost: $0/month** (on free tiers)

### 12. Scaling Considerations

When you outgrow free tiers:
- **Supabase Pro**: $25/month (8GB database, 100GB storage)
- **Vercel Pro**: $20/month (1TB bandwidth)

### 13. Support Resources

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- React Docs: https://react.dev
- Framer Motion: https://www.framer.com/motion

---

## Quick Deploy Commands

```bash
# Complete deployment in one go
npm install
npm run build
vercel --prod

# Or with Netlify
npm install
npm run build
netlify deploy --prod
```

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Review this guide step-by-step

---

**Congratulations! Your Blessing Poultry website is now live! 🎉**
