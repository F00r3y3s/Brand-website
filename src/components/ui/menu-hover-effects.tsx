'use client';

import React, { useState } from 'react';

interface MenuItem {
    name: string;
    href: string;
    isDownload?: boolean;
}

interface NavMenuProps {
    items: MenuItem[];
}

export default function NavMenu({ items }: NavMenuProps) {
    return (
        <nav className="relative flex items-center justify-center">
            <ul className="flex flex-row items-center gap-6 lg:gap-8">
                {items.map((item, index) => (
                    <li key={index} className="list-none relative group">
                        <a
                            href={item.href}
                            {...(item.isDownload ? { download: 'AINAR-FZE-Brand-Profile.pdf' } : {})}
                            className={`relative block px-4 py-2 overflow-hidden ${item.isDownload ? 'bg-neutral-900' : ''}`}
                            onClick={(e) => {
                                if (item.isDownload) return; // let the browser handle the download
                                if (item.href.startsWith('#')) {
                                    e.preventDefault();
                                    const target = document.querySelector(item.href);
                                    if (target) {
                                        target.scrollIntoView({ behavior: 'smooth' });
                                    } else if (item.href === '#top') {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }
                            }}
                        >
                            {/* Link text */}
                            <span className={`
                relative z-10 block uppercase
                font-sans font-semibold text-sm tracking-widest
                transition-colors duration-300
                ${item.isDownload
                                    ? 'text-white group-hover:text-neutral-900'
                                    : 'text-neutral-600 group-hover:text-white'}
              `}>
                                {item.name}
                            </span>

                            {/* Animated Background & Borders */}
                            {item.isDownload ? (
                                <>
                                    {/* White borders slide in on hover */}
                                    <span className="absolute inset-0 border-y-2 border-white scale-y-0 transition-transform duration-300 origin-center group-hover:scale-y-100" />
                                    {/* White bg slides in on hover, covering the static black bg */}
                                    <span className="absolute inset-0 bg-white scale-y-0 transition-transform duration-300 origin-top delay-75 group-hover:scale-y-100" />
                                </>
                            ) : (
                                <>
                                    <span className="absolute inset-0 border-y-2 border-neutral-900 scale-y-0 transition-transform duration-300 origin-center group-hover:scale-y-100" />
                                    <span className="absolute inset-0 bg-neutral-900 scale-y-0 transition-transform duration-300 origin-top delay-75 group-hover:scale-y-100" />
                                </>
                            )}

                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
