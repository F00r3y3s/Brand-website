import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  markers?: boolean;
}

export function useScrollAnimation(
  ref: React.RefObject<HTMLElement>,
  config: ScrollAnimationConfig = {}
) {
  const {
    trigger,
    start = 'top 80%',
    end = 'top 50%',
    scrub = 0.5,
    markers = false,
  } = config;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const triggerElement = trigger || element;

    gsap.from(element, {
      scrollTrigger: {
        trigger: triggerElement,
        start,
        end,
        scrub,
        markers,
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ref, trigger, start, end, scrub, markers]);
}

export function useParallax(
  ref: React.RefObject<HTMLElement>,
  distance: number = 50
) {
  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        scrub: true,
      },
      y: distance,
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ref, distance]);
}
