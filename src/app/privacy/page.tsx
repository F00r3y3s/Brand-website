'use client';

import React from 'react';
import LegalPageWrapper from '@/components/LegalPageWrapper';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
    const { language } = useLanguage();

    return (
        <LegalPageWrapper>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-8 text-neutral-900">
                {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </h1>
            <div className="prose prose-lg prose-neutral max-w-none text-neutral-700 space-y-10">
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
        </LegalPageWrapper>
    );
}
