import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

/**
 * Reading progress indicator that appears at the top of blog posts.
 * Shows how far the user has scrolled through the content.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[1001] origin-left"
      style={{
        background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
        scaleX: progress / 100,
      }}
      aria-hidden="true"
    />
  );
}
