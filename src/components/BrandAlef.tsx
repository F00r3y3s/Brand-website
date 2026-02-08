'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandAlef() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current || !svgRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial state
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgRef.current,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: false,
      },
    });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.inOut',
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        ref={svgRef}
        viewBox="0 0 200 300"
        className="w-32 h-48 md:w-48 md:h-72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Alef (ا) Character */}
        <path
          ref={pathRef}
          d="M 100 50 Q 120 80 120 150 Q 120 220 100 250"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        />

        {/* Decorative circles */}
        <circle cx="100" cy="40" r="8" className="text-gold/30" fill="currentColor" opacity="0.3" />
        <circle cx="100" cy="260" r="8" className="text-gold/30" fill="currentColor" opacity="0.3" />
      </svg>
    </div>
  );
}
