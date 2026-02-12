'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const teamMembers = [
  {
    name: "Dr. Meryem Hamidi",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    roleDescription: "Dr. Hamidi leads AINAR with a vision to merge sustainability with advanced intelligence."
  },
  {
    name: "James Chen",
    role: "Chief AI Architect",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    roleDescription: "James architects the neural frameworks that power our green AI solutions."
  },
  {
    name: "Sarah Al-Fayed",
    role: "Sustainability Lead",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop",
    roleDescription: "Sarah ensures every algorithm and strategy aligns with global eco-goals."
  },
  {
    name: "Marcus Thorn",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
    roleDescription: "Marcus crafts the visual language that communicates our mission to the world."
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1598550832205-d5b5fe4d0333?q=80&w=800&auto=format&fit=crop",
    roleDescription: "Elena orchestrates our global teams to deliver impact at scale."
  }
]

export default function Team() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <section
      id="team"
      className="py-32 bg-light relative overflow-hidden cursor-default"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-dark" />
        </svg>
      </div>

      <div className="max-w-[90vw] mx-auto relative z-10">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-display font-bold text-dark mb-6 tracking-tight leading-[0.92]">
              Core <br />
              <span className="block text-primary text-6xl md:text-8xl font-black not-italic tracking-tight leading-[0.92]">Team</span>
            </h2>
            <p className="text-xl font-light text-dark/70 max-w-xl">
              A multidisciplinary collective of minds dedicated to engineering the future.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative border-t border-dark/10 py-10 md:py-14 hover:px-4 transition-all duration-300 cursor-pointer overflow-visible"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 text-dark group-hover:text-primary transition-colors duration-300 gap-4">
                <h3 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out">
                  {member.name}
                </h3>
                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm md:text-lg font-mono uppercase tracking-widest opacity-60 group-hover:opacity-100">
                      {member.role}
                    </span>
                    <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2 group-hover:-translate-y-2 md:block hidden" />
                  </div>
                  <span className="text-sm font-light opacity-0 group-hover:opacity-70 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 max-w-xs text-right hidden md:block">
                    {member.roleDescription}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {hoveredMember === index && (
                  <motion.div
                    className="hidden lg:block absolute right-[13rem] xl:right-[16rem] top-1/2 -translate-y-1/2 w-[280px] h-[340px] pointer-events-none z-20 overflow-hidden shadow-2xl bg-white rounded-lg"
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      y: "-45%",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: "-50%",
                      transition: { duration: 0.35, ease: "easeOut" }
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      y: "-45%",
                      transition: { duration: 0.22, ease: "easeInOut" }
                    }}
                  >
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1, transition: { duration: 0.45, ease: "easeOut" } }}
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="border-t border-dark/10" />
        </div>
      </div>
    </section>
  )
}
