import { useEffect } from 'react';

export function useAnimatedFavicon() {
  useEffect(() => {
    let frame = 0;
    const colors = [
      ['#22d3ee', '#3b82f6'], // cyan to blue
      ['#38bdf8', '#4f46e5'], // lightblue to indigo
      ['#818cf8', '#6366f1'], // indigo shades
      ['#60a5fa', '#3b82f6'], // blue shades
      ['#22d3ee', '#0ea5e9']  // cyan back to light blue
    ];
    
    let interval: ReturnType<typeof setInterval>;

    const updateFavicon = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear background to keep it transparent
      ctx.clearRect(0, 0, 100, 100);

      // Create gradient
      const [color1, color2] = colors[frame % colors.length];
      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);

      // Draw text
      ctx.fillStyle = gradient;
      ctx.font = '900 38px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Adjust y position slightly for vertical centering
      ctx.fillText('PJR', 50, 52);

      // Set to favicon
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'icon';
      link.href = canvas.toDataURL('image/png');
      document.getElementsByTagName('head')[0].appendChild(link);

      frame++;
    };

    // Update every 1000ms (1 second) to be gentle on performance
    interval = setInterval(updateFavicon, 1000);
    
    // Initial draw
    updateFavicon();

    return () => clearInterval(interval);
  }, []);
}
