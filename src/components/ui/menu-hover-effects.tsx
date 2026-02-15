'use client';

import React from 'react';
import { FileDown } from 'lucide-react';

interface MenuItem {
    name: string;
    expandedName?: string;
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
                        {item.isDownload ? (
                            <a
                                href={item.href}
                                download="AINAR-FZE-Brand-Profile.pdf"
                                className="relative flex h-11 w-[8.8rem] items-center overflow-hidden rounded-full border border-neutral-900/20 bg-neutral-900 px-4 text-white shadow-[0_8px_22px_rgba(0,0,0,0.14)] transition-[width,box-shadow,transform] duration-500 ease-out hover:w-[16.8rem] hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
                            >
                                <FileDown size={16} className="relative z-10 shrink-0" />
                                <span className="relative ml-2 block h-5 min-w-0 flex-1">
                                    <span className="absolute left-0 top-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-350 ease-out group-hover:translate-y-[-6px] group-hover:opacity-0">
                                        {item.name}
                                    </span>
                                    <span className="absolute left-0 top-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] text-white/95 opacity-0 translate-y-[6px] transition-all duration-350 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                                        {item.expandedName ?? item.name}
                                    </span>
                                </span>
                                <span className="absolute inset-0 rounded-full ring-1 ring-white/0 transition-all duration-500 group-hover:ring-white/20" />
                            </a>
                        ) : (
                            <a
                                href={item.href}
                                className="relative block px-4 py-2 overflow-hidden"
                                onClick={(e) => {
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
                                <span className="
                relative z-10 block uppercase
                font-sans font-semibold text-sm tracking-widest
                transition-colors duration-300
                text-neutral-600 group-hover:text-white
              ">
                                    {item.name}
                                </span>

                                {/* Animated Background & Borders */}
                                <>
                                    <span className="absolute inset-0 border-y-2 border-neutral-900 scale-y-0 transition-transform duration-300 origin-center group-hover:scale-y-100" />
                                    <span className="absolute inset-0 bg-neutral-900 scale-y-0 transition-transform duration-300 origin-top delay-75 group-hover:scale-y-100" />
                                </>
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
