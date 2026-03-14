'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

const SMOOTH = 0.15;
const MAX_OFFSET = 4;

/** Suivi souris “magnétique” : déplace le bouton selon la position du curseur (MAX_OFFSET px), lissé par requestAnimationFrame. Désactivé sur pointer coarse. */
function useMagnetic(disabled: boolean) {
  const ref = useRef<HTMLButtonElement>(null);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  const animate = useCallback(() => {
    setXy(prev => ({
      x: prev.x + (target.current.x - prev.x) * SMOOTH,
      y: prev.y + (target.current.y - prev.y) * SMOOTH,
    }));
    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (disabled) return;
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [disabled, animate]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      target.current = {
        x: Math.max(-1, Math.min(1, dx)) * MAX_OFFSET,
        y: Math.max(-1, Math.min(1, dy)) * MAX_OFFSET,
      };
    },
    [disabled]
  );

  const onLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
  }, []);

  return { ref, xy, onMove, onLeave };
}

function MagneticButton({
  variant = 'primary',
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive' | 'cosmic';
}) {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(pointer: coarse)');
    setCoarse(m.matches);
    const fn = () => setCoarse(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);
  const { ref, xy, onMove, onLeave } = useMagnetic(coarse);

  return (
    <button
      ref={ref}
      type="button"
      className={`lab-btn lab-btn-${variant} ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        !coarse
          ? { transform: `translate(${xy.x}px, ${xy.y}px)` }
          : undefined
      }
      {...props}
    >
      <span className="lab-btn-inner">{children}</span>
    </button>
  );
}

export default function SebStarsLab() {
  const [switchOn, setSwitchOn] = useState(false);
  const [segment, setSegment] = useState('a');
  const [check, setCheck] = useState(false);
  const [radio, setRadio] = useState('x');
  const [sliderVal, setSliderVal] = useState(50);

  return (
    <article className="lab-page">
      <header className="lab-hero">
        <div className="lab-hero-bg" aria-hidden="true" />
        <div className="lab-hero-inner">
          <p className="lab-eyebrow">Experimental UI Systems</p>
          <h1 className="lab-title">SebStars Lab</h1>
          <p className="lab-lead">
            Interaction Playground · Design System Laboratory. Composants from scratch, micro-interactions et cohérence visuelle premium.
          </p>
        </div>
      </header>

      <div className="lab-showroom">
        {/* A. Magnetic Buttons */}
        <section className="lab-section">
          <h2 className="lab-section-title">Magnetic Buttons</h2>
          <div className="lab-demo lab-demo-buttons">
            <MagneticButton variant="primary">Primary</MagneticButton>
            <MagneticButton variant="outline">Outline</MagneticButton>
            <MagneticButton variant="ghost">Ghost</MagneticButton>
            <MagneticButton variant="destructive">Destructive</MagneticButton>
            <MagneticButton variant="cosmic">Cosmic CTA</MagneticButton>
          </div>
        </section>

        {/* B. Orbital Loaders */}
        <section className="lab-section">
          <h2 className="lab-section-title">Orbital Loaders</h2>
          <div className="lab-demo lab-demo-loaders">
            <div className="lab-loader lab-loader-ring" aria-hidden="true" />
            <div className="lab-loader lab-loader-pulse" aria-hidden="true" />
            <div className="lab-loader lab-loader-orbital" aria-hidden="true" />
          </div>
        </section>

        {/* C. Glitch / Decode Text */}
        <section className="lab-section">
          <h2 className="lab-section-title">Glitch & Decode Text</h2>
          <div className="lab-demo lab-demo-text">
            <p className="lab-text-decode" data-text="DECODE_READY">DECODE_READY</p>
            <p className="lab-text-reveal">Reveal effect</p>
            <p className="lab-text-glitch">Terminal</p>
          </div>
        </section>

        {/* D. Inputs Glassmorphism */}
        <section className="lab-section">
          <h2 className="lab-section-title">Inputs Glassmorphism</h2>
          <div className="lab-demo lab-demo-inputs">
            <div className="lab-input-wrap">
              <input type="text" id="lab-in-1" className="lab-input" placeholder=" " />
              <label htmlFor="lab-in-1" className="lab-input-label">Texte</label>
            </div>
            <div className="lab-input-wrap">
              <input type="email" id="lab-in-2" className="lab-input" placeholder=" " />
              <label htmlFor="lab-in-2" className="lab-input-label">Email</label>
            </div>
            <div className="lab-input-wrap">
              <input type="password" id="lab-in-3" className="lab-input" placeholder=" " />
              <label htmlFor="lab-in-3" className="lab-input-label">Mot de passe</label>
            </div>
            <div className="lab-input-wrap lab-input-success">
              <input type="text" id="lab-in-4" className="lab-input" placeholder=" " defaultValue="Valid" readOnly />
              <label htmlFor="lab-in-4" className="lab-input-label">Success</label>
            </div>
            <div className="lab-input-wrap lab-input-error">
              <input type="text" id="lab-in-err" className="lab-input" placeholder=" " defaultValue="Invalid" readOnly />
              <label htmlFor="lab-in-err" className="lab-input-label">Error</label>
            </div>
            <div className="lab-input-wrap lab-input-disabled">
              <input type="text" id="lab-in-dis" className="lab-input" placeholder=" " disabled />
              <label htmlFor="lab-in-dis" className="lab-input-label">Disabled</label>
            </div>
            <div className="lab-input-wrap lab-input-search">
              <input type="search" id="lab-in-5" className="lab-input" placeholder=" " />
              <label htmlFor="lab-in-5" className="lab-input-label">Recherche</label>
            </div>
            <div className="lab-input-wrap lab-textarea-wrap">
              <textarea id="lab-ta" className="lab-input lab-textarea" placeholder=" " rows={3} />
              <label htmlFor="lab-ta" className="lab-input-label">Textarea</label>
            </div>
          </div>
        </section>

        {/* E. Toggles & Controls */}
        <section className="lab-section">
          <h2 className="lab-section-title">Toggles & Controls</h2>
          <div className="lab-demo lab-demo-controls">
            <div className="lab-control-row">
              <span className="lab-control-label">Switch</span>
              <button
                type="button"
                role="switch"
                aria-checked={switchOn}
                className={`lab-switch ${switchOn ? 'lab-switch-on' : ''}`}
                onClick={() => setSwitchOn(v => !v)}
              >
                <span className="lab-switch-thumb" />
              </button>
            </div>
            <div className="lab-control-row">
              <span className="lab-control-label">Segmented</span>
              <div className="lab-segmented" role="group">
                {(['a', 'b', 'c'] as const).map(k => (
                  <button
                    key={k}
                    type="button"
                    className={`lab-segmented-btn ${segment === k ? 'active' : ''}`}
                    onClick={() => setSegment(k)}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="lab-control-row">
              <span className="lab-control-label">Checkbox</span>
              <label className="lab-checkbox-wrap">
                <input type="checkbox" checked={check} onChange={e => setCheck(e.target.checked)} className="lab-checkbox" />
                <span className="lab-checkbox-box" />
                <span>Option</span>
              </label>
            </div>
            <div className="lab-control-row">
              <span className="lab-control-label">Radio</span>
              <div className="lab-radio-group">
                {(['x', 'y', 'z'] as const).map(k => (
                  <label key={k} className="lab-radio-wrap">
                    <input type="radio" name="lab-radio" value={k} checked={radio === k} onChange={() => setRadio(k)} className="lab-radio" />
                    <span className="lab-radio-dot" />
                    <span>{k.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="lab-control-row">
              <span className="lab-control-label">Slider</span>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderVal}
                onChange={e => setSliderVal(Number(e.target.value))}
                className="lab-slider"
              />
            </div>
          </div>
        </section>

        {/* F. Premium Cards */}
        <section className="lab-section">
          <h2 className="lab-section-title">Premium Cards</h2>
          <div className="lab-demo lab-demo-cards">
            <div className="lab-card">
              <div className="lab-card-glow" aria-hidden="true" />
              <h3 className="lab-card-title">Card Alpha</h3>
              <p className="lab-card-desc">Glass layering, hover premium, glow subtil.</p>
            </div>
            <div className="lab-card lab-card-elevated">
              <div className="lab-card-glow" aria-hidden="true" />
              <h3 className="lab-card-title">Card Beta</h3>
              <p className="lab-card-desc">Variation de structure et profondeur.</p>
            </div>
            <div className="lab-card lab-card-accent">
              <div className="lab-card-glow" aria-hidden="true" />
              <h3 className="lab-card-title">Card Gamma</h3>
              <p className="lab-card-desc">Bordure accent et halo cyan.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
