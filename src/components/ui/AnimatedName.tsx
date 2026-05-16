import { useEffect, useRef } from 'react';
import { animate, splitText, stagger } from 'animejs';

export function AnimatedName() {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const texts = ["PERAM JOTHIRNADH REDDY", "ペラム ・ ジョティルナド ・ レッディ"];
    let currentIndex = 0;
    let isCancelled = false;

    const playNext = () => {
      if (isCancelled) return;
      
      // Update text
      el.innerHTML = texts[currentIndex];
      
      // Split text into words (or characters for Japanese to look good)
      const options = {
        words: { wrap: 'clip' },
        chars: { wrap: 'clip' }
      };
      
      // Split
      const split = splitText(el, options);
      // For Japanese, words might not split correctly without spaces, 
      // but animejs handles characters too. Let's animate by words if possible, or fallback to chars.
      // We will just use what the user requested: words.
      const elementsToAnimate = split.words && split.words.length > 0 ? split.words : split.chars;

      animate(elementsToAnimate, {
        y: [
          { to: ['100%', '0%'] },
          { to: '-100%', delay: 2000, ease: 'in(3)' }
        ],
        duration: 750,
        ease: 'out(3)',
        delay: stagger(100),
        onComplete: () => {
          currentIndex = (currentIndex + 1) % texts.length;
          playNext();
        }
      });
    };

    playNext();

    return () => {
      isCancelled = true;
      // We don't have a direct stop() method for the whole timeline easily accessible here without saving the instance,
      // but isCancelled will prevent the next loop.
    };
  }, []);

  return (
    <span 
      ref={containerRef} 
      className="block text-cyan-400 text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-normal"
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}
    >
      PERAM JOTHIRNADH REDDY
    </span>
  );
}
