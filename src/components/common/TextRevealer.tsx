'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealerProps {
    text: string;
    className?: string;
    type?: 'chars' | 'words' | 'lines';
    stagger?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    style?: React.CSSProperties;
}

export default function TextRevealer({
    text,
    className = '',
    type = 'chars',
    stagger = 0.02,
    duration = 0.8,
    delay = 0,
    once = true,
    style = {},
}: TextRevealerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const items = containerRef.current?.querySelectorAll('.reveal-item');
            if (!items) return;

            gsap.fromTo(
                items,
                {
                    y: '100%',
                    opacity: 0,
                    skewY: 7,
                },
                {
                    y: '0%',
                    opacity: 1,
                    skewY: 0,
                    duration: duration,
                    stagger: stagger,
                    delay: delay,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        once: once,
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [text, type, stagger, duration, delay, once]);

    const renderContent = () => {
        if (type === 'chars') {
            return text.split('').map((char, i) => (
                <span key={i} className="inline-block align-bottom px-[0.02em]">
                    <span className="reveal-item inline-block">
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                </span>
            ));
        }

        if (type === 'words') {
            return text.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-[0.2em] align-bottom">
                    <span className="reveal-item inline-block">
                        {word}
                    </span>
                </span>
            ));
        }

        return (
            <span className="inline-block align-bottom">
                <span className="reveal-item inline-block">
                    {text}
                </span>
            </span>
        );
    };

    return (
        <div ref={containerRef} className={`${className} leading-tight py-2`} style={style}>
            {renderContent()}
        </div>
    );
}
