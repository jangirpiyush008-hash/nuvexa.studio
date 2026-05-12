# Nuvexa Studio

AI-powered agency landing page. Web in 72h, apps in 5d, creatives in 24h, automation overnight.

## Stack
Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Spline 3D.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to /dist
```

## Deploy
Push to GitHub, import to Vercel, point `nuvexa.studio` DNS at Vercel. Done.

## Edit content
- Services: `src/content/services.ts`
- Projects: `src/content/projects.ts` (replace placeholder URLs with real ones)
- Courses: `src/content/courses.ts`
- Hero copy: `src/components/HeroSection.tsx`
- Contact email/WhatsApp: `src/components/Contact.tsx`

## v2 ideas
- Replace mailto with Formspree or Resend-backed form
- Course detail pages + Razorpay checkout
- Project case study pages
- Blog (MDX)
- Replace placeholder Spline scene with a custom one
