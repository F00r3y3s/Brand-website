'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

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
    mainTitle,
    enableServiceSelection = false,
    availableServices = []
}: ServiceInquiryModalProps) {
    const { language, isRTL, t } = useLanguage();
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
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, selectedService: serviceTitle }));
            setIsError(false);
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
        setIsError(false);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'inquiry',
                    data: formData
                }),
            });

            if (!response.ok) throw new Error('Failed to send inquiry');

            setIsSubmitting(false);
            setIsSuccess(true);

            // Close after success
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setFormData({ name: '', organization: '', email: '', contactNumber: '', linkedin: '', message: '', selectedService: serviceTitle });
            }, 2000);
        } catch (error) {
            console.error('Submission error:', error);
            setIsSubmitting(false);
            setIsError(true);
        }
    };

    if (!isOpen || typeof document === 'undefined') return null;

    const resolvedMainTitle = mainTitle || (language === 'en' ? "Build What's Next" : 'ابنِ ما هو قادم');

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md"
            />

            <div
                dir={isRTL ? 'rtl' : 'ltr'}
                className="relative w-full max-w-2xl bg-gradient-to-b from-neutral-900/98 to-neutral-950 backdrop-blur-2xl border border-white/25 rounded-[2rem] shadow-[0_36px_72px_-18px_rgba(0,0,0,0.78)] overflow-hidden z-10"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(178,113,162,0.12),transparent_50%)]" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal via-plum to-teal opacity-60" />

                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-6 p-3 text-neutral-400 hover:text-white transition-all rounded-full hover:bg-white/10 z-20",
                        isRTL ? "left-6" : "right-6"
                    )}
                    aria-label={language === 'en' ? 'Close contact form' : 'إغلاق نموذج التواصل'}
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
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-teal/80">
                                        {t('modal.contact_form')}
                                    </span>
                                </div>
                                <h2 className="text-[0.95rem] md:text-base font-black uppercase tracking-[0.05em] text-white mb-4 leading-none">
                                    {resolvedMainTitle}
                                </h2>
                                <p className="text-neutral-100 text-base md:text-lg max-w-xl leading-relaxed">
                                    {t('modal.subtitle')}
                                </p>
                            </header>

                            {/* Error banner */}
                            {isError && (
                                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3.5 text-red-300">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <span className="text-sm font-medium">{t('modal.error')}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="rounded-2xl border border-white/25 bg-neutral-900/65 px-5 py-4">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-200 mb-1">
                                        {t('modal.selected_service')}
                                    </p>
                                    {enableServiceSelection ? (
                                        <div className="relative">
                                            <select
                                                required
                                                value={formData.selectedService}
                                                onChange={e => setFormData({ ...formData, selectedService: e.target.value })}
                                                className="w-full bg-transparent text-white text-lg md:text-xl font-semibold leading-snug focus:outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-neutral-900 text-neutral-400">{t('modal.select_placeholder')}</option>
                                                {availableServices.filter(s => !s.title.toLowerCase().includes('coming soon')).map((service, idx) => (
                                                    <option key={idx} value={service.title} className="bg-neutral-900 text-white">
                                                        {service.title}
                                                    </option>
                                                ))}
                                                <option value="Other" className="bg-neutral-900 text-white">{t('modal.other')}</option>
                                            </select>
                                            <ChevronDown className={cn(
                                                "absolute top-1/2 -translate-y-1/2 text-white pointer-events-none",
                                                isRTL ? "left-0" : "right-0"
                                            )} size={20} />
                                        </div>
                                    ) : (
                                        <p className="text-white text-lg md:text-xl font-semibold leading-snug drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
                                            {serviceTitle || t('modal.general_inquiry')}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={cn("text-xs font-black uppercase tracking-[0.16em] text-neutral-200", isRTL ? "mr-1" : "ml-1")}>{t('modal.name')}</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder={t('modal.name_placeholder')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={cn("text-xs font-black uppercase tracking-[0.16em] text-neutral-200", isRTL ? "mr-1" : "ml-1")}>{t('modal.organization')}</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.organization}
                                            onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder={t('modal.organization_placeholder')}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={cn("text-xs font-black uppercase tracking-[0.16em] text-neutral-200", isRTL ? "mr-1" : "ml-1")}>{t('modal.email')}</label>
                                        <input
                                            required
                                            dir="ltr"
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder={t('modal.email_placeholder')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={cn("text-xs font-black uppercase tracking-[0.16em] text-neutral-200", isRTL ? "mr-1" : "ml-1")}>{t('modal.contact_number')}</label>
                                        <input
                                            dir="ltr"
                                            type="tel"
                                            value={formData.contactNumber}
                                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                            className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                            placeholder={t('modal.contact_number_placeholder')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={cn("text-xs font-black uppercase tracking-[0.16em] text-neutral-200", isRTL ? "mr-1" : "ml-1")}>{t('modal.linkedin')}</label>
                                    <input
                                        dir="ltr"
                                        type="url"
                                        value={formData.linkedin}
                                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                        className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300"
                                        placeholder={t('modal.linkedin_placeholder')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className={cn("text-xs font-black uppercase tracking-[0.16em] text-neutral-200", isRTL ? "mr-1" : "ml-1")}>{t('modal.message')}</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white/14 border border-white/35 rounded-2xl px-5 py-4 text-base text-white focus:outline-none focus:border-teal/70 focus:bg-white/18 transition-all placeholder:text-neutral-300 resize-none"
                                        placeholder={t('modal.message_placeholder')}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full group relative bg-white overflow-hidden text-neutral-950 font-black text-base uppercase tracking-[0.08em] py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                                    >
                                        <span className="relative z-10">{isSubmitting ? t('modal.sending') : t('modal.send')}</span>
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
                            <h3 className="text-4xl font-black font-display text-white mb-3">{t('modal.success_title')}</h3>
                            <p className="text-neutral-400 text-base max-w-sm mx-auto leading-relaxed">
                                {t('modal.success_body')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
