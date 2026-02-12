"use client";

import * as React from "react";

interface ProjectData {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
}

export const PROJECT_DATA: ProjectData[] = [
  {
    title: "Redroom Gesture 14",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    category: "Concept Series",
    year: "2025",
    description: "Expressive motion study",
  },
  {
    title: "Shadowwear 6AM",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    category: "Photography",
    year: "2024",
    description: "Urban portrait series",
  },
  {
    title: "Blur Formation 03",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop",
    category: "Kinetic Study",
    year: "2024",
    description: "Motion blur experiment",
  },
  {
    title: "Sunglass Operator",
    image:
      "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=1887&auto=format&fit=crop",
    category: "Editorial Motion",
    year: "2023",
    description: "Fashion editorial piece",
  },
  {
    title: "Azure Figure 5",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1896&auto=format&fit=crop",
    category: "Visual Research",
    year: "2024",
    description: "Color theory exploration",
  },
];

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

// Utility functions
const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const getProjectData = (index: number) => {
  const i =
    ((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) %
    PROJECT_DATA.length;
  return PROJECT_DATA[i];
};

const getProjectNumber = (index: number) => {
  return (
    ((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) %
    PROJECT_DATA.length +
    1
  )
    .toString()
    .padStart(2, "0");
};

export interface ArgentLoopInfiniteSliderProps {
  activeIndex?: number;
}

export function Component({ activeIndex }: ArgentLoopInfiniteSliderProps) {
  const [visibleRange, setVisibleRange] = React.useState({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  });

  // Refs for state that changes frequently (animation loop)
  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0, // Will be set on mount
    minimapHeight: 250, // Fixed height from CSS
    hasInitialized: false,
  });

  const activeIndexRef = React.useRef<number | undefined>(activeIndex);

  React.useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const requestRef = React.useRef<number | null>(null);

  // Helper to update parallax for a single item
  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number
  ) => {
    if (!img) return;

    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }

    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.2;
    current = lerp(current, target, 0.1);

    // Optimization: only update if changed significantly
    if (Math.abs(current - target) > 0.01) {
      img.style.transform = `translateY(${current}px) scale(1.5)`;
      img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY =
      s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  };

  const updatePositions = () => {
    const s = state.current;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    // Update Projects
    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
        updateParallax(img, s.currentY, index, s.projectHeight);
      }
    });

    // Update Minimap Images
    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
        // Minimap parallax uses minimapHeight
        updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    // Update Info
    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  const animate = () => {
    const s = state.current;

    // Check external control
    const externalIdx = activeIndexRef.current;
    const useExternal = externalIdx !== undefined;

    if (useExternal && s.projectHeight > 0) {
      // Map external index to target Y
      s.targetY = -externalIdx * s.projectHeight;
      s.isSnapping = false;
      s.isDragging = false;
    } else {
      const now = Date.now();
      if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
        const snapPoint =
          -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
        if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
      }

      if (s.isSnapping) updateSnap();
    }

    if (!s.isDragging || useExternal) {
      if (useExternal) {
        // Smoother lerp for external control
        s.currentY += (s.targetY - s.currentY) * 0.1;
      } else {
        s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
      }
    }

    updatePositions();
  };

  const renderedRange = React.useRef({ min: -CONFIG.BUFFER_SIZE, max: CONFIG.BUFFER_SIZE });

  const animationLoop = () => {
    animate();

    const s = state.current;
    if (s.projectHeight > 0) {
      const currentIndex = Math.round(-s.targetY / s.projectHeight);
      const min = currentIndex - CONFIG.BUFFER_SIZE;
      const max = currentIndex + CONFIG.BUFFER_SIZE;

      if (min !== renderedRange.current.min || max !== renderedRange.current.max) {
        renderedRange.current = { min, max };
        setVisibleRange({ min, max });
      }
    }

    requestRef.current = requestAnimationFrame(animationLoop);
  };

  React.useEffect(() => {
    state.current.projectHeight = window.innerHeight;

    if (!state.current.hasInitialized) {
      const startIndex =
        typeof activeIndexRef.current === "number" ? activeIndexRef.current : 0;
      state.current.currentY = -startIndex * state.current.projectHeight;
      state.current.targetY = -startIndex * state.current.projectHeight;
      state.current.hasInitialized = true;
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = state.current;
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY
      );
      s.targetY -= delta;
    };

    const onTouchStart = (e: TouchEvent) => {
      const s = state.current;
      s.isDragging = true;
      s.isSnapping = false;
      s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
      s.lastScrollTime = Date.now();
    }

    const onTouchMove = (e: TouchEvent) => {
      const s = state.current;
      if (!s.isDragging) return;
      s.targetY =
        s.dragStart.scrollY +
        (e.touches[0].clientY - s.dragStart.y) * 1.5;
      s.lastScrollTime = Date.now();
    }

    const onTouchEnd = () => {
      state.current.isDragging = false;
    }

    const onResize = () => {
      state.current.projectHeight = window.innerHeight;
      // Sync container height to match JS logic exactly
      const container = document.querySelector('.parallax-container') as HTMLElement;
      if (container) {
        container.style.height = `${window.innerHeight}px`;
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    // Initial size sync
    onResize();

    // Start Loop
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Generate range of indices
  const indices = [];
  for (let i = visibleRange.min; i <= visibleRange.max; i++) {
    indices.push(i);
  }

  return (
    <div className="parallax-container">
      <ul className="project-list">
        {indices.map((i) => {
          const data = getProjectData(i);
          return (
            <div
              key={i}
              className="project"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              <img src={data.image} alt={data.title} />
            </div>
          );
        })}
      </ul>

      <div className="minimap">
        <div className="minimap-wrapper">
          <div className="minimap-img-preview">
            {indices.map((i) => {
              const data = getProjectData(i);
              return (
                <div
                  key={i}
                  className="minimap-img-item"
                  ref={(el) => {
                    if (el) minimapRef.current.set(i, el);
                    else minimapRef.current.delete(i);
                  }}
                >
                  <img src={data.image} alt={data.title} />
                </div>
              );
            })}
          </div>
          <div className="minimap-info-list">
            {indices.map((i) => {
              const data = getProjectData(i);
              const num = getProjectNumber(i);
              return (
                <div
                  key={i}
                  className="minimap-item-info"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div className="minimap-item-info-row">
                    <p>{num}</p>
                    <p>{data.title}</p>
                  </div>
                  <div className="minimap-item-info-row">
                    <p>{data.category}</p>
                    <p>{data.year}</p>
                  </div>
                  <div className="minimap-item-info-row">
                    <p>{data.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .parallax-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        .project-list {
          position: absolute;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          top: 0;
          left: 0;
          list-style: none;
        }

        .project {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .project img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform;
        }

        .minimap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(86vw, 1100px);
          height: 250px;
          background: #f5f5f2;
          color: #111;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          z-index: 5;
          pointer-events: none;
        }

        .minimap-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .minimap-img-preview {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 100%;
          overflow: hidden;
        }

        .minimap-img-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .minimap-img-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .minimap-info-list {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
          padding: 36px 64px;
          box-sizing: border-box;
        }

        .minimap-item-info {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-transform: uppercase;
        }

        .minimap-item-info-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          letter-spacing: 0.12em;
        }

        .minimap-item-info-row p {
          margin: 0;
          line-height: 1.2;
          max-width: 48%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .minimap {
            width: 90vw;
            height: 220px;
          }

          .minimap-img-preview {
            width: 140px;
            height: 100%;
          }

          .minimap-info-list {
            padding: 20px 24px;
          }

          .minimap-item-info-row {
            font-size: 11px;
            letter-spacing: 0.1em;
          }
        }
      `}</style>
    </div>
  );
}
