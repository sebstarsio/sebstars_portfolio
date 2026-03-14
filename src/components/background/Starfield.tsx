'use client';

import { useEffect, useRef } from 'react';

/** Palette cosmique : blanc cassé, bleu pâle, cyan désaturé, violet/bleu très discret */
const STAR_COLORS = [
  'rgba(255, 255, 255, 0.75)',
  'rgba(200, 220, 255, 0.6)',
  'rgba(160, 200, 255, 0.5)',
  'rgba(180, 190, 255, 0.45)',
] as const;

const LAYER_CONFIG = [
  { sizeMin: 0.35, sizeMax: 0.7, alphaMin: 0.2, alphaMax: 0.45, twinkleMin: 0.2, twinkleMax: 0.5, parallax: 0.12 },
  { sizeMin: 0.5, sizeMax: 1, alphaMin: 0.3, alphaMax: 0.55, twinkleMin: 0.35, twinkleMax: 0.8, parallax: 0.35 },
  { sizeMin: 0.6, sizeMax: 1.2, alphaMin: 0.4, alphaMax: 0.65, twinkleMin: 0.5, twinkleMax: 1, parallax: 0.65 },
] as const;

type Star = {
  x: number;
  y: number;
  layer: 0 | 1 | 2;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  colorIndex: number;
};

function getLayerCounts(): [number, number, number] {
  if (typeof window === 'undefined') return [55, 40, 25];
  const mobile = window.innerWidth < 768;
  return mobile ? [22, 15, 8] : [55, 40, 25];
}

function createStars(): Star[] {
  const [far, mid, near] = getLayerCounts();
  const stars: Star[] = [];
  const add = (layer: 0 | 1 | 2, count: number) => {
    const cfg = LAYER_CONFIG[layer];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        layer,
        size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
        baseAlpha: cfg.alphaMin + Math.random() * (cfg.alphaMax - cfg.alphaMin),
        twinkleSpeed: cfg.twinkleMin + Math.random() * (cfg.twinkleMax - cfg.twinkleMin),
        twinklePhase: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * STAR_COLORS.length),
      });
    }
  };
  add(0, far);
  add(1, mid);
  add(2, near);
  return stars;
}

function parseRgba(color: string): { r: number; g: number; b: number } {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return { r: +match[1], g: +match[2], b: +match[3] };
  return { r: 255, g: 255, b: 255 };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const PARALLAX_MAX_PX = 6;
const PARALLAX_LERP = 0.04;

/**
 * Starfield cosmique en Canvas : 3 couches de profondeur, scintillement, parallaxe souris discret.
 * Respecte prefers-reduced-motion (étoiles statiques) et réduit le nombre d’étoiles sur mobile.
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (starsRef.current.length === 0) {
        starsRef.current = createStars();
      }
    };

    setSize();

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX / w) * 2 - 1;
      const y = (e.clientY / h) * 2 - 1;
      mouseRef.current = { x, y };
    };

    if (!prefersReducedMotion && !isMobile()) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    let time = 0;
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const useParallax = !prefersReducedMotion && !isMobile();
      if (useParallax) {
        const { x: mx, y: my } = mouseRef.current;
        for (let L = 0; L < 3; L++) {
          const factor = LAYER_CONFIG[L].parallax;
          const tx = mx * PARALLAX_MAX_PX * factor;
          const ty = my * PARALLAX_MAX_PX * factor;
          offsetRef.current[L].x = lerp(offsetRef.current[L].x, tx, PARALLAX_LERP);
          offsetRef.current[L].y = lerp(offsetRef.current[L].y, ty, PARALLAX_LERP);
        }
      }

      const stars = starsRef.current;
      for (const star of stars) {
        const twinkle = prefersReducedMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.baseAlpha * twinkle * 0.72;
        const color = STAR_COLORS[star.colorIndex];
        const { r, g, b } = parseRgba(color);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        const o = useParallax ? offsetRef.current[star.layer] : { x: 0, y: 0 };
        const px = star.x * w + o.x;
        const py = star.y * h + o.y;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      const dt = isMobile() ? 0.005 : 0.01;
      time += dt;
      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    if (prefersReducedMotion) {
      draw();
    } else {
      animationRef.current = requestAnimationFrame(draw);
    }

    const onResize = () => {
      setSize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas"
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -2,
      }}
    />
  );
}
