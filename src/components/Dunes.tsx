'use client';

import React from 'react';

export default function Dunes() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 400C150 350 300 450 450 400C600 350 750 250 900 300C1050 350 1200 450 1440 400V800H0V400Z"
                    fill="var(--brand-gold)"
                />
                <path
                    d="M0 500C200 450 400 550 600 500C800 450 1000 350 1200 400C1400 450 1500 550 1600 500V800H0V500Z"
                    fill="var(--brand-teal)"
                />
                <path
                    d="M-200 650C50 600 300 700 550 650C800 600 1050 500 1300 550C1550 600 1700 700 1850 650V800H-200V650Z"
                    fill="var(--brand-plum)"
                />
            </svg>
            {/* Softening blur */}
            <div className="absolute inset-0 backdrop-blur-[100px]" />
        </div>
    );
}
