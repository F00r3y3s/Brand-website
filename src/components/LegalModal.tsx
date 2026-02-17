'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'terms' | 'privacy';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
    const { language } = useLanguage();
    const contentRef = useRef<HTMLDivElement>(null);
    const footerObserverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';

        // Observer for auto-close when scrolling to footer within modal
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Footer is visible - auto-close
                        setTimeout(() => {
                            onClose();
                        }, 300);
                    }
                });
            },
            {
                threshold: 0.1,
                root: contentRef.current,
            }
        );

        if (footerObserverRef.current) {
            observer.observe(footerObserverRef.current);
        }

        return () => {
            document.body.style.overflow = '';
            if (footerObserverRef.current) {
                observer.unobserve(footerObserverRef.current);
            }
        };
    }, [isOpen, onClose]);

    // Prevent background scroll when clicking/scrolling on modal
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const termsContent = (
        <div className="space-y-10">
            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '1. Acceptance of Terms' : '١. قبول الشروط'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'By accessing or using the AINAR website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
                        : 'من خلال الدخول إلى موقع اينار أو استخدامه، فإنك توافق على الالتزام بشروط الخدمة هذه وجميع القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، فيُحظر عليك استخدام هذا الموقع أو الدخول إليه.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '2. Use License' : '٢. رخصة الاستخدام'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'Permission is granted to temporarily download one copy of the materials on AINAR\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
                        : 'يُمنح الإذن لتنزيل نسخة واحدة مؤقتًا من المواد الموجودة على موقع اينار للمشاهدة الشخصية غير التجارية والعابرة فقط. هذا هو منح ترخيص، وليس نقل ملكية.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '3. Disclaimer' : '٣. إخلاء المسؤولية'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'The materials on AINAR\'s website are provided on an "as is" basis. AINAR makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.'
                        : 'يتم تقديم المواد الموجودة على موقع اينار على أساس "كما هي". لا تقدم اينار أي ضمانات، صريحة أو ضمنية، وهي تخلي مسؤوليتها بموجب ذلك وتنفي جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط الرواج.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '4. Limitations' : '٤. القيود'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'In no event shall AINAR or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AINAR\'s website.'
                        : 'لا تتحمل اينار أو موردوها بأي حال من الأحوال المسؤولية عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناجمة عن فقدان البيانات أو الربح، أو بسبب انقطاع العمل) الناشئة عن استخدام أو عدم القدرة على استخدام المواد الموجودة على موقع اينار.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '5. Governing Law' : '٥. القانون الحاكم'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'These terms and conditions are governed by and construed in accordance with the laws of the United Arab Emirates and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.'
                        : 'تخضع هذه الشروط والأحكام وتفسر وفقًا لقوانين دولة الإمارات العربية المتحدة، وتخضع بشكل غير قابل للإلغاء للاختصاص الحصري للمحاكم في تلك الدولة أو الموقع.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '6. User Conduct' : '٦. سلوك المستخدم'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'Users are prohibited from using the site to transmit any material that is unlawful, harmful, or otherwise objectionable. AINAR reserves the right to terminate access to the site for any reason, including violation of these terms.'
                        : 'يُحظر على المستخدمين استخدام الموقع لنقل أي مادة غير قانونية أو ضارة أو غير مقبولة بأي شكل آخر. تحتفظ اينار بالحق في إنهاء الوصول إلى الموقع لأي سبب، بما في ذلك انتهاك هذه الشروط.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '7. Contact' : '٧. الاتصال'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'For any questions regarding these Terms of Service, please reach out to us at hello@ainar.ae. Our team will respond to your inquiries as promptly as possible during standard business hours in the UAE.'
                        : 'لأي أسئلة بخصوص شروط الخدمة هذه، يرجى التواصل معنا على hello@ainar.ae. سيرد فريقنا على استفساراتكم في أقرب وقت ممكن خلال ساعات العمل الرسمية في دولة الإمارات العربية المتحدة.'}
                </p>
            </section>
        </div>
    );

    const privacyContent = (
        <div className="space-y-10">
            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '1. Introduction' : '١. مقدمة'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'Welcome to AINAR (FZE). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.'
                        : 'مرحبًا بكم في اينار. نحن نقدر خصوصيتكم ونلتزم بحماية بياناتكم الشخصية. تشرح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتكم عند زيارة موقعنا.'}
                </p>
                <p className="mt-4">
                    {language === 'en'
                        ? 'By using our services, you agree to the practices described in this policy. We ensure that all data processing is conducted in compliance with applicable UAE laws and international data protection standards.'
                        : 'من خلال استخدام خدماتنا، فإنك توافق على الممارسات الموضحة في هذه السياسة. نحن نضمن إجراء جميع عمليات معالجة البيانات وفقًا للقوانين المعمول بها في الإمارات ومعايير حماية البيانات الدولية.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '2. Data Collection' : '٢. جمع البيانات'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'We may collect various types of information, including but not limited to: contact information (name, email), usage data, and cookies. This data helps us provide a better experience and improve our services.'
                        : 'قد نجمع أنواعًا مختلفة من المعلومات، بما في ذلك على سبيل المثال لا الحصر: معلومات الاتصال (الاسم، البريد الإلكتروني)، بيانات الاستخدام، وملفات تعريف الارتباط. تساعدنا هذه البيانات في تقديم تجربة أفضل وتحسين خدماتنا.'}
                </p>
                <p className="mt-4">
                    {language === 'en'
                        ? 'Specific data collected during inquiry forms is used solely for the purpose of responding to your requests and providing the consultancy services you seek.'
                        : 'تُستخدم البيانات المحددة التي يتم جمعها أثناء نماذج الاستفسار فقط لغرض الرد على طلباتكم وتقديم الخدمات الاستشارية التي تبحثون عنها.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '3. Data Usage & Protection' : '٣. استخدام وحماية البيانات'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'Your data is used to personalize your experience, process transactions, and send periodic emails. We implement a variety of security measures to maintain the safety of your personal information.'
                        : 'تُستخدم بياناتكم لتخصيص تجربتكم، ومعالجة المعاملات، وإرسال رسائل بريد إلكتروني دورية. نحن ننفذ مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتكم الشخصية.'}
                </p>
                <p className="mt-4">
                    {language === 'en'
                        ? 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as required by law.'
                        : 'نحن لا نبيع أو نتاجر أو ننقل معلومات تعريفك الشخصية إلى أطراف خارجية إلا بموجب القانون.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '4. Cookies' : '٤. ملفات تعريف الارتباط'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'Our website uses cookies to enhance navigation, analyze site usage, and assist in our marketing efforts. You can choose to disable cookies through your browser settings.'
                        : 'يستخدم موقعنا ملفات تعريف الارتباط لتحسين التنقل وتحليل استخدام الموقع والمساعدة في جهودنا التسويقية. يمكنك اختيار تعطيل ملفات تعريف الارتباط من خلال إعدادات متصفحك.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '5. Compliance' : '٥. الامتثال'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'This policy is designed to align with the UAE Data Protection Law and GDPR where applicable. We regularly review our policies to ensure continued compliance with global standards.'
                        : 'تم تصميم هذه السياسة لتتماشى مع قانون حماية البيانات الإماراتي واللائحة العامة لحماية البيانات (GDPR) حيثما ينطبق ذلك. نحن نراجع سياساتنا بانتظام لضمان استمرار الامتثال للمعايير العالمية.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '6. Contact Us' : '٦. اتصل بنا'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'If you have any questions regarding this Privacy Policy, you may contact us via email at hello@ainar.ae.'
                        : 'إذا كان لديكم أي أسئلة بخصوص سياسة الخصوصية هذه، يمكنكم الاتصال بنا عبر البريد الإلكتروني على hello@ainar.ae.'}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {language === 'en' ? '7. Changes to Policy' : '٧. التغييرات في السياسة'}
                </h2>
                <p>
                    {language === 'en'
                        ? 'We reserve the right to modify this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we are helping to protect the personal information we collect.'
                        : 'نحن نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تاريخ مراجعة محدث. نحن نشجعكم على مراجعة هذه السياسة بشكل دوري للبقاء على اطلاع بكيفية مساعدتنا في حماية المعلومات الشخصية التي نجمعها.'}
                </p>
            </section>
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full h-full max-w-4xl max-h-[90vh] m-4 bg-cream rounded-2xl shadow-2xl flex flex-col"
                onClick={handleModalClick}
            >
                {/* Header with close button */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
                    <h1 className="text-3xl md:text-4xl font-display font-black text-neutral-900">
                        {type === 'terms'
                            ? (language === 'en' ? 'Terms of Service' : 'شروط الخدمة')
                            : (language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية')}
                    </h1>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-110 transition-all duration-300"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable content */}
                <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-6"
                    style={{ overscrollBehavior: 'contain' }}
                >
                    <div className="prose prose-lg prose-neutral max-w-none text-neutral-700">
                        {type === 'terms' ? termsContent : privacyContent}
                    </div>

                    {/* Footer observer target */}
                    <div ref={footerObserverRef} className="h-4 mt-8" />
                </div>
            </div>
        </div>
    );
}
