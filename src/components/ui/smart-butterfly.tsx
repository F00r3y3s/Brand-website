'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

const ButterflyImage = ({ className, src }: { className?: string; src: string }) => (
  <img
    src={src}
    alt=""
    className={className}
    draggable={false}
  />
);

type SmartButterflyProps = {
  className?: string;
};

export function SmartButterfly({ className }: SmartButterflyProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const [isLanded, setIsLanded] = useState(false);
  const [imageSrc, setImageSrc] = useState('/butterfly-side.png');

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.src = '/butterfly-side.png';
    img.onload = () => {
      if (!active) return;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      const isBright = (r: number, g: number, b: number) => r > 200 && g > 200 && b > 200;
      const isDark = (r: number, g: number, b: number) => r < 80 && g < 80 && b < 80;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = (y * w + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a === 0) continue;

          if (isBright(r, g, b)) {
            const n1 = ((y - 1) * w + x) * 4;
            const n2 = ((y + 1) * w + x) * 4;
            const n3 = (y * w + (x - 1)) * 4;
            const n4 = (y * w + (x + 1)) * 4;

            const hasDarkNeighbor =
              isDark(data[n1], data[n1 + 1], data[n1 + 2]) ||
              isDark(data[n2], data[n2 + 1], data[n2 + 2]) ||
              isDark(data[n3], data[n3 + 1], data[n3 + 2]) ||
              isDark(data[n4], data[n4 + 1], data[n4 + 2]);

            if (!hasDarkNeighbor) {
              data[i + 3] = 0;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setImageSrc(canvas.toDataURL('image/png'));
    };

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const b = wrapperRef.current;
    if (!b) return;

    const prefersReduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(b, { x: 0, y: -10, scale: 1, rotation: 0 });
      return;
    }

    const random = gsap.utils.random;
    let active = false;
    let tween: gsap.core.Tween | null = null;
    let delay: gsap.core.Tween | null = null;
    let mounted = true;

    const safeSetLanded = (value: boolean) => {
      if (!mounted) return;
      setIsLanded(value);
    };

    const stop = () => {
      active = false;
      if (tween) tween.kill();
      if (delay) delay.kill();
      tween = null;
      delay = null;
    };

    const fly = () => {
      if (!active) return;
      safeSetLanded(false);
      const currentX = Number(gsap.getProperty(b, 'x')) || 0;
      const targetX = random(-28, 28);
      if (flipRef.current) {
        gsap.to(flipRef.current, {
          scaleX: targetX < currentX ? -1 : 1,
          duration: 0.6,
          ease: 'sine.inOut'
        });
      }
      tween = gsap.to(b, {
        x: targetX,
        y: random(-58, -28),
        rotation: random(-10, 10),
        scale: random(0.8, 1),
        duration: random(2, 3.5),
        ease: 'sine.inOut',
        onComplete: decide
      });
    };

    const land = () => {
      if (!active) return;
      tween = gsap.to(b, {
        x: 0,
        y: -10,
        rotation: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power2.out',
        onComplete: () => {
          if (flipRef.current) {
            gsap.set(flipRef.current, { scaleX: 1 });
          }
          safeSetLanded(true);
          delay = gsap.delayedCall(random(2, 4), () => {
            safeSetLanded(false);
            fly();
          });
        }
      });
    };

    const decide = () => {
      if (!active) return;
      Math.random() > 0.6 ? land() : fly();
    };

    const start = () => {
      if (active) return;
      active = true;
      gsap.set(b, { x: 0, y: -50, scale: 0.8, rotation: 0, transformOrigin: '50% 50%' });
      fly();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.2 }
    );

    observer.observe(b);

    return () => {
      mounted = false;
      stop();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cn('hero-butterfly-wrapper', className)} aria-hidden="true">
      <div ref={flipRef} className="hero-butterfly-flip">
        <ButterflyImage
          src={imageSrc}
          className={isLanded ? 'hero-butterfly-static' : 'hero-butterfly-flapping'}
        />
      </div>
    </div>
  );
}
