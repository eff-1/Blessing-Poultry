# ⚡ Quick Start - Blessing Poultry

Get your poultry farm website running in **15 minutes**!

## Prerequisites
- Node.js 18+ installed
- A code editor (VS Code recommended)
- A Supabase account (free)

---

## Step 1: Install Dependencies (2 min)

```bash
npm install
```

---

## Step 2: Setup Supabase (5 min)

### A. Create Project
1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click **"New Project"**
3. Fill in:
   - Name: `blessing-poultry`
   - Database Password: (save this!)
   - Region: (choose closest)
4. Click **"Create new project"**
5. Wait ~2 minutes for setup

### B. Get Credentials
1. Click **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL**
   - **anon public key**

### C. Configure Environment
```bash
# Copy example file
cp .env.example .env.local

# Open .env.local and paste your credentials
```

Your `.env.local` should look like:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Setup Database (3 min)

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `supabase-setup.sql` from your project
4. Copy ALL contents
5. Paste into SQL Editor
6. Click **"Run"** (or Ctrl+Enter)
7. Should see: ✅ "Success. No rows returned"

---

## Step 4: Create Storage Buckets (2 min)

1. Click **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Create these 5 buckets (one by one):

For each bucket:
- Enter name: `product-images`, `gallery-images`, `about-images`, `hero-images`, `testimonials`
- Toggle **"Public bucket"** to **ON**
- Click **"Create bucket"**

---

## Step 5: Create Admin User (1 min)

1. Click **Authentication** → **Users**
2. Click **"Add User"**
3. Fill in:
   - Email: `admin@blessingpoultry.com`
   - Password: (choose strong password)
   - Auto Confirm User: ✅ **ON**
4. Click **"Create User"**
5. **Save these credentials!**

---

## Step 6: Start Development Server (1 min)

```bash
npm run dev
```

Open browser: `http://localhost:5173`

---

## Step 7: Test Everything (1 min)

### Test Landing Page
1. Visit `http://localhost:5173`
2. Should see hero section with sample data
3. Scroll through all sections
4. Click product filters
5. Check gallery images

### Test Admin Dashboard
1. Go to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Should see dashboard with stats
4. Click "Products" → Try adding a product
5. Upload an image
6. Go back to homepage → Your product appears!

---

## ✅ You're Done!

Your website is now running with:
- ✅ Beautiful landing page
- ✅ Working admin dashboard
- ✅ Sample data loaded
- ✅ Image uploads working
- ✅ Real-time updates

---

## What's Next?

### Add Your Content
1. Login to admin dashboard
2. Go to "Products" → Add your products
3. Go to "Gallery" → Upload farm photos
4. Go to "Testimonials" → Add customer reviews
5. Go to "About" → Update your story
6. Go to "Contact Info" → Add your details

### Customize
- Change colors in `src/styles/global.css`
- Update farm name in components
- Add your logo
- Change hero background

### Deploy to Production
See **DEPLOYMENT.md** for deploying to Vercel/Netlify

---

## Troubleshooting

### "Invalid API key"
- Check `.env.local` has correct credentials
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Table does not exist"
- Run `supabase-setup.sql` in SQL Editor
- Check Table Editor to verify tables exist

### "Images not uploading"
- Verify buckets are created
- Make sure buckets are **Public**
- Check bucket names match exactly

### "Can't login"
- Verify user exists in Authentication → Users
- Check email/password are correct
- Make sure "Auto Confirm User" was enabled

---

## Need More Help?

- **Detailed Setup**: See `SETUP-GUIDE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Overview**: See `PROJECT-SUMMARY.md`
- **Code Issues**: Check browser console (F12)

---

## Quick Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**That's it! You're ready to build your poultry farm's online presence! 🎉**
