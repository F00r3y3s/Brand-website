'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function UAESymbolsBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [symbols, setSymbols] = useState<Array<{ id: number, top: string, left: string, maskPos: string, size: number, delay: number }>>([]);

    useEffect(() => {
        // Restrict to left side (0-40%) to avoid overlap with hero image
        // Grid-like positions but randomized within left zones
        const xPos = [5, 15, 25, 35];
        const yPos = [10, 30, 50, 70, 90];

        // Reduce count to 6 to ensure only 3-4 are visible at max
        const newSymbols = Array.from({ length: 6 }).map((_, i) => {
            const randomX = xPos[Math.floor(Math.random() * xPos.length)];
            const randomY = yPos[Math.floor(Math.random() * yPos.length)];

            // Add some jitter to grid positions
            const jitterX = (Math.random() - 0.5) * 5;
            const jitterY = (Math.random() - 0.5) * 5;

            return {
                id: i,
                top: `${randomY + jitterY}%`,
                left: `${randomX + jitterX}%`,
                maskPos: `${Math.floor(Math.random() * 100)}% ${Math.floor(Math.random() * 100)}%`, // Random symbol from sprite
                size: Math.random() * 50 + 90, // Larger size: 90px - 140px
                delay: Math.random() * 4, // Spread out start times
            };
        });
        setSymbols(newSymbols);
    }, []);

    useEffect(() => {
        if (!symbols.length || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray('.uae-symbol');

            items.forEach((item: any, i) => {
                const delay = symbols[i].delay;

                // Set initial state
                gsap.set(item, { opacity: 0, scale: 0.8 });

                // Breathe Animation
                // Fade In -> Hold -> Fade Out -> Wait -> Repeat
                const tl = gsap.timeline({
                    repeat: -1,
                    delay: delay,
                    repeatDelay: Math.random() * 3 + 2, // Random wait 2-5s between cycles
                });

                tl.to(item, {
                    opacity: 0.8, // Higher opacity for visibility
                    scale: 1,
                    duration: 2.5,
                    ease: "power2.inOut",
                })
                    .to(item, {
                        opacity: 0,
                        scale: 1.1, // Continue growing slightly while fading out
                        duration: 2.5,
                        ease: "power2.inOut",
                    }, ">-0.5"); // Overlap slightly for smooth transition

                // Continuous subtle floating (independent of opacity)
                gsap.to(item, {
                    y: '-=30',
                    duration: 8 + Math.random() * 5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [symbols]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            {symbols.map((symbol) => (
                <div
                    key={symbol.id}
                    className="uae-symbol absolute opacity-0"
                    style={{
                        top: symbol.top,
                        left: symbol.left,
                        width: `${symbol.size}px`,
                        height: `${symbol.size}px`,
                        backgroundImage: 'url(/uae-symbols.png)',
                        backgroundSize: '500% 400%', // 5 columns, 4 rows
                        backgroundPosition: symbol.maskPos,
                        backgroundRepeat: 'no-repeat',
                        mixBlendMode: 'multiply', // This removes the white background of the icons
                        filter: 'contrast(1.2) brightness(1.1)', // Clean up any artifacts
                        // Opacity is properly handled by GSAP now
                    }}
                />
            ))}

            {/* Soft Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cream/40 via-transparent to-cream/40" />
        </div>
    );
}
