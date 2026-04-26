import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Background video with lazy loading, poster fallback, and reduced motion support.
 * Uses IntersectionObserver to only load when visible.
 */
export default function RobotScene({ activeSection }: { activeSection: string }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load video when container is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Check reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Compute overlay opacity based on active section — kept lighter for more see-through
  const getOverlayOpacity = () => {
    switch (activeSection) {
      case 'space': return 0.15;
      case 'defence': return 0.3;
      case 'environment': return 0.35;
      case 'contact': return 0.45;
      default: return 0.2;
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Video Background */}
      {shouldLoad && !prefersReducedMotion() && (
        <video
          src="https://res.cloudinary.com/docyav5vn/video/upload/w_3840,c_scale,q_auto:best/v1777112178/20260425_153010-CINEMATIC_2_ckhgvo.mp4"
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1500 ${
            isVideoLoaded ? 'opacity-90' : 'opacity-0'
          }`}
          // Reduce data usage on slow connections
          preload="auto"
        />
      )}

      {/* Dark overlay that deepens as user scrolls — lighter for transparency */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `linear-gradient(180deg, 
            rgba(2,6,23,${getOverlayOpacity()}) 0%, 
            rgba(2,6,23,0.4) 40%, 
            rgba(2,6,23,0.65) 75%, 
            rgba(2,6,23,0.8) 100%)`,
        }}
      />

      {/* Radial vignette — subtler */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.4) 100%)',
        }}
      />

      {/* Animated gradient accent at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.1), transparent)',
        }}
      />
    </div>
  );
}
