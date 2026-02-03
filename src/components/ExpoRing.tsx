'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ExpoRing() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Rotate the entire container slowly
            gsap.to('.ring-container', {
                rotation: 360,
                duration: 40,
                repeat: -1,
                ease: 'none',
            });

            // Pulse the circles individually
            gsap.to('.ring-circle', {
                strokeDashoffset: 0,
                duration: 2,
                stagger: {
                    each: 0.1,
                    from: 'center',
                },
                ease: 'power2.inOut',
            });

            // Subtel breathing effect
            gsap.to('.ring-container', {
                scale: 1.05,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none opacity-40">
            <div className="ring-container relative w-full h-full flex items-center justify-center">
                {/* Simplified Expo 2020 Logo Lattice */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="expo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--brand-gold)" />
                            <stop offset="50%" stopColor="#FFF" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--brand-teal)" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Main concentric pattern */}
                    {[...Array(24)].map((_, i) => (
                        <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={15 + i * 1.5}
                            fill="none"
                            stroke="url(#expo-gold)"
                            strokeWidth="0.1"
                            strokeDasharray="1 3"
                            className="ring-circle opacity-30"
                        />
                    ))}

                    {/* Geometric petals */}
                    {[...Array(40)].map((_, i) => (
                        <circle
                            key={`petal-${i}`}
                            cx={50 + 30 * Math.cos((i * Math.PI * 2) / 40)}
                            cy={50 + 30 * Math.sin((i * Math.PI * 2) / 40)}
                            r="8"
                            fill="none"
                            stroke="url(#expo-gold)"
                            strokeWidth="0.15"
                            className="ring-circle opacity-40"
                            filter="url(#glow)"
                        />
                    ))}

                    {/* Inner Core */}
                    <circle cx="50" cy="50" r="5" fill="none" stroke="var(--brand-gold)" strokeWidth="0.2" className="animate-pulse" />
                </svg>
            </div>

            {/* Ambient center light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-gold/20 blur-3xl rounded-full" />
        </div>
    );
}
