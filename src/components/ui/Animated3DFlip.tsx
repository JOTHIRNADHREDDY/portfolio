import { useEffect, useRef } from 'react';
import { createTimeline, stagger, splitText } from 'animejs';

interface Animated3DFlipProps {
  texts: string[];
}

export function Animated3DFlip({ texts }: Animated3DFlipProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let currentIndex = 0;
    let isCancelled = false;

    // Add styles dynamically so we don't need a separate CSS file
    const styleId = 'animated-3d-flip-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .flip-container {
          perspective: 1000px;
          display: inline-block;
        }
        .char-3d {
          display: inline-flex;
          position: relative;
          transform-style: preserve-3d;
          line-height: 1;
          transform-origin: 50% 50% -0.5em;
        }
        .char-3d .face {
          display: block;
          font-style: normal;
        }
        .char-3d .face-front {
          position: relative;
        }
        .char-3d .face-top, .char-3d .face-bottom {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .char-3d .face-top {
          transform: rotateX(90deg) translateZ(0.5em);
          transform-origin: bottom center;
        }
        .char-3d .face-bottom {
          transform: rotateX(-90deg) translateZ(0.5em);
          transform-origin: top center;
        }
      `;
      document.head.appendChild(style);
    }

    const playNext = () => {
      if (isCancelled) return;

      el.innerHTML = texts[currentIndex];

      // Note: we use span with margin-right instead of spaces because animejs splitText handles spaces differently
      splitText(el, {
        chars: `<span class="char-3d word-{i}" style="margin-right: {value} === ' ' ? '0.5em' : '0'">
          <em class="face face-top">{value}</em>
          <em class="face face-front">{value}</em>
          <em class="face face-bottom">{value}</em>
        </span>`
      });

      // Fix spaces having 0 width in splitText by adding margin
      const chars = el.querySelectorAll('.char-3d');
      chars.forEach(char => {
        const text = char.textContent;
        // animejs repeats {value} 3 times because of our 3 faces
        if (text === '   ') { 
          (char as HTMLElement).style.width = '0.4em';
        }
      });

      const charsStagger = stagger(100, { start: 0 });

      createTimeline({ 
        defaults: { ease: 'linear', duration: 750 },
        onComplete: () => {
          setTimeout(() => {
            currentIndex = (currentIndex + 1) % texts.length;
            playNext();
          }, 2000); // Wait 2 seconds before flipping to the next word
        }
      })
      .add(el.querySelectorAll('.char-3d'), { rotateX: -90 }, charsStagger)
      .add(el.querySelectorAll('.char-3d .face-top'), { opacity: [.5, 0] }, charsStagger)
      .add(el.querySelectorAll('.char-3d .face-front'), { opacity: [1, .5] }, charsStagger)
      .add(el.querySelectorAll('.char-3d .face-bottom'), { opacity: [.5, 1] }, charsStagger);
    };

    playNext();

    return () => {
      isCancelled = true;
    };
  }, [texts]);

  return (
    <span ref={containerRef} className="text-cyan-400 flip-container h-10 overflow-visible inline-block"></span>
  );
}
