# Portfolio Customization Guide

A complete reference for personalizing your portfolio website.

---

## Quick Start

```bash
cd /home/kimi/claude-projects/portfolio
npm run dev     # Start dev server (hot reload)
npm run build   # Production build → dist/
npm run preview # Preview production build
```

---

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first styling via `@tailwindcss/vite`
- **Vue Router** — Client-side routing for blog posts
- **Web3Forms** — Contact form email delivery (no backend)

---

## Design System

The site follows a strict design system. Understanding it helps you make changes that stay consistent.

### Spacing

All spacing uses an **8px scale**: 4, 8, 16, 24, 32, 48, 64, 96. Every margin, padding, and gap in the site maps to one of these values. When adding content, stick to Tailwind classes that align with this scale (`p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px, `p-12` = 48px).

### Typography

Defined as utility classes in `main.css`. Use these instead of raw Tailwind text sizes:

| Class | Size | Use for |
|---|---|---|
| `.type-display` | 48px / 56px on md+ | Hero heading |
| `.type-h2` | 24px / 32px on md+ | Section headings |
| `.type-h3` | 20px | Card titles, subheadings |
| `.type-body-lg` | 18px | Lead paragraphs |
| `.type-body` | 16px | Body text |
| `.type-sm` | 14px | Secondary text, labels |
| `.type-xs` | 12px | Metadata, timestamps |
| `.type-mono` | IBM Plex Mono | Code, tags, labels |

### Components

Reusable CSS classes defined in `main.css`:

| Class | What it does |
|---|---|
| `.card` | Consistent card with 12px radius, border, hover border shift |
| `.tag` | Inline label with 6px radius, accent color, mono font |
| `.divider` | 1px horizontal line for section headers |
| `.fade-section` | Scroll-triggered fade-in (16px travel, 500ms) |

### Border Radius

- **12px** — Cards, inputs, code blocks, images
- **8px** — Buttons, social icons, cert badges
- **6px** — Tags, small labels

### Container Width

All sections use `max-w-[1080px]`. Blog post pages use `max-w-[640px]`. Do not introduce other widths.

### Colors

Defined as CSS custom properties in `main.css` under `@theme`:

```css
--color-accent: #4f46e5;          /* Primary accent */
--color-accent-light: #818cf8;    /* Accent for dark mode */
--color-accent-subtle: #eef2ff;   /* Subtle accent bg (light mode) */
--color-surface-0: #09090b;       /* Dark mode page bg */
--color-surface-1: #0f0f13;       /* Dark mode card bg */
--color-surface-2: #18181b;       /* Dark mode input bg */
--color-border: #27272a;          /* Dark mode border */
--color-border-subtle: #1c1c20;   /* Dark mode subtle border */
--color-text-primary: #fafafa;    /* Dark mode primary text */
--color-text-secondary: #a1a1aa;  /* Dark mode secondary text */
--color-text-tertiary: #71717a;   /* Dark mode muted text */
--color-light-bg: #fafafa;        /* Light mode page bg */
--color-light-card: #ffffff;      /* Light mode card bg */
--color-light-border: #e4e4e7;    /* Light mode border */
```

To change the accent color, update `--color-accent` and `--color-accent-light`, and the hex references in `.tag` and `.blog-content a` styles.

### Fonts

- **Sans:** Inter (headings + body)
- **Mono:** IBM Plex Mono (tags, metadata, code)

To swap fonts, update `--font-sans` / `--font-mono` in the `@theme` block and the Google Fonts `<link>` in `index.html` (line 22).

---

## File Map

```
src/
├── components/
│   ├── Navbar.vue         # Fixed nav bar + dark mode toggle
│   ├── Hero.vue           # Landing (name, tagline, socials, CTAs)
│   ├── About.vue          # Bio paragraphs + stats card
│   ├── Experience.vue     # Work history cards + education
│   ├── Skills.vue         # Skills grid + certification badges
│   ├── Projects.vue       # Project cards in 2-col grid
│   ├── Publications.vue   # Research papers list
│   ├── Blog.vue           # Blog listing (reads from data/blog.js)
│   ├── Contact.vue        # Contact form (Web3Forms) + social links
│   └── Footer.vue         # Footer with name + credit
├── views/
│   ├── Home.vue           # Assembles all sections for main page
│   └── BlogPost.vue       # Individual blog post page (/blog/:slug)
├── data/
│   └── blog.js            # All blog post data lives here
├── assets/
│   └── main.css           # Design tokens, type ramp, components, blog styles
├── router/
│   └── index.js           # Routes: home (/) + blog posts (/blog/:slug)
├── App.vue                # Root component (dark mode state, router-view)
└── main.js                # App entry point
```

---

## Section-by-Section Customization

### 1. Page Title, Meta & Favicon

**File:** `index.html`

```html
<!-- Line 8: Page title -->
<title>Your Name — Mobile AppSec & Cybersecurity</title>

<!-- Line 9: Meta description (for search engines) -->
<meta name="description" content="Portfolio of Your Name — ..." />

<!-- Lines 12-15: Open Graph (for social sharing previews) -->
<meta property="og:title" content="Your Name — ..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="https://yoursite.com" />
```

Favicon is at `public/favicon.svg` — replace it with your own SVG or swap to a `.ico`/`.png` and update the `<link>` tag.

---

### 2. Hero Section

**File:** `src/components/Hero.vue` (lines 7-16)

```js
const name = 'Your Name'
const tagline = 'Mobile AppSec & Cybersecurity Professional'
const subtitle = 'Securing mobile applications. Breaking things to make them stronger.'

const socials = [
  { icon: 'github', href: '#', label: 'GitHub' },
  { icon: 'linkedin', href: '#', label: 'LinkedIn' },
  { icon: 'twitter', href: '#', label: 'Twitter' },
  { icon: 'email', href: 'mailto:you@example.com', label: 'Email' },
]
```

Available social icons: `github`, `linkedin`, `twitter`, `email`. SVG paths are defined in the same file — to add a new icon, add its path to the `svgPaths` object.

**Resume button:** Update the `href="#"` on the "Download Resume" link. Place a PDF in `public/` and link as `/resume.pdf`.

---

### 3. About Me

**File:** `src/components/About.vue` (lines 4-15)

```js
const bio = [
  `First paragraph...`,
  `Second paragraph...`,
]

const highlights = [
  { value: '3+', label: 'Years Experience' },
  { value: '50+', label: 'Apps Assessed' },
  { value: '10+', label: 'CVEs Reported' },
  { value: '5+', label: 'Publications' },
]
```

Add or remove paragraphs and stats as needed.

---

### 4. Experience

**File:** `src/components/Experience.vue` (lines 4-35)

Each job entry:

```js
{
  role: 'Your Job Title',
  company: 'Company Name',
  period: 'Jan 2024 — Present',
  current: true,              // true = green dot indicator
  description: 'What you did...',
  tags: ['Android VAPT', 'iOS VAPT'],
}
```

- Set `current: true` on your current role only (shows a green dot).
- Education is in the same file at the bottom:

```js
const education = [
  {
    degree: 'B.Tech in Computer Science',
    school: 'University Name',
    period: '2018 — 2022',
  },
]
```

---

### 5. Skills & Certifications

**File:** `src/components/Skills.vue` (lines 4-24)

```js
const skillCategories = [
  {
    title: 'Mobile Security',
    skills: ['Android VAPT', 'iOS VAPT', 'Frida', ...],
  },
  // ... more categories
]

const certifications = [
  { name: 'OSCP', issuer: 'Offensive Security', year: '2024' },
  // ... more certs
]
```

Add or remove categories, skills, and certifications freely. The cert badge displays the first 4 characters of the name.

---

### 6. Projects

**File:** `src/components/Projects.vue` (lines 4-30)

```js
{
  title: 'Project Name',
  description: 'What it does and why you built it.',
  tags: ['Python', 'Android'],
  link: '#',                    // GitHub or demo URL
  date: 'Sep 2024',
}
```

Each project is a clickable card. Displayed in a 2-column grid on desktop.

---

### 7. Publications

**File:** `src/components/Publications.vue` (lines 4-22)

```js
{
  title: 'Paper Title',
  venue: 'Conference / Journal Name',
  type: 'IEEE',                 // Badge label
  date: 'May 2024',
  authors: 'You, Co-Author 1, Co-Author 2',
  description: 'Brief summary...',
  link: '#',                    // Link to paper
}
```

---

### 8. Blog

**File:** `src/data/blog.js`

Add a new blog post at the **top** of the `posts` array:

```js
{
  slug: 'my-new-post',            // URL: /blog/my-new-post
  title: 'My New Blog Post',
  date: '2024-10-15',             // YYYY-MM-DD
  tags: ['Security', 'Tutorial'],
  excerpt: 'A one-line summary for the listing page.',
  content: `
    <p>Your content here using standard HTML.</p>

    <h2>Section Heading</h2>
    <p>Paragraph text.</p>

    <h3>Sub-heading</h3>
    <ul>
      <li>Bullet point</li>
    </ul>

    <pre><code>code block here</code></pre>

    <blockquote>A quote or callout.</blockquote>

    <img src="/blog-images/screenshot.png" alt="Description" />
  `,
}
```

**Supported HTML in blog content:**

| Tag | Renders as |
|---|---|
| `<h2>`, `<h3>` | Section headings (styled with spacing) |
| `<p>` | Paragraphs (16px, 1.75 line-height) |
| `<ul>`, `<ol>`, `<li>` | Bulleted / numbered lists |
| `<pre><code>` | Code blocks (IBM Plex Mono, dark bg) |
| `<code>` (inline) | Inline code with subtle bg |
| `<blockquote>` | Left-bordered quote |
| `<a href="...">` | Styled link with underline |
| `<img>` | Rounded image (12px radius) |
| `<hr>` | Horizontal divider |

**Adding images:** Place files in `public/blog-images/` and reference as `/blog-images/filename.png`.

---

### 9. Contact Form

**File:** `src/components/Contact.vue` (lines 10-16)

```js
const accessKey = 'YOUR_WEB3FORMS_ACCESS_KEY'

const contactLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Twitter / X', href: '#' },
]
```

**Setup:**
1. Go to [web3forms.com](https://web3forms.com/)
2. Enter your receiving email address
3. Get an access key and paste it in `accessKey`

Free tier: 250 submissions/month. The form has a loading spinner on submit and a success confirmation screen.

---

### 10. Footer

**File:** `src/components/Footer.vue` (line 5)

Replace `Your Name` with your actual name.

---

## Adding / Removing Sections

Sections are assembled in `src/views/Home.vue`.

**To remove a section:**
1. Delete its `import` line
2. Delete its `<div class="fade-section">` block

**To reorder:** Move the `<div class="fade-section">` blocks.

**To add a new section:**
1. Create `src/components/NewSection.vue`
2. Import it in `src/views/Home.vue`
3. Add `<div class="fade-section"><NewSection /></div>` where you want it
4. Add a nav link in `src/components/Navbar.vue` → `navLinks` array
5. Update section numbering (01, 02, etc.) if desired

---

## Deployment

### Vercel (recommended)

1. Push repo to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Framework preset: **Vite**
4. Deploy

Add `"build": "vite build"` is already set. No extra config needed.

### Netlify

1. Push to GitHub
2. Import on [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

For SPA routing (blog posts), create `public/_redirects`:
```
/*    /index.html   200
```

### GitHub Pages

1. Add `base: '/your-repo-name/'` to `vite.config.js`
2. Run `npm run build`
3. Deploy `dist/`

### Custom Domain

After deploying, point your domain's DNS to the hosting provider. Vercel and Netlify both provide free SSL and custom domain support.

---

## Checklist

Track your customization progress:

- [ ] Page title + meta description (`index.html`)
- [ ] Open Graph tags (`index.html`)
- [ ] Name, tagline, subtitle (`Hero.vue`)
- [ ] Social links with real URLs (`Hero.vue`)
- [ ] Resume PDF link (`Hero.vue`)
- [ ] Bio paragraphs (`About.vue`)
- [ ] Stats numbers (`About.vue`)
- [ ] Work experience entries (`Experience.vue`)
- [ ] Education (`Experience.vue`)
- [ ] Skill categories and items (`Skills.vue`)
- [ ] Certifications (`Skills.vue`)
- [ ] Projects with real links (`Projects.vue`)
- [ ] Publications with real links (`Publications.vue`)
- [ ] Blog posts with real content (`data/blog.js`)
- [ ] Web3Forms access key (`Contact.vue`)
- [ ] Contact social links (`Contact.vue`)
- [ ] Footer name (`Footer.vue`)
- [ ] Favicon (`public/favicon.svg`)
