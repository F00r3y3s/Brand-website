---
name: animation-router
description: Central animation decision router. Automatically selects the right animation skill based on use case. Use when user asks about any type of animation.
allowed-tools: Read
priority: high
---

# Animation Router

> Smart routing to the right animation skill based on your needs.

---

## 🎯 Quick Decision Tree

**Ask yourself: What are you animating?**

```
What do you need?
│
├── 🎨 Button/Card hover effect?
│   ├── Simple scale/opacity
│   └── → Use: framer-motion-basics
│
├── 📜 Scroll-driven card stacking/pinning?
│   ├── Cards that stick and stack
│   ├── Parallax effects
│   └── → Use: frontend-design/motion-graphics.md (GSAP section)
│
├── ⏱️ Not sure about timing/duration?
│   ├── How fast should this animate?
│   ├── Which easing curve?
│   └── → Use: frontend-design/animation-guide.md
│
├── 🌊 Need production spring curves?
│   ├── Bouncy, organic feel
│   ├── CSS spring() or linear() easing
│   └── → Use: motion MCP server
│
├── 🎬 Complex branded animation?
│   ├── Lottie/After Effects
│   ├── SVG morphing
│   ├── 3D transforms
│   ├── Particle effects
│   └── → Use: frontend-design/motion-graphics.md
│
└── 🧪 Testing animations?
    ├── Performance profiling
    ├── Accessibility (reduced motion)
    └── → Use: frontend-design/animation-guide.md (Performance section)
```

---

## 📚 Skill Reference Table

| Use Case | Primary Skill | Secondary Skills | MCP Tools |
|----------|--------------|------------------|-----------|
| **Button hover** | framer-motion-basics | animation-guide (timing) | motion (spring curves) |
| **Card entrance** | framer-motion-basics | animation-guide (easing) | - |
| **Scroll pinning** | motion-graphics (GSAP) | animation-guide (principles) | - |
| **Stacked cards** | motion-graphics (GSAP) | - | - |
| **Modal transitions** | framer-motion-basics | animation-guide (timing) | motion (cubic-bezier) |
| **Page transitions** | motion-graphics (orchestration) | animation-guide (psychology) | - |
| **Loading states** | animation-guide (loading principles) | framer-motion-basics (skeleton) | - |
| **SVG line drawing** | motion-graphics (SVG section) | - | - |
| **3D card flip** | motion-graphics (3D section) | - | - |
| **Particle background** | motion-graphics (particles) | - | - |
| **Spring animations** | - | - | motion MCP (generate-css-spring) |
| **Bounce animations** | - | - | motion MCP (generate-css-bounce) |

---

## 🚦 Task Complexity Guide

### Simple (Use Framer Motion Basics)
- Single component animation
- Under 5 lines of code
- No timing calculations needed
- Examples: button hover, icon spin, tooltip fade

### Medium (Use Animation Guide + Framer Motion)
- Multiple coordinated animations
- Requires timing decisions
- Accessibility considerations
- Examples: modal entrance, form validation feedback, staggered lists

### Complex (Use Motion Graphics)
- Scroll-driven orchestration
- Timeline sequencing
- Multiple overlapping effects
- Performance optimization critical
- Examples: scroll-pinned sections, hero animations, complex galleries

---

## 🎬 Real-World Examples

### Example 1: Case Study Card Stacking (Like Your Website)

**Problem:** Cards need to pin, stack, and reveal on scroll
**Solution Path:**
1. Read `frontend-design/motion-graphics.md` → GSAP ScrollTrigger section
2. Read `animation-guide.md` → Easing principles (ease-out for entry)
3. Implement with GSAP Timeline + ScrollTrigger
4. Optional: Use motion MCP for custom spring curves

**DON'T use:** framer-motion-basics (not designed for scroll pinning)

---

### Example 2: Button with Micro-Interaction

**Problem:** Button needs hover and tap feedback
**Solution Path:**
1. Read `framer-motion-basics` → Hover Effects section
2. Use `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}`
3. Optional: Check `animation-guide.md` for timing (50-100ms for instant feedback)

**DON'T use:** motion-graphics (overkill for simple button)

---

### Example 3: Hero Section with Parallax

**Problem:** Background elements move at different speeds on scroll
**Solution Path:**
1. Read `motion-graphics.md` → Scroll-Driven Animations section
2. Read `animation-guide.md` → Performance Principles
3. Implement with GSAP ScrollTrigger or Framer Motion `useScroll` + `useTransform`

---

## 🔄 Cross-References

| Skill File | Focus Area | When to Read |
|------------|-----------|--------------|
| **framer-motion-basics/SKILL.md** | Component micro-interactions | Simple hover/tap/entrance |
| **frontend-design/motion-graphics.md** | Advanced techniques (GSAP, Lottie, SVG) | Complex scroll/timeline |
| **frontend-design/animation-guide.md** | Timing psychology & principles | Deciding duration/easing |
| **Motion MCP Server** | Production spring/bounce curves | Need organic, premium feel |

---

## 📝 Quick Checklist

Before implementing any animation:

- [ ] Identified use case (simple/medium/complex)
- [ ] Selected appropriate skill file
- [ ] Read relevant sections (don't read entire files)
- [ ] Checked accessibility requirements
- [ ] Performance considerations noted

---

## 🎯 Agent Routing Rules

**For AI Agents:** When user asks about animation:

1. **Analyze complexity** of the request
2. **Route to appropriate skill:**
   - Simple component-level → `framer-motion-basics`
   - Scroll orchestration → `motion-graphics.md`
   - Timing/psychology questions → `animation-guide.md`
   - Spring curve generation → Motion MCP
3. **Reference this router** if user asks "which animation tool?"

---

> **Remember:** Don't read all animation files for every task. Use this router to pick the RIGHT skill for the job.
