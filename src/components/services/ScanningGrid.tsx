'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ScanningGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scannerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Client-only random generation - fixes hydration error
    const [binaryValues, setBinaryValues] = useState<string[]>(
        Array(100).fill('0') // Server renders all zeros
    );

    useEffect(() => {
        // Generate random values ONLY on client
        setBinaryValues(Array.from({ length: 100 }, () => Math.random() > 0.5 ? '1' : '0'));
    }, []);

    useEffect(() => {
        if (!containerRef.current || !gridRef.current) return;

        const cells = gridRef.current.children;
        const ctx = gsap.context(() => {
            // Infinite Scanning Animation
            gsap.to(scannerRef.current, {
                top: '100%',
                duration: 3,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
            });

            // Randomized Cell Pulses
            Array.from(cells).forEach((cell) => {
                gsap.to(cell, {
                    opacity: 'random(0.05, 0.2)',
                    duration: 'random(1.5, 3)',
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random() * 2,
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-neutral-950/20">
            {/* Laser Scanner Bar */}
            <div
                ref={scannerRef}
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-10"
                style={{ boxShadow: '0 0 15px var(--color-gold)' }}
            />

            {/* High Density Grid */}
            <div
                ref={gridRef}
                className="grid grid-cols-10 grid-rows-10 h-full w-full opacity-30"
            >
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="border-[0.5px] border-gold/10 flex items-center justify-center"
                    >
                        {/* Binary-style bits appearing randomly */}
                        <span className="text-[6px] font-mono text-gold/20 hidden group-hover:block">
                            {binaryValues[i]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Narrative Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-none" />
        </div>
    );
}
