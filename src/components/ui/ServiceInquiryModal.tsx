'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceTitle: string;
    mainTitle?: string;
    enableServiceSelection?: boolean;
    availableServices?: { title: string }[];
}

export default function ServiceInquiryModal({
    isOpen,
    onClose,
    serviceTitle,
    mainTitle = "Build Whats Next",
    enableServiceSelection = false,
    availableServices = []
}: ServiceInquiryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        email: '',
        contactNumber: '',
        linkedin: '',
        message: '',
        selectedService: serviceTitle
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, selectedService: serviceTitle }));
        }
    }, [isOpen, serviceTitle]);

    useEffect(() => {
        if (!isOpen) return;

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onEscape);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onEscape);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);

        // Close after success
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
            setFormData({ name: '', organization: '', email: '', contactNumber: '', linkedin: '', message: '', selectedService: '' });
        }, 2000);
    };

    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md"
            />

            <div className="relative w-full max-w-2xl bg-gradient-to-b from-neutral-900/98 to-neutral-950 backdrop-blur-2xl border border-white/25 rounded-[2rem] shadow-[0_36px_72px_-18px_rgba(0,0,0,0.78)] overflow-hidden z-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(178,113,162,0.12),transparent_50%)]" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal via-plum to-teal opacity-60" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 text-neutral-400 hover:text-white transition-all rounded-full hover:bg-white/10 z-20"
                    aria-label="Close contact form"
                >
                    <X size={24} />
                </button>

                <div className="relative p-8 md:p-12">
                    {!isSuccess ? (
                        <>
                            <header className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                                        <Send className="text-teal" size={20} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-teal/80">Contact Form</span>
                                </div>
                                <h2 className="text-[0.95rem] md:text-base font-black uppercase tracking-[0.05em] text-white mb-4 leading-none">
                                    {mainTitle}
                                </h2>
                                <p className="text-neutral-100 text-base md:text-lg max-w-xl leading-relaxed">
                                    Tell us what you are building and we will follow up with a custom roadmap.
                                </p>
                            </header>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="rounded-2xl border border-white/25 bg-neutral-900/65 px-5 py-4">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-200 mb-1">
                                        Selected Service
                                    </p>
                                    {enableServiceSelection ? (
                                        <div className="relative">
                                            <select
                                                required
                                                value={formData.selectedService}
                                                onChange={e => setFormData({ ...formData, selectedService: e.target.value })}
                                                className="w-full bg-transparent text-white text-lg md:text-xl font-semibold leading-snug focus:outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-neutral-900 text-neutral-400">Select a service...</option>
                                                {availableServices.filter(s => !s.title.toLowerCase().includes('coming soon')).map((service, idx) => (
                                                    <option key={idx} value={service.title} className="bg-neutral-900 text-white">
                                                        {service.title}
                                                    </option>
                                                ))}
                                                <option value="Other" className="bg-neutral-900 text-white">Other</option>
                                            </select>
                                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={20} />
                                        </div>
                                    ) : (
                                        <p className="text-white text-lg md:text-xl font-semibold leading-snug drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
                                            {serviceTitle || 'General Inquiry'}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.16em] text-neutral-200 ml-1">Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.16em] text-neutral-200 ml-1">Organization</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.organization}
                                            onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder="Organization name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.16em] text-neutral-200 ml-1">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder="name@company.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.16em] text-neutral-200 ml-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            value={formData.contactNumber}
                                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder="+971 50 123 4567"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.16em] text-neutral-200 ml-1">LinkedIn</label>
                                    <input
                                        type="url"
                                        value={formData.linkedin}
                                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                        className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.16em] text-neutral-200 ml-1">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300 resize-none"
                                        placeholder="Tell us about your project goals, timeline, and what success looks like."
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full group relative bg-white overflow-hidden text-neutral-950 font-black text-base uppercase tracking-[0.08em] py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                                    >
                                        <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send'}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal to-teal/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10 group-hover:text-white transition-colors">{!isSubmitting && <Send size={16} />}</span>
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="py-16 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-teal/20 rounded-full flex items-center justify-center mb-8">
                                <Send className="text-teal" size={40} />
                            </div>
                            <h3 className="text-4xl font-black font-display text-white mb-3">Message Sent</h3>
                            <p className="text-neutral-400 text-base max-w-sm mx-auto leading-relaxed">
                                Thanks for reaching out. Our team will get back to you within 1 business day.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
