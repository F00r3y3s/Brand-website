'use client';

import React from 'react';
import LegalPageWrapper from '@/components/LegalPageWrapper';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
    const { language } = useLanguage();

    return (
        <LegalPageWrapper>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-8 text-neutral-900">
                {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
            </h1>
            <div className="prose prose-lg prose-neutral max-w-none text-neutral-700 space-y-10">
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
        </LegalPageWrapper>
    );
}
