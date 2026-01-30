'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function FloatingCTA() {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past Hero (approx 800px)
            if (window.scrollY > 800) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setIsExpanded(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
                    {/* Expanded Menu */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-64 mb-2 origin-bottom-right"
                            >
                                <div className="flex flex-col gap-3">
                                    <Link href="/contact" className="p-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:bg-green-400 group-hover:shadow-[0_0_10px_#4ade80]" />
                                        <span className="text-white text-sm font-medium">
                                            {language === 'en' ? 'Start a Project' : 'ابدأ مشروعاً'}
                                        </span>
                                    </Link>
                                    <Link href="/careers" className="p-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-gold group-hover:bg-yellow-300 group-hover:shadow-[0_0_10px_#D4AF37]" />
                                        <span className="text-white text-sm font-medium">
                                            {language === 'en' ? 'Join the Team' : 'انضم للفريق'}
                                        </span>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Toggles */}
                    <div className="flex items-center gap-4">
                        {/* Text Label (Desktop) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="hidden md:block bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                        >
                            <span className="text-xs font-bold text-white uppercase tracking-widest">
                                {language === 'en' ? 'Get in Touch' : 'تواصل معنا'}
                            </span>
                        </motion.div>

                        {/* Button */}
                        <motion.button
                            onClick={() => setIsExpanded(!isExpanded)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 border border-white/10 ${isExpanded ? 'bg-white text-black' : 'bg-black text-gold border-gold/50'}`}
                        >
                            {isExpanded ? <X size={24} /> : <MessageCircle size={24} />}
                        </motion.button>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
