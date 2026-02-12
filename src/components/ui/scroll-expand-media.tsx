'use client';

import {
    useEffect,
    useRef,
    useState,
    useMemo,
    ReactNode,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
    mediaType?: 'video' | 'image' | 'sequence';
    mediaSrc: string; // If sequence, this is the base path/prefix
    frameCount?: number; // For sequence
    posterSrc?: string;
    bgImageSrc?: string;
    title?: string;
    date?: string;
    scrollToExpand?: string;
    textBlend?: boolean;
    children?: ReactNode;
    externalProgress?: number; // Optional prop to drive progress externally
}

const ScrollExpandMedia = ({
    mediaType = 'video',
    mediaSrc,
    frameCount = 82, // Default based on file count
    posterSrc,
    bgImageSrc,
    title,
    date,
    scrollToExpand,
    textBlend,
    children,
    externalProgress,
}: ScrollExpandMediaProps) => {
    const [internalProgress, setInternalProgress] = useState<number>(0);
    // Use external progress if provided, otherwise internal
    const scrollProgress = externalProgress !== undefined ? externalProgress : internalProgress;

    const [showContent, setShowContent] = useState<boolean>(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
    const [isMobileState, setIsMobileState] = useState<boolean>(false);

    // Custom scroll tracking for the specific container
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Preload images for sequence
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const sequenceImages = useRef<HTMLImageElement[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (mediaType === 'sequence') {
            const loadImages = async () => {
                const promises = [];
                // Pattern: Smoothing_animation_no_1080p_202602081719_XXX.png
                // We need to construct the paths. Assuming mediaSrc is the folder path or prefix.
                // Let's assume mediaSrc is "/menifesto-video/Smoothing_animation_no_1080p_202602081719_"

                for (let i = 0; i < frameCount; i++) {
                    const paddedIndex = i.toString().padStart(3, '0');
                    const src = `${mediaSrc}${paddedIndex}.png`;
                    const img = new window.Image();

                    const promise = new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); // Non-blocking
                    });

                    img.src = src;
                    sequenceImages.current[i] = img;
                    promises.push(promise);
                }

                await Promise.all(promises);
                setImagesLoaded(true);
            };

            loadImages();
        }
    }, [mediaType, mediaSrc, frameCount]);

    // Render sequence to canvas
    useEffect(() => {
        if (mediaType === 'sequence' && imagesLoaded && canvasRef.current) {
            // Map scrollProgress (0 to 1) to frame index
            // We want the sequence to play fully? Or loop? 
            // "scrolls zooms ... and it starts playing"
            // Let's map progress 0 -> 1 to frame 0 -> last.
            const frameIndex = Math.min(
                Math.floor(scrollProgress * (frameCount - 1)),
                frameCount - 1
            );
            setCurrentFrame(frameIndex);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = sequenceImages.current[frameIndex];

            if (ctx && img) {
                // Maintain aspect ratio cover
                const canvasAspect = canvas.width / canvas.height;
                const imgAspect = img.width / img.height;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasAspect > imgAspect) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgAspect;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawHeight = canvas.height;
                    drawWidth = canvas.height * imgAspect;
                    offsetY = 0;
                    offsetX = (canvas.width - drawWidth) / 2;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        }
    }, [scrollProgress, imagesLoaded, mediaType, frameCount]);


    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            // Only hijack if hovered
            if (!isHovered) return;

            if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) { // Logic check? 
                // This original check 'window.scrollY <= 5' assumes the component is at the top.
                // We are inside a section. We should simply check if we are retracting.
                setMediaFullyExpanded(false);
                // e.preventDefault(); // Maybe let it scroll up naturally?
            } else if (!mediaFullyExpanded) {
                // e.preventDefault();
                const scrollDelta = e.deltaY * 0.0009;
                const newProgress = Math.min(
                    Math.max(internalProgress + scrollDelta, 0),
                    1
                );
                setInternalProgress(newProgress);

                if (newProgress >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (newProgress < 0.75) {
                    setShowContent(false);
                }

                // If we are consuming the scroll for animation, prevent default document scroll
                if (newProgress > 0 && newProgress < 1) {
                    e.preventDefault();
                }
            }
        };

        // Disable internal scroll logic if external progress is being used
        if (externalProgress !== undefined) return;

        // We attach to window to catch events, but verify hover state
        const passiveWheel = (e: Event) => handleWheel(e as unknown as WheelEvent);

        window.addEventListener('wheel', passiveWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', passiveWheel);
        };
    }, [internalProgress, mediaFullyExpanded, isHovered, externalProgress]);

    useEffect(() => {
        const checkIfMobile = (): void => {
            setIsMobileState(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Adjusted sizing logic for the "Zoom" effect within the container
    // Instead of full screen pixels, let's use percentages or bounded pixels
    // Base size: 300px -> Max size: 100% of container?
    // The user said: "start playing in the full view still contained in that marked box area"
    // So 'full view' = 100% of the parent container. 'small view' = e.g. 50%.

    // We can use transform scale instead of pixel width for better performance?
    // Or just percentage widths.

    // Started expanded as requested
    const widthPercent = 100;
    const heightPercent = 100;
    const borderRadius = 20; // Keep fixed radius

    const mediaWidth = isMobileState ? 300 : 400; // Base px
    // Let's use the provided logic but scaled down
    // The original formula: 300 + scrollProgress * 1250
    // Our container is ~600px.
    // Let's map 0..1 to scale 0.6 .. 1.0

    return (
        <div
            ref={containerRef}
            className='relative w-full h-full flex items-center justify-center overflow-hidden'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background if needed */}
            {bgImageSrc && (
                <div className="absolute inset-0 z-0">
                    <Image src={bgImageSrc} alt="bg" fill className="object-cover opacity-20" />
                </div>
            )}

            {/* Media Container */}
            <motion.div
                className='relative z-10 w-full h-full transition-all duration-100 ease-out origin-center'
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: `${borderRadius}px`,
                    overflow: 'hidden'
                }}
            >
                {mediaType === 'sequence' ? (
                    <canvas
                        ref={canvasRef}
                        width={1920}
                        height={1080}
                        className="w-full h-full object-cover"
                    />
                ) : mediaType === 'video' ? (
                    // ... video logic if needed (omitted for brevity unless user switches)
                    <video src={mediaSrc} className="w-full h-full object-cover" autoPlay muted loop />
                ) : (
                    <Image src={mediaSrc} alt="media" fill className="object-cover" />
                )}

                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-300 ${mediaFullyExpanded ? 'opacity-0' : 'opacity-100'}`} />

            </motion.div>


        </div>
    );
};

export default ScrollExpandMedia;
