'use client';

import React, { useEffect, useRef } from 'react';

export default function MagneticCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | undefined>(undefined);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            // Smooth cursor following with easing
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

            if (cursorRef.current && cursorDotRef.current) {
                cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
                cursorDotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        requestRef.current = requestAnimationFrame(animate);

        // Add hover effects for interactive elements
        const handleMouseEnter = () => {
            if (cursorRef.current) {
                cursorRef.current.style.width = '60px';
                cursorRef.current.style.height = '60px';
                cursorRef.current.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            }
        };

        const handleMouseLeave = () => {
            if (cursorRef.current) {
                cursorRef.current.style.width = '40px';
                cursorRef.current.style.height = '40px';
                cursorRef.current.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            }
        };

        const interactiveElements = document.querySelectorAll('button, a, .btn-premium');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current !== undefined) {
                cancelAnimationFrame(requestRef.current);
            }
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <>
            {/* Outer cursor ring */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-screen transition-all duration-300 hidden md:block"
                style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* Inner cursor dot */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] hidden md:block"
                style={{
                    backgroundColor: '#D4AF37',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
                }}
            />
        </>
    );
}
