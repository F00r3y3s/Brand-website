'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LegalPageWrapperProps {
    children: React.ReactNode;
}

export default function LegalPageWrapper({ children }: LegalPageWrapperProps) {
    const router = useRouter();
    const footerObserverRef = useRef<HTMLDivElement>(null);
    const [showCloseButton, setShowCloseButton] = useState(true);

    const navigateToFooter = () => {
        // Navigate to home page first
        router.push('/');

        // After navigation, scroll to footer
        setTimeout(() => {
            const footerElement = document.getElementById('footer');
            if (footerElement) {
                footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Footer is visible - auto-close the page and navigate to footer
                        setTimeout(() => {
                            navigateToFooter();
                        }, 300);
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of footer is visible
                rootMargin: '0px'
            }
        );

        if (footerObserverRef.current) {
            observer.observe(footerObserverRef.current);
        }

        return () => {
            if (footerObserverRef.current) {
                observer.unobserve(footerObserverRef.current);
            }
        };
    }, [router]);

    const handleClose = () => {
        navigateToFooter();
    };

    return (
        <div className="bg-cream min-h-screen flex flex-col relative">
            <Header />

            {/* Fixed Close Button */}
            {showCloseButton && (
                <button
                    onClick={handleClose}
                    className="fixed top-24 right-6 md:right-12 z-50 w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-110 transition-all duration-300 shadow-lg"
                    aria-label="Close and return to footer"
                >
                    <X size={24} />
                </button>
            )}

            <main className="flex-1 pt-32 pb-20 px-6 max-w-4xl mx-auto">
                {children}
            </main>

            {/* Footer with Observer Target */}
            <div ref={footerObserverRef}>
                <Footer />
            </div>
        </div>
    );
}
