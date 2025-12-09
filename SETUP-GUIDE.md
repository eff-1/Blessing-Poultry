# 🌿 Blessing Poultry - Complete Setup Guide

## Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase

#### Create Account & Project
1. Visit [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Name it "blessing-poultry"
4. Choose a strong database password
5. Select your region
6. Wait for project to initialize (~2 minutes)

#### Get Your Credentials
1. Go to **Project Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string)

#### Configure Environment
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and paste your credentials
# VITE_SUPABASE_URL=your_project_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Create Database Tables

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy entire contents of `supabase-setup.sql`
4. Paste into editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### 4. Create Storage Buckets

1. Click **Storage** in left sidebar
2. Click **New Bucket**
3. Create these 5 buckets (one by one):

| Bucket Name | Public? |
|-------------|---------|
| `hero-images` | ✅ Yes |
| `product-images` | ✅ Yes |
| `gallery-images` | ✅ Yes |
| `about-images` | ✅ Yes |
| `testimonials` | ✅ Yes |

For each bucket:
- Enter name
- Toggle "Public bucket" to ON
- Click "Create bucket"

### 5. Create Admin User

1. Click **Authentication** in left sidebar
2. Click **Users** tab
3. Click **Add User** button
4. Choose **Create new user**
5. Enter:
   - Email: `admin@blessingpoultry.com` (or your email)
   - Password: (choose a strong password)
   - Auto Confirm User: ✅ ON
6. Click **Create User**
7. **Save these credentials** - you'll need them to login!

### 6. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 7. Test Your Setup

#### Test Landing Page
1. Open `http://localhost:5173`
2. You should see the hero section with sample data
3. Scroll through all sections
4. Products, gallery, and testimonials should display sample data

#### Test Admin Dashboard
1. Go to `http://localhost:5173/admin/login`
2. Login with the admin credentials you created
3. You should see the dashboard with statistics
4. Try adding a product:
   - Click "Products" in sidebar
   - Click "Add Product"
   - Fill in details
   - Upload an image
   - Click "Save Product"
5. Go back to homepage - your product should appear!

---

## Detailed Configuration

### Understanding the Project Structure

```
blessing-poultry/
├── src/
│   ├── components/
│   │   ├── Landing/          # Homepage components
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   ├── Hero.jsx      # Hero section
│   │   │   ├── About.jsx     # About section
│   │   │   ├── Products.jsx  # Products grid
│   │   │   ├── Gallery.jsx   # Image gallery
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Footer.jsx
│   │   ├── Admin/            # Dashboard components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   ├── ManageGallery.jsx
│   │   │   └── ...
│   │   └── Shared/           # Reusable components
│   ├── pages/                # Main pages
│   ├── lib/                  # Utilities
│   ├── hooks/                # Custom React hooks
│   └── styles/               # CSS files
├── .env.local               # Your credentials (DO NOT COMMIT)
├── supabase-setup.sql       # Database setup script
└── package.json
```

### Database Tables Explained

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `products` | Store farm products | name, price, category, in_stock |
| `gallery` | Store farm photos | image_url, caption |
| `testimonials` | Customer reviews | name, comment, rating |
| `about` | About section content | content, image_url |
| `contact_info` | Contact details | phone, email, address, socials |
| `hero` | Hero section (optional) | title, subtitle, image_url |

### Storage Buckets Explained

| Bucket | Used For |
|--------|----------|
| `product-images` | Product photos uploaded via admin |
| `gallery-images` | Farm gallery photos |
| `about-images` | About section image |
| `hero-images` | Hero background images |
| `testimonials` | Customer profile pictures (optional) |

---

## Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:** 
- Check `.env.local` has correct credentials
- Restart dev server after changing `.env.local`
- Verify you copied the **anon public** key, not the service role key

### Issue: "Table does not exist"
**Solution:**
- Run `supabase-setup.sql` in SQL Editor
- Check Table Editor to verify tables were created
- Make sure you're in the correct project

### Issue: "Images not uploading"
**Solution:**
- Verify storage buckets are created
- Make sure buckets are set to **Public**
- Check bucket names match exactly (case-sensitive)

### Issue: "Can't login to admin"
**Solution:**
- Verify user was created in Authentication → Users
- Check email/password are correct
- Make sure "Auto Confirm User" was enabled
- Try resetting password in Supabase dashboard

### Issue: "No data showing on homepage"
**Solution:**
- Sample data is inserted by `supabase-setup.sql`
- Check if SQL script ran successfully
- Manually add data via admin dashboard
- Check browser console for errors

---

## Customization Guide

### Change Colors

Edit `src/styles/global.css`:
```css
:root {
  --primary-green: #2E7D32;    /* Main brand color */
  --secondary-green: #A5D6A7;  /* Accent color */
  --bg-cream: #FEFBF4;         /* Background */
  --text-dark: #1A1A1A;        /* Text color */
}
```

### Change Hero Background

1. Login to admin dashboard
2. Go to "Manage Hero" (if implemented)
3. Or edit `src/components/Landing/Hero.jsx`:
```jsx
background: url('your-image-url.jpg')
```

### Add More Product Categories

Edit `src/components/Landing/Products.jsx`:
```jsx
const categories = [
  'All Products', 
  'Eggs', 
  'Broilers', 
  'Layers', 
  'Day-Old Chicks', 
  'Feeds',
  'Your New Category'  // Add here
]
```

### Change Farm Name

Search and replace "Blessing Poultry" in:
- `index.html` (title)
- `src/components/Landing/Navbar.jsx`
- `src/components/Landing/Footer.jsx`
- `README.md`

### Add More Social Media Links

Edit `src/components/Landing/Contact.jsx` and add to socials array:
```jsx
{ icon: FaLinkedIn, url: contact?.linkedin }
```

Then update `ManageContact.jsx` to include the field.

---

## Adding Content

### Add Products
1. Login to admin dashboard
2. Click "Products" in sidebar
3. Click "Add Product" button
4. Fill in:
   - Name (e.g., "Fresh Eggs")
   - Description
   - Price (numbers only)
   - Category (select from dropdown)
   - In Stock (checkbox)
   - Image (upload from computer)
5. Click "Save Product"

### Add Gallery Images
1. Go to "Gallery" in admin
2. Click "Select Images" or drag & drop
3. Select multiple images at once
4. Wait for upload to complete
5. Images appear on homepage immediately

### Add Testimonials
1. Go to "Testimonials" in admin
2. Click "Add Testimonial"
3. Enter customer name
4. Write their review
5. Select rating (1-5 stars)
6. Click "Save Testimonial"

### Update About Section
1. Go to "About" in admin
2. Edit the content text
3. Upload new image (optional)
4. Click "Save Changes"

### Update Contact Info
1. Go to "Contact Info" in admin
2. Fill in all fields:
   - Phone: `08012345678`
   - WhatsApp: `2348012345678` (country code + number)
   - Email: `info@yourfarm.com`
   - Address: Full address
   - Social media URLs (full URLs)
3. Click "Save Contact Info"

---

## Performance Tips

### Optimize Images Before Upload
- Use JPEG for photos (smaller file size)
- Resize to max 1920px width
- Compress using tools like TinyPNG
- Aim for under 500KB per image

### Best Practices
- Don't upload too many gallery images (20-30 max)
- Keep product descriptions concise
- Use high-quality but compressed images
- Test on mobile devices regularly

---

## Security Checklist

- [x] `.env.local` is in `.gitignore`
- [x] Never share your Supabase credentials
- [x] Use strong admin password
- [x] Enable 2FA on Supabase account
- [x] RLS policies are enabled (done by SQL script)
- [x] Storage buckets have proper policies

---

## Next Steps

1. ✅ Complete setup (you're here!)
2. 📝 Add your real content via admin dashboard
3. 🎨 Customize colors and branding
4. 📱 Test on mobile devices
5. 🚀 Deploy to production (see DEPLOYMENT.md)
6. 📊 Add analytics (optional)
7. 🌐 Setup custom domain (optional)

---

## Getting Help

### Resources
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Framer Motion**: https://www.framer.com/motion
- **Bootstrap**: https://getbootstrap.com

### Troubleshooting Steps
1. Check browser console (F12) for errors
2. Check Supabase logs (Database → Logs)
3. Verify environment variables
4. Restart development server
5. Clear browser cache

---

**You're all set! Start adding your content and make it yours! 🎉**
