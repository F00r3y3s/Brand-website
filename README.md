# AInar - Premium Brand Agency Website

A world-class, award-winning brand agency website built with cutting-edge technologies, featuring interactive animations, multi-language support (English/Arabic with RTL), dark/light modes, and enterprise-grade performance optimization.

## Features

### 🎨 Design & UX
- **Premium UAE-Inspired Design**: Gold/Sand color palette with glassmorphism effects
- **Interactive Brand Animation**: Animated Alef (ا) SVG character that draws on scroll
- **Smooth Animations**: GSAP-powered scroll animations, parallax effects, and micro-interactions
- **Responsive Design**: Fully responsive across all devices (mobile-first approach)
- **Dark/Light Mode**: Seamless theme switching with localStorage persistence

### 🌍 Internationalization
- **Bilingual Support**: Full English/Arabic interface
- **RTL/LTR Support**: Automatic layout adjustment based on language selection
- **Language Persistence**: User language preference saved to localStorage

### 📱 Sections
1. **Hero Section**: Brand introduction with animated Alef character and CTAs
2. **Services**: 5 service categories with hover animations
   - Sustainability & AI Advisory
   - Social Media & Content Creation
   - E-Commerce Solutions
   - IT Solutions & Services
   - Web & Software Development
3. **App Showcase**: Cinematic presentation of Sustainability App with mockup
4. **Team Section**: Team members with mock data and interactive cards
5. **Testimonials**: Client success stories with carousel
6. **Newsletter**: Email subscription with validation
7. **CTA Section**: Call-to-action with statistics
8. **Footer**: Comprehensive footer with links and social media

### 🔧 Technical Excellence
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom theme
- **Animations**: GSAP + ScrollTrigger + Framer Motion
- **Smooth Scrolling**: Lenis for butter-smooth scroll experience
- **Performance**: Lighthouse 90+ target, optimized assets
- **Accessibility**: WCAG 2.1 AA compliant
- **Security**: Security headers, CSP, XSS protection
- **Type Safety**: Full TypeScript support

### 🍪 Functionality
- **Cookies Management**: Consent banner with localStorage persistence
- **Scroll-Triggered Animations**: Staggered reveals, parallax, and morphing effects
- **Form Validation**: Newsletter email validation
- **Mobile Navigation**: Responsive hamburger menu
- **Scroll Animations**: Smooth scroll to anchors with Lenis

## Installation & Setup

### Prerequisites
- Node.js 20.9+ (for Next.js 16)
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

The development server will automatically reload when you make changes.

### Build for Production

```bash
# Note: Build requires Node.js 20.9+
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles, animations, variables
│   ├── layout.tsx            # Root layout with fonts & providers
│   └── page.tsx              # Main page with all sections
├── components/
│   ├── Header.tsx            # Navigation with theme/language toggles
│   ├── Hero.tsx              # Hero section with CTA
│   ├── BrandAlef.tsx         # Animated Alef SVG component
│   ├── Services.tsx          # Services grid with animations
│   ├── AppShowcase.tsx       # App mockup section
│   ├── Team.tsx              # Team members with cards
│   ├── Testimonials.tsx      # Testimonials carousel
│   ├── Newsletter.tsx        # Newsletter signup form
│   ├── CTA.tsx               # Call-to-action section
│   ├── Footer.tsx            # Footer with links
│   └── CookiesConsent.tsx    # Cookies banner
├── context/
│   ├── LanguageContext.tsx   # Language/RTL toggle context
│   ├── ThemeContext.tsx      # Dark/Light mode context
│   └── Providers.tsx         # Combined context providers
└── hooks/
    └── useScrollAnimation.ts # Custom hooks for animations
```

## Customization Guide

### Updating Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --color-gold: #C5A059;      /* Primary color */
  --color-sand: #D4AF86;      /* Secondary color */
  --color-dark-primary: #0A0A0A;
  /* ... more colors ... */
}
```

### Adding Services

Edit the `services` array in `src/components/Services.tsx`:

```typescript
const services: Service[] = [
  {
    id: 'service-id',
    icon: <IconComponent />,
    title: { en: 'English Title', ar: 'Arabic Title' },
    description: { en: 'English...', ar: 'Arabic...' },
    color: 'accent-blue', // or 'gold', 'sand', etc.
  },
  // ... more services ...
];
```

### Adding Team Members

Edit the `teamMembers` array in `src/components/Team.tsx`:

```typescript
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: { en: 'Name', ar: 'اسم' },
    role: { en: 'Role', ar: 'الدور' },
    image: '👤', // Emoji or image URL
    bio: { en: 'Bio...', ar: 'السيرة الذاتية...' },
  },
  // ... more team members ...
];
```

### Adding Testimonials

Edit the `testimonials` array in `src/components/Testimonials.tsx`.

### Adding Navigation Links

Update the `navItems` in `src/components/Header.tsx`.

## Translation System

All text strings are managed in the respective component files with this pattern:

```typescript
label: { en: 'English Text', ar: 'النص العربي' }
```

Use the `useLanguage()` hook to access the current language:

```typescript
const { language } = useLanguage();

<h1>
  {language === 'en' ? 'Hello' : 'مرحبا'}
</h1>
```

## Theme Customization

Use the `useTheme()` hook to access and change theme:

```typescript
const { theme, toggleTheme, setTheme } = useTheme();
```

## Performance Optimization

### Key Optimizations
- **Image Optimization**: Next.js Image component with WebP/AVIF formats
- **Font Optimization**: Preloaded Google Fonts (Inter, Outfit, Noto Sans Arabic)
- **Code Splitting**: Automatic route-based code splitting
- **CSS Optimization**: Tailwind CSS with PurgeCSS
- **Animation Optimization**: GSAP hardware acceleration
- **Asset Lazy Loading**: Components lazy-load when in viewport
- **Reduce Motion**: Respects user's prefers-reduced-motion preference

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Color contrast compliance
- Semantic HTML

## Security Features

- XSS Protection (X-XSS-Protection header)
- Frame Hijacking Protection (X-Frame-Options)
- MIME Sniffing Protection (X-Content-Type-Options)
- Referrer Policy
- Permissions Policy (geolocation, microphone, camera disabled)
- Secure headers configured

## Development Tips

### Adding Animations

Use GSAP with ScrollTrigger for scroll-based animations:

```typescript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.from(element, {
  scrollTrigger: {
    trigger: element,
    start: 'top 80%',
    end: 'top 50%',
    scrub: 0.5,
  },
  opacity: 0,
  y: 50,
});
```

### Creating New Sections

1. Create a new component file in `src/components/`
2. Add translations with language support
3. Import and add to `src/app/page.tsx`
4. Style with Tailwind CSS classes
5. Add animations using GSAP or Framer Motion

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t ainar-website .
docker run -p 3000:3000 ainar-website
```

## SEO

The website includes:
- Semantic HTML structure
- Meta tags for social sharing (OpenGraph)
- Structured data ready
- Sitemap (can be generated)
- Robots.txt (can be created)

## Future Enhancements

- [ ] Blog section
- [ ] Case studies showcase
- [ ] Contact form with backend
- [ ] Video background optimization
- [ ] 3D product showcase
- [ ] Interactive analytics dashboard
- [ ] Progressive Web App (PWA) features
- [ ] Multi-currency support
- [ ] Analytics integration
- [ ] A/B testing framework

## Support & Contributing

For issues, bugs, or feature requests, please contact the AInar team.

## License

© 2024 AInar. All rights reserved.

---

**Built with passion in the UAE** 🇦🇪

Stay updated with our newsletter and follow us on social media for the latest in brand innovation, AI, and sustainability.
