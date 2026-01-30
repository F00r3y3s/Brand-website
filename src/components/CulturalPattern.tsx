'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CulturalPattern({ className = '' }: { className?: string }) {
    const patternRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!patternRef.current) return;

        const ctx = gsap.context(() => {
            // Gentle pulsing animation for the pattern lines
            gsap.to(patternRef.current, {
                opacity: 0.15,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            // Subtle rotation of the entire pattern layer
            gsap.to(patternRef.current, {
                rotation: 360,
                duration: 240, // Very slow rotation
                repeat: -1,
                ease: 'none',
                transformOrigin: '50% 50%',
            });
        }, patternRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10 mix-blend-overlay ${className}`}>
            <svg
                ref={patternRef}
                className="w-full h-full text-gold"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="mashrabiya-pattern"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Geometric Mashrabiya-inspired lattice */}
                        <path
                            d="M10 0 L20 10 L10 20 L0 10 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.2"
                            strokeOpacity="0.8"
                        />
                        <circle cx="10" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="0.2" />
                        <path
                            d="M0 0 L5 5 M15 5 L20 0 M20 20 L15 15 M5 15 L0 20"
                            stroke="currentColor"
                            strokeWidth="0.2"
                        />
                        <rect x="9" y="9" width="2" height="2" transform="rotate(45 10 10)" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mashrabiya-pattern)" />
            </svg>

            {/* Vignette gradients to fade edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-transparent to-dark-primary" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-primary via-transparent to-dark-primary" />
        </div>
    );
}
