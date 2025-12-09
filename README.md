# 🌿 Blessing Poultry - Farm Website & Admin Dashboard

A modern, fully animated poultry farm website with an intuitive admin dashboard built with React, Vite, Bootstrap, Framer Motion, and Supabase.

## 🚀 Features

### Landing Page
- Smooth scroll navigation with sticky navbar
- Animated hero section with CTAs
- About section with farm story
- Product catalog with category filtering
- Beautiful gallery with lightbox
- Customer testimonials carousel
- Contact section with social links
- WhatsApp floating button
- Fully responsive design

### Admin Dashboard
- Secure authentication
- Dashboard overview with statistics
- Manage products (CRUD operations)
- Manage gallery images
- Manage testimonials
- Update about section
- Update contact information
- Image upload functionality

## 📦 Tech Stack

- **Frontend**: React 18 + Vite
- **UI Framework**: Bootstrap 5 + React Bootstrap
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v6

## 🛠️ Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Update `.env.local`:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
\`\`\`

### 3. Create Database Tables

Run these SQL commands in Supabase SQL Editor:

\`\`\`sql
-- Hero table
CREATE TABLE hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- About table
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  image_url TEXT,
  category TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact info table
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  facebook TEXT,
  instagram TEXT,
  twitter TEXT
);
\`\`\`

### 4. Create Storage Buckets

In Supabase Storage, create these public buckets:
- `hero-images`
- `product-images`
- `gallery-images`
- `about-images`
- `testimonials`

Enable public access for all buckets.

### 5. Create Admin User

In Supabase Authentication, create a user account for admin access.

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:5173`

## 🎨 Color Palette

- Primary Green: `#2E7D32`
- Secondary Green: `#A5D6A7`
- Background Cream: `#FEFBF4`
- Text Dark: `#1A1A1A`
- Earth Brown: `#795548`

## 📱 Pages

- `/` - Landing page
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## 🔒 Security

- Row Level Security (RLS) policies should be configured in Supabase
- Admin routes are protected with authentication
- Environment variables for sensitive data

## 🚢 Deployment

### Deploy to Vercel

\`\`\`bash
npm run build
\`\`\`

Connect your GitHub repo to Vercel and add environment variables.

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for Blessing Poultry
\`\`\`
