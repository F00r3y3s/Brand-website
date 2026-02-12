'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface KineticTextProps {
    text: string;
    className?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
}

export default function KineticText({
    text,
    className = '',
    stagger = 0.03,
    duration = 1.2,
    delay = 0,
}: KineticTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const chars = containerRef.current?.querySelectorAll('.kinetic-char') || [];

            gsap.fromTo(chars,
                {
                    opacity: 0,
                    scale: 0.9,
                    y: 80,
                    rotateX: -30,
                    filter: 'blur(10px)',
                    transformOrigin: '50% 50%',
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    stagger: {
                        amount: text.length * (stagger * 0.8),
                        from: 'start',
                    },
                    duration: duration * 0.7,
                    delay: delay,
                    ease: 'power3.out',
                    overwrite: true,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [text, stagger, duration, delay]);

    // Split text into words, then characters
    const words = text.split(' ');

    return (
        <div ref={containerRef} className={`${className} perspective-1000`}>
            <span className="sr-only">{text}</span>
            {words.map((word, wIndex) => (
                <span key={wIndex} className="inline-block whitespace-nowrap mr-[0.3em]">
                    {word.split('').map((char, cIndex) => (
                        <span
                            key={cIndex}
                            className="kinetic-char inline-block will-change-transform origin-bottom"
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </div>
    );
}

