'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const teamMembers = [
  {
    name: "Dr. Meryem Hamidi",
    role: "Founder & CEO",
    image: "/members/Meryem-PH.webp",
    roleDescription: "Dr. Hamidi leads AINAR with a vision to merge sustainability with advanced intelligence."
  },
  {
    name: "Fatima Moussa Sy",
    role: "Assistant & Business Coordinator",
    image: "/members/Fatima-PH.webp",
    roleDescription: "Coordinates daily operations, communications, and executive follow-through across business initiatives."
  },
  {
    name: "Abdul Jabbar",
    role: "Lead IT / Technical Advisor",
    image: "/members/AJ.webp",
    roleDescription: "Leads IT and technical direction, advising on architecture, implementation quality, and delivery standards."
  },
  {
    name: "Syed Faruk Ahmed",
    role: "Senior Growth & Strategic Advisory Partner",
    image: "/members/Faruk.webp",
    roleDescription: "Drives growth strategy, strategic partnerships, and long-term advisory planning across markets."
  }
]

export default function Team() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <section
      id="team"
      className="h-screen min-h-[840px] bg-light relative overflow-hidden cursor-default pt-[8vh]"
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

      <div className="max-w-[90vw] mx-auto relative z-10 w-full">
        <div className="mb-4 md:mb-5 text-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-2 text-dark leading-none tracking-tight">
              Core{" "}
              <span className="text-primary [font-size:inherit] [line-height:inherit]">Team</span>
            </h2>
            <p className="text-[1.02rem] md:text-[1.32rem] font-medium text-dark/82 max-w-3xl mx-auto">
              Much talented, deciplined and dedicated members.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col mt-16 md:mt-20">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group relative border-t border-dark/10 py-[1.2rem] md:py-[1.45rem] hover:px-3 transition-all duration-300 cursor-pointer overflow-visible"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="relative z-10 text-dark group-hover:text-primary transition-colors duration-300 lg:pr-[23rem] xl:pr-[26rem]">
                <h3 className="text-[1.75rem] md:text-[2.1rem] lg:text-[2.45rem] font-display font-bold uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500 ease-out leading-[0.95]">
                  {member.name}
                </h3>
                <div className="mt-2 md:mt-3 flex flex-col gap-1.5">
                  <div className="inline-flex items-center gap-2.5 w-fit">
                    <span className="text-[13px] md:text-[1rem] font-mono uppercase tracking-[0.18em] opacity-85 group-hover:opacity-100">
                      {member.role}
                    </span>
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 block" />
                  </div>
                  <span className="text-[12px] md:text-[13px] font-light opacity-78 group-hover:opacity-96 transition-opacity duration-300 max-w-[42rem] text-left block leading-snug">
                    {member.roleDescription}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {hoveredMember === index && (
                  <motion.div
                    className="hidden lg:block absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 w-[190px] xl:w-[210px] h-[230px] xl:h-[260px] pointer-events-none z-20 overflow-hidden shadow-2xl bg-white rounded-lg"
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      y: "-45%",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: "-50%",
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      y: "-45%",
                      transition: { duration: 0.2, ease: "easeInOut" }
                    }}
                  >
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1, transition: { duration: 0.35, ease: "easeOut" } }}
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
