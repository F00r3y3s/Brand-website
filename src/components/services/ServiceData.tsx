import React from 'react';
import { Leaf, Brain, ShoppingBag, Search, Code, Globe, Sparkles } from 'lucide-react';

export interface Service {
    id: string;
    icon: React.ReactNode;
    tag: { en: string; ar: string };
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    visualType: 'image' | 'scanning' | 'liquid' | 'mesh';
    image?: string;
    accent: string;
}

export const servicesList: Service[] = [
    {
        id: 'sustainability',
        icon: <Leaf size={ 24} />,
    tag: { en: 'Strategic Advisory', ar: 'استشارات استراتيجية' },
    title: {
        en: 'Sustainability & AI',
        ar: 'الاستدامة والذكاء الاصطناعي',
    },
    description: {
        en: 'Integrating sustainable practices and custom AI frameworks into your corporate DNA.',
        ar: 'دمج الممارسات المستدامة وأطر الذكاء الاصطناعي المخصصة في جوهر مؤسستك.',
    },
    visualType: 'mesh',
    accent: '#C5A059',
  },
{
    id: 'strategy',
        icon: <Brain size={ 24 } />,
    tag: { en: 'Digital Evolution', ar: 'التطور الرقمي' },
    title: {
        en: 'Digital Strategy',
            ar: 'الاستراتيجية الرقمية',
    },
    description: {
        en: 'Synthesizing data-driven insights with creative foresight to navigate the digital desert.',
            ar: 'توليف الرؤى المدعومة بالبيانات مع الاستشراف الإبداعي للتنقل في الصحراء الرقمية.',
    },
    visualType: 'image',
        image: '/services/strategy.png',
            accent: '#C5A059',
  },
{
    id: 'rd',
        icon: <Search size={ 24 } />,
    tag: { en: 'Future Labs', ar: 'مختبرات المستقبل' },
    title: {
        en: 'Research & Development',
            ar: 'البحث والتطوير',
    },
    description: {
        en: 'Pioneering next-generation technologies that bridge the gap between concept and reality.',
            ar: 'ريادة تقنيات الجيل القادم التي تسد الفجوة بين المفهوم والواقع.',
    },
    visualType: 'scanning',
        accent: '#C5A059',
  },
{
    id: 'software',
        icon: <Code size={ 24 } />,
    tag: { en: 'Engineering', ar: 'الهندسة' },
    title: {
        en: 'Software Engineering',
            ar: 'هندسة البرمجيات',
    },
    description: {
        en: 'Architecture-first development focusing on liquid fluidity and robust scalability.',
            ar: 'التطوير القائم على المعمارية مع التركيز على السيولة وقابلية التوسع القوية.',
    },
    visualType: 'liquid',
        accent: '#C5A059',
  },
{
    id: 'ecommerce',
        icon: <ShoppingBag size={ 24 } />,
    tag: { en: 'Premium Trade', ar: 'تجارة متميزة' },
    title: {
        en: 'Luxury E-Commerce',
            ar: 'التجارة الإلكترونية الفاخرة',
    },
    description: {
        en: 'Crafting immersive digital storefronts that mirror the excellence of physical luxury.',
            ar: 'صياغة واجهات متاجر رقمية غامرة تعكس تميز الرفاهية المادية.',
    },
    visualType: 'image',
        image: '/services/ecommerce.png',
            accent: '#C5A059',
  },
];
