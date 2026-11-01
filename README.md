# 🐾 loveforpet.com — AI Pet Name Finder

> **Find the perfect name for your pet in 14+ world languages — powered by 100% self-hosted computer vision, no external AI API costs.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-ready-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Hosted-Vercel-000?logo=vercel)](https://vercel.com)

---

## ✨ How It Works

1. **Upload** a photo of your pet (dog, cat, rabbit, bird)
2. The **Built-in AI Vision** engine analyzes coat colors, breed features, and personality traits — runs fully on-device using HTML5 Canvas + optional WebGL MobileNet (no cloud API fees ever)
3. The system queries the **Supabase multilingual names database** (with a built-in fallback dataset) and scores each name by coat color match, species match, vibe, gender preference, and cultural origin
4. You receive a ranked list of **beautiful, meaningful names** from 14+ world languages with pronunciations, meanings, and fun facts
5. Save favorites, copy them, hear them spoken aloud, or browse the full collection by language

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, custom animations |
| AI Vision | HTML5 Canvas color analysis + TensorFlow.js MobileNet (WebGL, loaded on-demand) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Hosting | Vercel |
| Version Control | GitHub |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/loveforpet.git
cd loveforpet
npm install
```

### 2. Set Up Supabase (Optional — app works without it)

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `supabase/schema.sql`
3. Then run `supabase/seed.sql` to populate the multilingual names
4. Copy your **Project URL** and **Anon Key** from Settings → API

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄 Database Schema

The `pet_names` table stores multilingual names with:
- `name`, `meaning`, `origin_language`, `pronunciation`
- `gender` (male / female / unisex)
- `species[]` (dog / cat / rabbit / bird / any)
- `color_tags[]` — matched against detected coat colors (golden, white, black, brown, grey, orange…)
- `vibe_tags[]` — matched against personality analysis (noble, playful, gentle, mystical…)
- `popularity` (1–100 score)

> **The app ships with 65+ built-in names across 14 languages** as a fallback — Supabase is used when configured for your own thousands of names.

---

## 🌍 Supported Languages

Japanese • French • Spanish • Italian • German • Celtic/Irish • Norse • Latin • Greek • Hindi • Arabic • Swahili • Korean • English

---

## 🧠 Self-Hosted AI (Zero API Cost)

The vision pipeline is entirely self-contained:

1. **Canvas Color Extraction** — samples the uploaded image using HTML5 Canvas, clusters pixels against 10 coat color reference tones
2. **WebGL MobileNet** (optional) — loads TensorFlow.js + MobileNet from CDN on first use, classifies the image to identify breeds from 1000 ImageNet classes
3. **Name Scoring Engine** — a multi-factor scoring function ranks all names by species match (+25), color match (+30), vibe/personality match (+20), language preference (+35), and popularity (+10)

---

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel Project Settings → Environment Variables
4. Deploy!

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          ← Main page with full state management
│   ├── layout.tsx        ← SEO metadata, fonts
│   └── globals.css       ← Theme, pet-pattern background, animations
├── components/
│   ├── Navbar.tsx        ← Sticky navigation with saved counter
│   ├── PetPhotoUploader.tsx ← Drag & drop + sample pet grid
│   ├── AIScannerView.tsx ← Animated laser scan overlay
│   ├── ResultsDisplay.tsx ← Analysis + name grid + filters
│   ├── NameCard.tsx      ← Individual name card with copy/save/speak
│   ├── ExploreModal.tsx  ← Browse all names by language/species
│   ├── SavedModal.tsx    ← Saved favorites management
│   ├── SupabaseSetupBanner.tsx ← Setup guide with status
│   └── Footer.tsx
└── lib/
    ├── types.ts           ← All TypeScript interfaces
    ├── petNamesData.ts    ← 65+ built-in multilingual names
    ├── petVisionAI.ts     ← Canvas color extraction + MobileNet + scoring
    └── supabaseClient.ts  ← Supabase client + localStorage favorites
supabase/
├── schema.sql             ← Database schema + RLS policies
└── seed.sql               ← Seed 65+ names into Supabase
```

---

## 🗺 Roadmap

- [ ] Admin panel to bulk import pet names CSV
- [ ] User accounts (Supabase Auth) to sync favorites across devices
- [ ] More languages: Tamil, Thai, Swahili, Portuguese, Chinese, Russian
- [ ] Community name voting & ratings
- [ ] Name meaning audio pronunciations by native speakers
- [ ] Social share cards (share your pet's name pick!)

---

*Made with 🐾 love for furry companions worldwide.*
