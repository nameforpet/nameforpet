# 🐾 NameForPet (nameforpet.com) — Complete Project Documentation & Handover Guide

> **Project Identity**: **NameForPet** (`nameforpet.com`)  
> **Purpose**: AI-powered multilingual pet naming platform that analyzes uploaded pet photos (dogs, cats, rabbits, birds) using computer vision to recommend culturally authentic, meaningful names across 14+ world languages from a curated database of 17,900+ pet names.  
> **Last Updated**: November 14, 2026

---

## 📌 Quick Start for Any AI Agent or Developer

If this conversation was deleted, the machine was restarted, or you are a new agent taking over this project:

1. **Working Directory**: `C:\Users\ps\.gemini\antigravity\scratch\loveforpet`
2. **Start Dev Server**:
   ```bash
   cd C:\Users\ps\.gemini\antigravity\scratch\loveforpet
   npm run dev
   ```
   The local site runs at `http://localhost:3000`.
3. **Typecheck & Lint**:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
4. **Key Brand Guidelines**:
   - The brand name is strictly **NameForPet** / **nameforpet.com** (never "LoveForPet" or other variants in the user-facing UI).
   - Keep UI components lightweight, clutter-free, and mobile-responsive.

---

## 🛠 Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | React 18, TypeScript 5, Node.js |
| **Styling** | Tailwind CSS 3.4 | Custom theme colors (`brand` orange palette, `#FAF6F0` warm background) |
| **Icons** | Lucide React | Modern, lightweight SVG icon set |
| **AI Vision Engine** | Google Gemini API | Primary: `gemini-3.1-flash-lite`, Fallback: `gemini-3.5-flash-lite` |
| **Database & Auth** | Supabase (PostgreSQL) | Authentication (Email/Password + Google OAuth 2.0), Pet Names DB, RLS policies |
| **Cloud Storage** | Backblaze B2 (S3-Compatible) | High-speed cloud storage for user-uploaded pet photos via presigned URLs |
| **Celebration / FX** | canvas-confetti | Delighters when generating or saving pet names |

---

## 📂 Core Architecture & File Structure

```
loveforpet/
├── public/
│   ├── logo.png                # Official transparent NameForPet brand logo
│   ├── favicon.ico             # Browser icon
│   └── pet_samples/            # Default pet showcase images
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata, OpenGraph & viewport
│   │   ├── page.tsx            # Main Landing / Pet Photo Naming Experience
│   │   ├── browse/             # Dedicated 17,900+ Pet Names Directory
│   │   │   └── page.tsx        # A-Z jump bar, single-letter strict search, multi-filters
│   │   ├── gallery/            # Community Pet Gallery
│   │   │   └── page.tsx        # Showcase grid of uploaded pets & names
│   │   ├── contact/            # Contact Support page
│   │   │   └── page.tsx
│   │   ├── admin/              # Admin Dashboard
│   │   │   └── page.tsx        # User analytics, Google vs Email signup badges
│   │   ├── api/
│   │   │   ├── vision/         # Gemini Vision AI analysis & recommendation route
│   │   │   │   └── route.ts
│   │   │   ├── names/          # Pet names API endpoints
│   │   │   └── upload-url/     # Backblaze B2 S3 presigned upload handler
│   ├── components/
│   │   ├── Navbar.tsx          # Top navigation with responsive mobile dropdown
│   │   ├── Footer.tsx          # Footer with quick links, SEO language pills
│   │   ├── NameCard.tsx        # Clean, lightweight card for displaying pet names
│   │   ├── ImageUploader.tsx   # Pet photo dropzone / file picker
│   │   ├── PetNameDetailModal.tsx # Full-screen detail modal for a selected pet name
│   │   ├── SavedModal.tsx      # Saved / Bookmarked names drawer
│   │   ├── AuthModal.tsx       # Sign In / Sign Up modal (Google OAuth + Email)
│   │   ├── ExploreModal.tsx    # Compact name browsing modal
│   │   └── GalleryRow.tsx      # Infinite horizontal pet showcase rows
│   └── lib/
│       ├── types.ts            # Core TypeScript interfaces (PetNameRecord, RecommendedName, etc.)
│       ├── petNamesData.ts     # In-memory multilingual database (17,900+ names fallback)
│       ├── supabaseClient.ts   # Supabase client singleton, local storage sync, favorites
│       ├── namePersonaAI.ts    # Name persona classification (Cute, Luxury, Brave, etc.)
│       ├── userStorage.ts      # Client user session management & local cache
│       └── galleryStorage.ts   # Pet gallery persistence
├── .env.local                  # Environment variables & API credentials
├── read.md                     # Handover documentation (this file)
└── package.json
```

---

## 🔑 Environment Variables Configuration (`.env.local`)

Ensure `.env.local` contains valid credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tpyceqabdimkusdaxgax.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_99RlD1GbTSAc9Aa3YPHAQQ_YrJcg8N2

# Google Gemini AI Vision API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Google AdSense Publisher ID
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-8413163214211850

# Backblaze B2 (Cloud Storage for Pet Photos)
B2_BUCKET_NAME=nameforpet-uploads
B2_BUCKET_ID=eb3c0891ed86d177a6140b19
B2_KEY_ID=bc81d61764b9
B2_APPLICATION_KEY=005863875b1a6a69f9c3479ad06bf9698debd777d6
```

---

## 🌟 Key Features & How They Work

### 1. AI Vision Pet Name Generator (`/` and `/api/vision/route.ts`)
- **Workflow**:
  1. User drops or uploads a pet photo.
  2. The image is converted to Base64 and sent to `/api/vision`.
  3. Server invokes Google Gemini Vision (`gemini-3.1-flash-lite`).
  4. Gemini identifies:
     - **Species**: `dog`, `cat`, `rabbit`, `bird`.
     - **Breed & Visual Features**: e.g., Golden Retriever, Siamese, lop-eared, fluffy coat.
     - **Coat Colors**: e.g., golden, cream, white, chocolate, tricolor.
     - **Eye Color & Demeanor**: playful, noble, gentle, energetic.
     - **AI Candidate Names**: Gemini proposes authentic matching names.
  5. The server scores candidates against the 17,900+ database records using species resonance, coat color affinity (+35 pts), vibe alignment, and deterministic tie-breaking to avoid alphabetical bias.
  6. Returns ranked recommendations with origin language, phonetic pronunciation, meaning, and match explanations.

### 2. Dedicated Browse Directory (`/browse`)
- Full directory of **17,900+ pet names across 14 languages** (English, French, Japanese, German, Spanish, Italian, Celtic, Greek, Norse, Arabic, Chinese, Hindi, Slavic, Hebrew).
- **Strict Single-Letter Search**:
  - When user types a single letter (e.g. `g`), the directory strictly filters names that **start with that letter** (`Gaston`, `Gigi`, `Gretel`, etc.). It avoids substring false positives from meanings ("good", "dog") and origins ("English").
- **A–Z Quick Jump Bar**:
  - Single-click alphabet buttons (`All`, `A`, `B`, `C` ... `Z`) above the filters for fast mobile navigation.
- **Filters**: Species (Dogs, Cats, Rabbits, Birds), Gender (Male, Female, Unisex), Style (Cute, Luxury, Funny, Brave, Gentle).

### 3. Responsive Navigation & Mobile Dropdown (`src/components/Navbar.tsx`)
- **Desktop Navigation**:
  - Direct links: `Browse Names`, `Pet Gallery` (with `<Images />` icon), `Contact`.
  - Active tab indicators automatically highlight current route.
- **Mobile Navigation**:
  - To prevent horizontal overflow on small phone screens (320px–390px), a compact **Pet Gallery ▾** button is displayed.
  - Tapping opens a **100% solid, fully opaque white card** (`bg-white shadow-2xl border border-stone-200 z-50`):
    - 🖼️ **Pet Gallery**: Direct link to community photo gallery (`/gallery`).
    - 📖 **Browse Names**: Direct link to full name database (`/browse`).
    - ✉️ **Contact**: Support link (`/contact`).
  - Outside click listener and route change listener auto-close the dropdown.
  - Fixed earlier bug: Header and dropdown backgrounds are solid (no translucency) so underlying page headings never bleed through.

### 4. Authentication & User Management
- **Providers**: Email/Password + Google OAuth 2.0.
- **Google OAuth Setup**:
  - Google Cloud Console OAuth Client ID created for Web Application.
  - Supabase Auth Provider configured with Google Client ID and Secret.
  - Supabase Redirect URI: `https://<supabase-project-id>.supabase.co/auth/v1/callback`.
- **Admin Dashboard (`/admin`)**:
  - Displays user registrations.
  - Distinguishes sign-up method: Shows blue **Google Account** badge with Google 'G' icon for OAuth users, and green **Email** badge for password users.

### 5. Pet Gallery (`/gallery`)
- Interactive community showcase for pet photos and their matched names.
- "Show My Pet" feature connects uploaded pet photo to showcase.
- Backblaze B2 presigned URLs securely store and serve images.

---

## 🔧 Important Historical Fixes & Gotchas

1. **Gemini Model Deprecation**:
   - Legacy `gemini-2.5-flash` model returned `404 Not Found`.
   - Transitioned to `gemini-3.1-flash-lite` (primary) with fallback to `gemini-3.5-flash-lite`. Both are verified working with 200 OK.
2. **Alphabetical 'A' Clustering in AI Vision**:
   - Previously, names were showing only letter 'A' results because alphabetical sorting dominated equal score matches.
   - Fixed by incorporating Gemini's direct candidate names, applying strong color weighting (+35 pts), and using a deterministic hash tie-breaker.
3. **Single-Letter Search Pollution**:
   - Typing a single letter previously checked `meaning.includes(q)` and `origin_language.includes(q)`. Almost every record has letters like "g" or "e" in its description, resulting in all 17,900 names matching.
   - Fixed with strict prefix check: `if (activeLetter) { return nameLower.startsWith(activeLetter); }`.
4. **Navbar Mobile Dropdown Transparency**:
   - An earlier iteration used `bg-white/98 backdrop-blur-md` on the mobile menu, causing the large `Browse 17,900+ Names` text on `/browse` to show through the dropdown.
   - Fixed by switching the header to solid `bg-[#FAF6F0]` and the dropdown to pure solid `bg-white shadow-2xl` with a clean 1-line item layout.

---

## 💻 Common Commands Cheatsheet

```bash
# Go to project directory
cd C:\Users\ps\.gemini\antigravity\scratch\loveforpet

# Run development server
npm run dev

# Run TypeScript compilation check (must pass with 0 errors)
npx tsc --noEmit

# Test HTTP response of routes
curl.exe -I http://localhost:3000/
curl.exe -I http://localhost:3000/browse
curl.exe -I http://localhost:3000/gallery
curl.exe -I http://localhost:3000/admin

# Build for production
npm run build
```

---

*This document serves as the permanent state and handover record for **NameForPet**. Upload or reference this file in future sessions to immediately restore full context.*
