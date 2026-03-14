'use client';

import { useState, useEffect, useRef } from 'react';
import type { ArchitectureNotesData } from '@/components/ui/ArchitectureNotes';
import '../../styles/demos/fractal-generator.css';

type FractalType = 'mandelbrot' | 'julia' | 'sierpinski' | 'koch' | 'burning-ship' | 'newton';
type ColorScheme = 'rainbow' | 'fire' | 'ocean' | 'grayscale' | 'neon' | 'aurora' | 'sunset' | 'matrix';

interface FractalParams {
  type: FractalType;
  iterations: number;
  colorScheme: ColorScheme;
  zoom: number;
  centerX: number;
  centerY: number;
  juliaCx?: number;
  juliaCy?: number;
}

interface FractalGeneratorProps {
  architectureNotes?: ArchitectureNotesData;
  lang?: 'fr' | 'en';
}

export default function FractalGenerator({ architectureNotes, lang = 'fr' }: FractalGeneratorProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<FractalParams>({
    type: 'mandelbrot',
    iterations: 50,
    colorScheme: 'rainbow',
    zoom: 50,
    centerX: 0,
    centerY: 0,
    juliaCx: -0.7,
    juliaCy: 0.27,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [educationalMode, setEducationalMode] = useState(false);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [pixelCount, setPixelCount] = useState<number>(0);

  /** Échappe Mandelbrot : z ← z² + c ; borne 4 pour l’ensemble. */
  const mandelbrot = (cx: number, cy: number, maxIter: number) => {
    let x = 0, y = 0;
    let iteration = 0;

    while (x * x + y * y <= 4 && iteration < maxIter) {
      const xTemp = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = xTemp;
      iteration++;
    }

    return { iteration, maxIter };
  };

  /** Julia : même itération que Mandelbrot mais c fixe (paramètre), point (x,y) variable. */
  const julia = (x: number, y: number, cx: number, cy: number, maxIter: number) => {
    let iteration = 0;

    while (x * x + y * y <= 4 && iteration < maxIter) {
      const xTemp = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = xTemp;
      iteration++;
    }

    return { iteration, maxIter };
  };

  const sierpinski = (x: number, y: number, maxIter: number) => {
    const size = Math.pow(2, Math.floor(maxIter / 10));
    const pattern = ((Math.floor(x / size) & Math.floor(y / size)) === 0) ? 1 : 0;
    return { iteration: pattern * maxIter, maxIter };
  };

  const koch = (x: number, y: number, maxIter: number) => {
    const centerX = 400;
    const centerY = 300;
    const angle = Math.atan2(y - centerY, x - centerX);
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const scale = Math.pow(2, Math.floor(maxIter / 15));
    const pattern = Math.sin(distance / (10 * scale) + angle * maxIter) > 0 ? 1 : 0;
    return { iteration: pattern * maxIter, maxIter };
  };

  /** Burning Ship : variante avec |Re(z)| et |Im(z)| dans la récurrence. */
  const burningShip = (cx: number, cy: number, maxIter: number) => {
    let x = 0, y = 0;
    let iteration = 0;

    while (x * x + y * y <= 4 && iteration < maxIter) {
      const xTemp = x * x - y * y + cx;
      y = Math.abs(2 * x * y) + cy;
      x = Math.abs(xTemp);
      iteration++;
    }

    return { iteration, maxIter };
  };

  /** Newton : convergence vers les racines de z³ − 1 ; tolérance pour arrêt. */
  const newton = (cx: number, cy: number, maxIter: number) => {
    let zx = cx, zy = cy;
    let iteration = 0;
    const tolerance = 0.0001;

    while (iteration < maxIter) {
      const zx2 = zx * zx;
      const zy2 = zy * zy;
      const zx2zy2 = zx2 + zy2;
      
      if (zx2zy2 < tolerance) break;
      
      const newZx = (2 * zx + zx2 - zy2) / (3 * (zx2zy2));
      const newZy = (2 * zy - 2 * zx * zy) / (3 * (zx2zy2));
      
      if (Math.abs(newZx - zx) < tolerance && Math.abs(newZy - zy) < tolerance) break;
      
      zx = newZx;
      zy = newZy;
      iteration++;
    }

    return { iteration, maxIter };
  };

  const applyColorScheme = (color: { iteration: number; maxIter: number }, scheme: ColorScheme) => {
    const ratio = color.iteration / color.maxIter;
    
    switch (scheme) {
      case 'rainbow':
        return {
          r: Math.max(0, Math.min(255, Math.floor(127.5 + 127.5 * Math.sin(ratio * Math.PI)))),
          g: Math.max(0, Math.min(255, Math.floor(127.5 + 127.5 * Math.sin(ratio * Math.PI + 2 * Math.PI / 3)))),
          b: Math.max(0, Math.min(255, Math.floor(127.5 + 127.5 * Math.sin(ratio * Math.PI + 4 * Math.PI / 3))))
        };
      
      case 'fire':
        return {
          r: Math.max(0, Math.min(255, Math.floor(255 * ratio))),
          g: Math.max(0, Math.min(255, Math.floor(255 * ratio * 0.5))),
          b: Math.max(0, Math.min(255, Math.floor(255 * ratio * 0.1)))
        };
      
      case 'ocean':
        return {
          r: Math.max(0, Math.min(255, Math.floor(255 * ratio * 0.2))),
          g: Math.max(0, Math.min(255, Math.floor(255 * ratio * 0.6))),
          b: Math.max(0, Math.min(255, Math.floor(255 * ratio)))
        };
      
      case 'grayscale':
        const gray = Math.max(0, Math.min(255, Math.floor(255 * ratio)));
        return { r: gray, g: gray, b: gray };
      
      case 'neon':
        return {
          r: Math.max(0, Math.min(255, Math.floor(127.5 + 127.5 * Math.sin(ratio * Math.PI * 2)))),
          g: Math.max(0, Math.min(255, Math.floor(127.5 + 127.5 * Math.sin(ratio * Math.PI * 2 + Math.PI * 2 / 3)))),
          b: Math.max(0, Math.min(255, Math.floor(127.5 + 127.5 * Math.sin(ratio * Math.PI * 2 + Math.PI * 4 / 3))))
        };
      
      case 'aurora':
        return {
          r: Math.max(0, Math.min(255, Math.floor(100 + 155 * Math.sin(ratio * Math.PI * 3)))),
          g: Math.max(0, Math.min(255, Math.floor(150 + 105 * Math.sin(ratio * Math.PI * 3 + Math.PI / 2)))),
          b: Math.max(0, Math.min(255, Math.floor(200 + 55 * Math.sin(ratio * Math.PI * 3 + Math.PI))))
        };
      
      case 'sunset':
        return {
          r: Math.max(0, Math.min(255, Math.floor(255 * (1 - ratio * 0.5)))),
          g: Math.max(0, Math.min(255, Math.floor(200 * ratio))),
          b: Math.max(0, Math.min(255, Math.floor(100 + 155 * ratio)))
        };
      
      case 'matrix':
        return {
          r: Math.max(0, Math.min(255, Math.floor(50 * ratio))),
          g: Math.max(0, Math.min(255, Math.floor(255 * ratio))),
          b: Math.max(0, Math.min(255, Math.floor(50 * ratio)))
        };
      
      default:
        return { r: 0, g: 0, b: 0 };
    }
  };

  const renderFractal = (ctx: CanvasRenderingContext2D, params: FractalParams) => {
    setIsRendering(true);
    setRenderProgress(0);
    const startTime = performance.now();
    
    const { width, height } = ctx.canvas;
    setPixelCount(width * height);
    
    // Créer un canvas temporaire pour le double buffering
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Copier l'ancienne image du canvas principal vers le canvas temporaire
    try {
      const oldImageData = ctx.getImageData(0, 0, width, height);
      tempCtx.putImageData(oldImageData, 0, 0);
    } catch (e) {
      // Si le canvas est vide, on commence avec un fond noir
      tempCtx.fillStyle = '#000000';
      tempCtx.fillRect(0, 0, width, height);
    }
    
    const imageData = tempCtx.createImageData(width, height);
    const data = imageData.data;
    
    // Copier l'image actuelle du canvas temporaire dans la nouvelle imageData
    const currentImageData = tempCtx.getImageData(0, 0, width, height);
    data.set(currentImageData.data);
    
    const totalPixels = width * height;
    let processedPixels = 0;

    const renderChunk = (startY: number, endY: number) => {
      for (let y = startY; y < endY; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;

          let color: { iteration: number; maxIter: number } = { iteration: 0, maxIter: params.iterations };
          
          switch (params.type) {
            case 'mandelbrot':
            case 'julia':
            case 'burning-ship':
            case 'newton':
              const scale = 4 / Math.pow(2, params.zoom / 10);
              const realX = (x - width / 2) * scale + params.centerX;
              const realY = (y - height / 2) * scale + params.centerY;
              
              if (params.type === 'mandelbrot') {
                color = mandelbrot(realX, realY, params.iterations);
              } else if (params.type === 'julia') {
                const cx = params.juliaCx ?? -0.7;
                const cy = params.juliaCy ?? 0.27;
                color = julia(realX, realY, cx, cy, params.iterations);
              } else if (params.type === 'burning-ship') {
                color = burningShip(realX, realY, params.iterations);
              } else if (params.type === 'newton') {
                color = newton(realX, realY, params.iterations);
              }
              break;
              
            case 'sierpinski':
              const sierpinskiScale = Math.pow(2, params.zoom / 20);
              const sierpinskiX = (x - width / 2 - params.centerX * 100) / sierpinskiScale + width / 2;
              const sierpinskiY = (y - height / 2 - params.centerY * 100) / sierpinskiScale + height / 2;
              color = sierpinski(sierpinskiX, sierpinskiY, params.iterations);
              break;
              
            case 'koch':
              const kochScale = Math.pow(2, params.zoom / 20);
              const kochX = (x - width / 2 - params.centerX * 100) / kochScale + width / 2;
              const kochY = (y - height / 2 - params.centerY * 100) / kochScale + height / 2;
              color = koch(kochX, kochY, params.iterations);
              break;
              
            default:
              color = { iteration: 0, maxIter: params.iterations };
          }

          const finalColor = applyColorScheme(color, params.colorScheme);
          
          data[index] = finalColor.r;
          data[index + 1] = finalColor.g;
          data[index + 2] = finalColor.b;
          data[index + 3] = 255;
          
          processedPixels++;
        }
      }
    };

    const renderProgressively = () => {
      // Use larger chunks for better performance and less visual artifacts
      const chunkSize = Math.max(4, Math.floor(height / 10));
      let currentY = 0;

      const processNextChunk = () => {
        const endY = Math.min(currentY + chunkSize, height);
        renderChunk(currentY, endY);
        currentY = endY;

        // Mettre à jour le canvas temporaire progressivement
        tempCtx.putImageData(imageData, 0, 0);
        
        const progress = Math.floor((processedPixels / totalPixels) * 100);
        setRenderProgress(progress);

        if (currentY < height) {
          requestAnimationFrame(processNextChunk);
        } else {
          // Une fois terminé, copier l'image complète du canvas temporaire vers le canvas principal
          // L'ancienne image reste visible jusqu'à ce que la nouvelle soit complètement prête
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(tempCanvas, 0, 0);
          const endTime = performance.now();
          setRenderTime(endTime - startTime);
          setIsRendering(false);
          setRenderProgress(100);
        }
      };

      processNextChunk();
    };

    renderProgressively();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const maxWidth = Math.min(1200, container.clientWidth - 40);
        const maxHeight = Math.min(800, window.innerHeight - 300);
        canvas.width = maxWidth;
        canvas.height = maxHeight;
      } else {
        canvas.width = 800;
        canvas.height = 600;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    renderFractal(ctx, params);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [params]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setLastMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - lastMousePos.x;
    const deltaY = currentY - lastMousePos.y;
    
    let moveX: number, moveY: number;
    
    if (params.type === 'mandelbrot' || params.type === 'julia') {
      const scale = 4 / Math.pow(2, params.zoom / 10);
      moveX = -deltaX * scale * 0.01;
      moveY = -deltaY * scale * 0.01;
    } else {
      moveX = -deltaX * 0.5;
      moveY = -deltaY * 0.5;
    }

    setParams(prev => ({
      ...prev,
      centerX: prev.centerX + moveX,
      centerY: prev.centerY + moveY
    }));

    setLastMousePos({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -2 : 2;
    setParams(prev => ({
      ...prev,
      zoom: Math.max(1, Math.min(200, prev.zoom + delta))
    }));
  };

  const resetView = () => {
    setParams(prev => ({
      ...prev,
      centerX: 0,
      centerY: 0,
      zoom: 50
    }));
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `fractale-${params.type}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportConfig = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const config = {
        type: params.type,
        iterations: params.iterations,
        colorScheme: params.colorScheme,
        zoom: params.zoom,
        centerX: params.centerX,
        centerY: params.centerY,
        juliaCx: params.juliaCx,
        juliaCy: params.juliaCy,
        renderTime: renderTime,
        pixelCount: pixelCount,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fractal-config-${params.type}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csv = [
        ['Paramètre', 'Valeur'],
        ['Type', params.type],
        ['Itérations', params.iterations.toString()],
        ['Palette', params.colorScheme],
        ['Zoom', params.zoom.toString()],
        ['Centre X', params.centerX.toFixed(6)],
        ['Centre Y', params.centerY.toFixed(6)],
        ...(params.type === 'julia' ? [
          ['Julia Cx', params.juliaCx?.toFixed(6) || '-0.7'],
          ['Julia Cy', params.juliaCy?.toFixed(6) || '0.27']
        ] : []),
        ['Temps de rendu (ms)', renderTime?.toFixed(2) || 'N/A'],
        ['Nombre de pixels', pixelCount.toString()],
      ].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fractal-config-${params.type}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const loadConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        setParams(prev => ({
          ...prev,
          type: config.type || prev.type,
          iterations: config.iterations || prev.iterations,
          colorScheme: config.colorScheme || prev.colorScheme,
          zoom: config.zoom || prev.zoom,
          centerX: config.centerX || prev.centerX,
          centerY: config.centerY || prev.centerY,
          juliaCx: config.juliaCx !== undefined ? config.juliaCx : prev.juliaCx,
          juliaCy: config.juliaCy !== undefined ? config.juliaCy : prev.juliaCy,
        }));
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
        alert('Erreur lors du chargement de la configuration. Vérifiez que le fichier est valide.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <section className="wf-section wf-hero">
        <div className="wf-hero-bg">
          <div className="wf-starfield-layer"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="curve-glow curve-glow-1"></div>
          <div className="curve-glow curve-glow-2"></div>
        </div>
        <div className="wf-inner hero-inner" style={{ position: 'relative', zIndex: 2 }}>
          <div className="wf-hero-content">
            <div className="wf-hero-text">
              <p className="eyebrow">Mathématiques & Algorithmes</p>
              <h1 className="wf-hero-title">
                Générateur de<br />
                <span className="underline-wave">Fractales</span>
              </h1>
              <p className="lead">
                Explorez l&apos;univers des motifs mathématiques avec des fractales interactives.
                Mandelbrot, Julia, Sierpinski et Koch avec contrôles avancés et palettes de couleurs personnalisables.
              </p>
            </div>
          </div>
        </div>
        <div className="wf-wave-divider wf-wave-bottom">
          <svg viewBox="0 0 1440 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveFractalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="40%" stopColor="#10163B" />
                <stop offset="75%" stopColor="#1B355A" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveFractalGrad)" d="M0,160 C260,220 420,80 720,140 C1040,200 1180,260 1440,200 L1440,240 L0,240 Z" />
          </svg>
        </div>
      </section>

      <section className="wf-section wf-projects">
        <div className="wf-wave-divider wf-wave-top fractal-wave-parasite">
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveControlsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="30%" stopColor="#10163B" />
                <stop offset="70%" stopColor="#241848" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveControlsGrad)" d="M0,40 C260,-10 420,140 720,90 C1040,40 1180,-40 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="wf-inner">
          <div className="fractal-container">
            <div className="fractal-controls">
              <div className="control-panel">
                <h3>Contrôles</h3>

                <div className="control-group">
                  <label htmlFor="fractal-type">Type de fractale:</label>
                  <select
                    id="fractal-type"
                    value={params.type}
                    onChange={(e) => setParams(prev => ({ ...prev, type: e.target.value as FractalType }))}
                  >
                    <option value="mandelbrot">Mandelbrot</option>
                    <option value="julia">Julia</option>
                    <option value="burning-ship">Burning Ship</option>
                    <option value="newton">Newton</option>
                    <option value="sierpinski">Triangle de Sierpinski</option>
                    <option value="koch">Flocon de Koch</option>
                  </select>
                </div>

                <div className="control-group">
                  <label htmlFor="iterations">
                    Itérations: {params.iterations}
                  </label>
                  <input
                    id="iterations"
                    type="range"
                    min="1"
                    max="100"
                    value={params.iterations}
                    onChange={(e) => setParams(prev => ({ ...prev, iterations: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="control-group">
                  <label htmlFor="color-scheme">Palette de couleurs:</label>
                  <select
                    id="color-scheme"
                    value={params.colorScheme}
                    onChange={(e) => setParams(prev => ({ ...prev, colorScheme: e.target.value as ColorScheme }))}
                  >
                    <option value="rainbow">Arc-en-ciel</option>
                    <option value="fire">Feu</option>
                    <option value="ocean">Océan</option>
                    <option value="neon">Néon</option>
                    <option value="aurora">Aurore</option>
                    <option value="sunset">Coucher de soleil</option>
                    <option value="matrix">Matrix</option>
                    <option value="grayscale">Nuances de gris</option>
                  </select>
                </div>

                {params.type === 'julia' && (
                  <>
                    <div className="control-group">
                      <label htmlFor="julia-cx">
                        Julia Cx: {params.juliaCx?.toFixed(3) ?? -0.7}
                      </label>
                      <input
                        id="julia-cx"
                        type="range"
                        min="-2"
                        max="2"
                        step="0.01"
                        value={params.juliaCx ?? -0.7}
                        onChange={(e) => setParams(prev => ({ ...prev, juliaCx: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div className="control-group">
                      <label htmlFor="julia-cy">
                        Julia Cy: {params.juliaCy?.toFixed(3) ?? 0.27}
                      </label>
                      <input
                        id="julia-cy"
                        type="range"
                        min="-2"
                        max="2"
                        step="0.01"
                        value={params.juliaCy ?? 0.27}
                        onChange={(e) => setParams(prev => ({ ...prev, juliaCy: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </>
                )}

                <div className="control-group">
                  <label htmlFor="zoom">
                    Zoom: {params.zoom} ({params.zoom > 50 ? `×${Math.pow(2, (params.zoom - 50) / 10).toFixed(1)}` : '×1'})
                  </label>
                  <input
                    id="zoom"
                    type="range"
                    min="1"
                    max="200"
                    value={params.zoom}
                    onChange={(e) => setParams(prev => ({ ...prev, zoom: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="control-group">
                  <label className="control-checkbox">
                    <input
                      type="checkbox"
                      checked={educationalMode}
                      onChange={(e) => setEducationalMode(e.target.checked)}
                    />
                    <span>Mode éducatif</span>
                  </label>
                </div>

                <div className="control-actions">
                  <button onClick={resetView} className="btn btn-secondary">
                    Réinitialiser
                  </button>
                  <button onClick={saveImage} className="btn btn-primary">
                    Export PNG
                  </button>
                </div>

                {educationalMode && (
                  <div className="control-actions" style={{ marginTop: '0.5rem' }}>
                    <button onClick={() => exportConfig('json')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}>
                      Export JSON
                    </button>
                    <button onClick={() => exportConfig('csv')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}>
                      Export CSV
                    </button>
                  </div>
                )}

                {educationalMode && (
                  <div className="control-group" style={{ marginTop: '1rem' }}>
                    <label htmlFor="load-config" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}>
                      Charger configuration
                    </label>
                    <input
                      id="load-config"
                      type="file"
                      accept=".json"
                      onChange={loadConfig}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}

                {isRendering && (
                  <div className="rendering-indicator">
                    <div className="rendering-progress">
                      <div 
                        className="rendering-progress-bar" 
                        style={{ width: `${renderProgress}%` }}
                      ></div>
                    </div>
                    <span>Rendu en cours... {renderProgress}%</span>
                  </div>
                )}
              </div>

              <div className="instructions-panel">
                <h3>Instructions</h3>
                <ul>
                  <li>Cliquez et faites glisser pour déplacer la vue</li>
                  <li>Utilisez la molette pour zoomer/dézoomer</li>
                  <li>Ajustez les paramètres pour créer des motifs uniques</li>
                  <li>Cliquez sur &quot;Export PNG&quot; pour exporter votre création</li>
                </ul>
              </div>
            </div>

            {educationalMode && (
              <div className="fractal-info-panel">
                <div className="fractal-info-header">
                  <h3>Informations sur {params.type === 'mandelbrot' ? 'Mandelbrot' : params.type === 'julia' ? 'Julia' : params.type === 'burning-ship' ? 'Burning Ship' : params.type === 'newton' ? 'Newton' : params.type === 'sierpinski' ? 'Sierpinski' : 'Koch'}</h3>
                </div>
                <div className="fractal-info-content">
                  {params.type === 'mandelbrot' && (
                    <div className="info-section">
                      <div className="info-section-title">Ensemble de Mandelbrot</div>
                      <div className="info-section-content">
                        <p>L&apos;ensemble de Mandelbrot est défini par l&apos;itération de la fonction z = z² + c, où z commence à 0 et c est un nombre complexe. Les points qui ne divergent pas forment l&apos;ensemble de Mandelbrot.</p>
                        <p><strong>Formule :</strong> z<sub>n+1</sub> = z<sub>n</sub>² + c</p>
                        <p><strong>Découvert par :</strong> Benoît Mandelbrot (1979)</p>
                      </div>
                    </div>
                  )}
                  {params.type === 'julia' && (
                    <div className="info-section">
                      <div className="info-section-title">Ensemble de Julia</div>
                      <div className="info-section-content">
                        <p>L&apos;ensemble de Julia est similaire à Mandelbrot mais avec c fixe. Chaque valeur de c produit un ensemble de Julia unique avec sa propre structure fractale.</p>
                        <p><strong>Formule :</strong> z<sub>n+1</sub> = z<sub>n</sub>² + c (c fixe)</p>
                        <p><strong>Découvert par :</strong> Gaston Julia (1918)</p>
                      </div>
                    </div>
                  )}
                  {params.type === 'burning-ship' && (
                    <div className="info-section">
                      <div className="info-section-title">Burning Ship</div>
                      <div className="info-section-content">
                        <p>Variante de l&apos;ensemble de Mandelbrot où les valeurs absolues sont utilisées à chaque itération, créant une forme ressemblant à un navire en feu.</p>
                        <p><strong>Formule :</strong> z<sub>n+1</sub> = (|Re(z<sub>n</sub>)| + i|Im(z<sub>n</sub>)|)² + c</p>
                        <p><strong>Découvert par :</strong> Michael Michelitsch et Otto E. Rössler (1992)</p>
                      </div>
                    </div>
                  )}
                  {params.type === 'newton' && (
                    <div className="info-section">
                      <div className="info-section-title">Fractale de Newton</div>
                      <div className="info-section-content">
                        <p>Basée sur la méthode de Newton pour trouver les racines d&apos;une fonction. Les régions colorées indiquent vers quelle racine chaque point converge.</p>
                        <p><strong>Méthode :</strong> z<sub>n+1</sub> = z<sub>n</sub> - f(z<sub>n</sub>)/f&apos;(z<sub>n</sub>)</p>
                        <p><strong>Découvert par :</strong> Basée sur la méthode de Newton (1669)</p>
                      </div>
                    </div>
                  )}
                  {params.type === 'sierpinski' && (
                    <div className="info-section">
                      <div className="info-section-title">Triangle de Sierpinski</div>
                      <div className="info-section-content">
                        <p>Un triangle fractal créé en divisant récursivement un triangle équilatéral en quatre triangles plus petits, puis en répétant le processus sur chaque triangle restant.</p>
                        <p><strong>Dimension fractale :</strong> log(3)/log(2) ≈ 1.585</p>
                        <p><strong>Découvert par :</strong> Wacław Sierpiński (1915)</p>
                      </div>
                    </div>
                  )}
                  {params.type === 'koch' && (
                    <div className="info-section">
                      <div className="info-section-title">Flocon de Koch</div>
                      <div className="info-section-content">
                        <p>Une courbe fractale créée en remplaçant récursivement chaque segment par quatre segments formant un triangle équilatéral. Le périmètre tend vers l&apos;infini tandis que l&apos;aire reste finie.</p>
                        <p><strong>Dimension fractale :</strong> log(4)/log(3) ≈ 1.262</p>
                        <p><strong>Découvert par :</strong> Helge von Koch (1904)</p>
                      </div>
                    </div>
                  )}
                  <div className="info-section">
                    <div className="info-section-title">Statistiques de rendu</div>
                    <div className="info-section-content">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Pixels</span>
                          <span className="info-value">{pixelCount.toLocaleString()}</span>
                        </div>
                        {renderTime !== null && (
                          <div className="info-item">
                            <span className="info-label">Temps de rendu</span>
                            <span className="info-value">{renderTime.toFixed(2)} ms</span>
                          </div>
                        )}
                        <div className="info-item">
                          <span className="info-label">Itérations max</span>
                          <span className="info-value">{params.iterations}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Niveau de zoom</span>
                          <span className="info-value">{params.zoom}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="fractal-canvas-container">
              <canvas
                ref={canvasRef}
                className="fractal-canvas"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

