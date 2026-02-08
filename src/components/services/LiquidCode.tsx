'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LiquidCode() {
    const containerRef = useRef<HTMLDivElement>(null);
    const blobsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !blobsRef.current) return;

        const blobs = blobsRef.current.children;
        const ctx = gsap.context(() => {
            // Animate blobs in organic floating loops
            Array.from(blobs).forEach((blob, i) => {
                gsap.to(blob, {
                    x: `random(-40, 40)`,
                    y: `random(-40, 40)`,
                    rotation: `random(-180, 180)`,
                    scale: `random(0.8, 1.2)`,
                    duration: `random(4, 8)`,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: i * 0.5,
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-neutral-950/40">
            {/* SVG Gooey Filter */}
            <svg className="hidden">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* Atmospheric Code Fragments */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="flex flex-col gap-4 font-mono text-[10px] text-gold/30">
                    <div className="animate-pulse">const agency = new Ainar();</div>
                    <div className="animate-pulse delay-75">while(vision) &#123; create(); &#125;</div>
                    <div className="animate-pulse delay-150">export default Future;</div>
                </div>
            </div>

            {/* Blobs for the Liquid Effect */}
            <div
                ref={blobsRef}
                className="absolute inset-0 flex items-center justify-center opacity-30"
                style={{ filter: 'url(#goo)' }}
            >
                <div className="w-32 h-32 rounded-full bg-gold/40 blur-xl" />
                <div className="w-24 h-24 rounded-full bg-gold/30 blur-xl -translate-x-12" />
                <div className="w-28 h-28 rounded-full bg-gold/20 blur-xl translate-y-12" />
                <div className="w-20 h-20 rounded-full bg-gold/50 blur-xl translate-x-16" />
            </div>
        </div>
    );
}
