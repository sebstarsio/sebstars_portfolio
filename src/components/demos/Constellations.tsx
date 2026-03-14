'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CONSTELLATIONS, Constellation, Star, equatorialToCanvas, getMythology } from '@/lib/demos/constellations-data';
import ViewSourceButton from '@/components/ui/ViewSourceButton';
import '../../styles/demos/constellations.css';

export default function Constellations() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1.0);
  const [ra0, setRa0] = useState(0);
  const [dec0, setDec0] = useState(60);
  const [showLines, setShowLines] = useState(true);
  const [showMythology, setShowMythology] = useState(true);
  const [showDistances, setShowDistances] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<{ constellationId: string; starId: string; x: number; y: number } | null>(null);
  const [selectedStar, setSelectedStar] = useState<{ constellationId: string; starId: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [use3D, setUse3D] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const centerX = useRef(0);
  const centerY = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [infoPanelStyle, setInfoPanelStyle] = useState<{ top?: string; height?: string; maxHeight?: string; minHeight?: string }>({});
  const [starInfoPanelStyle, setStarInfoPanelStyle] = useState<{ top?: string; height?: string; maxHeight?: string; minHeight?: string }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      centerX.current = canvas.width / 2;
      centerY.current = canvas.height / 2;
      draw();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Calculer les limites du panneau d'information basées sur le cadre des constellations
  useEffect(() => {
    const updateInfoPanelLimits = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      // Utiliser getBoundingClientRect().top directement pour position fixed
      const top = containerRect.top;
      const height = containerRect.height;
      
      // S'assurer que la hauteur est exactement celle du cadre
      setInfoPanelStyle({
        top: `${top}px`,
        height: `${height}px`,
        maxHeight: `${height}px`,
        minHeight: `${height}px`
      });
      
      setStarInfoPanelStyle({
        top: `${top}px`,
        height: `${height}px`,
        maxHeight: `${height}px`,
        minHeight: `${height}px`
      });
    };

    updateInfoPanelLimits();
    
    // Utiliser requestAnimationFrame pour des mises à jour fluides
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateInfoPanelLimits);
    };
    
    window.addEventListener('resize', updateInfoPanelLimits);
    window.addEventListener('scroll', handleScroll, true); // true pour capturer tous les scrolls
    window.addEventListener('resize', updateInfoPanelLimits);
    
    // Mettre à jour aussi lors des changements de layout
    const observer = new ResizeObserver(updateInfoPanelLimits);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateInfoPanelLimits);
      window.removeEventListener('scroll', handleScroll, true);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);


  const findStarAt = (x: number, y: number) => {
    const threshold = 20 / zoom;
    const cx = centerX.current;
    const cy = centerY.current;
    for (const constellation of CONSTELLATIONS) {
      for (const star of constellation.stars) {
        const pos = equatorialToCanvas(star.equatorial.ra, star.equatorial.dec, cx, cy, zoom, ra0, dec0);
        const dx = x - pos.x;
        const dy = y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < threshold) {
          return { constellationId: constellation.id, starId: star.id, x: pos.x, y: pos.y };
        }
      }
    }
    return null;
  };

  const findConstellationAt = (x: number, y: number) => {
    const threshold = 30 / zoom;
    const cx = centerX.current;
    const cy = centerY.current;
    for (const constellation of CONSTELLATIONS) {
      for (const star of constellation.stars) {
        const pos = equatorialToCanvas(star.equatorial.ra, star.equatorial.dec, cx, cy, zoom, ra0, dec0);
        const dx = x - pos.x;
        const dy = y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < threshold) {
          return constellation.id;
        }
      }
    }
    return null;
  };

  const filteredConstellations = useMemo(() => {
    if (!searchQuery.trim()) return CONSTELLATIONS;
    const query = searchQuery.toLowerCase();
    return CONSTELLATIONS.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.nameLatin.toLowerCase().includes(query) ||
      c.stars.some(s => s.name.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Focus automatique : quand la recherche ne retourne qu'une constellation, la sélectionner
  useEffect(() => {
    if (searchQuery.trim() && filteredConstellations.length === 1) {
      setSelectedConstellation(filteredConstellations[0].id);
    }
  }, [searchQuery, filteredConstellations]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const starColor = '#e8ecf4';
    const lineColor = 'rgba(140, 220, 255, 0.38)';

    // Fond ciel profond : gradient radial bleu-noir (style planétarium / NASA sky map)
    const cxBg = canvas.width / 2;
    const cyBg = canvas.height / 2;
    const rBg = Math.max(canvas.width, canvas.height) * 0.65;
    const grad = ctx.createRadialGradient(cxBg, cyBg, 0, cxBg, cyBg, rBg);
    grad.addColorStop(0, '#0c1220');
    grad.addColorStop(0.5, '#060a12');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background stars with enhanced twinkling effect - positionnement aléatoire
    const starCount = Math.floor((canvas.width * canvas.height) / 3000); // Plus d'étoiles
    
    // Fonction pour générer un nombre pseudo-aléatoire basé sur un seed
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    for (let i = 0; i < starCount; i++) {
      // Utiliser plusieurs seeds pour plus d'aléatoire
      const seed1 = i * 7919; // Nombre premier pour meilleure distribution
      const seed2 = i * 9973; // Autre nombre premier
      const seed3 = i * 4999; // Encore un autre
      
      // Position aléatoire sur tout le canvas
      const x = seededRandom(seed1) * canvas.width;
      const y = seededRandom(seed2) * canvas.height;
      
      // Taille variable aléatoire
      const baseSize = seededRandom(seed3) * 2 + 0.5; // Entre 0.5 et 2.5
      
      // Effet de scintillement amélioré avec plusieurs fréquences
      const twinkleSpeed1 = 0.3 + seededRandom(seed1 * 1.7) * 0.6;
      const twinkleSpeed2 = 0.5 + seededRandom(seed2 * 2.3) * 0.8;
      const twinkleSpeed3 = 0.2 + seededRandom(seed3 * 1.5) * 0.4;
      
      // Combinaison de plusieurs ondes sinusoïdales pour un scintillement plus réaliste
      const phase1 = Math.sin(animationTime * twinkleSpeed1 + seed1 * 10);
      const phase2 = Math.sin(animationTime * twinkleSpeed2 + seed2 * 15);
      const phase3 = Math.sin(animationTime * twinkleSpeed3 + seed3 * 20);
      
      // Combiner les phases pour un effet plus complexe
      const combinedPhase = (phase1 * 0.4 + phase2 * 0.35 + phase3 * 0.25);
      const twinkleIntensity = combinedPhase * 0.5 + 0.5; // Entre 0 et 1
      
      // Variation de taille avec le scintillement (les étoiles "pulsent")
      const sizeVariation = 1 + twinkleIntensity * 0.3; // Variation de 0% à 30%
      const size = baseSize * sizeVariation;
      
      // Opacité qui varie avec le scintillement
      const opacity = Math.floor(100 * twinkleIntensity + 50); // Entre 50 et 150 (plus visible)
      
      // Dessiner le halo externe (plus visible quand l'étoile scintille)
      if (twinkleIntensity > 0.6) {
        const haloOpacity = Math.floor(opacity * 0.2 * twinkleIntensity);
        ctx.fillStyle = starColor + haloOpacity.toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Dessiner le halo moyen
      if (baseSize > 1.0 || twinkleIntensity > 0.5) {
        const haloOpacity = Math.floor(opacity * 0.4 * twinkleIntensity);
        ctx.fillStyle = starColor + haloOpacity.toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(x, y, size * 1.8, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Dessiner l'étoile principale
      ctx.fillStyle = starColor + opacity.toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Ajouter un point central très brillant pour les étoiles qui scintillent fort
      if (twinkleIntensity > 0.7) {
        ctx.fillStyle = '#ffffff' + Math.floor(200 * twinkleIntensity).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }


    const cx = centerX.current;
    const cy = centerY.current;
    const focusMode = !!selectedConstellation;
    const showConstellationLabels = zoom >= 1.8 || filteredConstellations.length <= 4 || focusMode;

    for (const constellation of filteredConstellations) {
      const isFocused = selectedConstellation === constellation.id;
      if (focusMode && !isFocused) ctx.globalAlpha = 0.42;
      else ctx.globalAlpha = 1;

      const starPositions: { x: number; y: number; star: Star }[] = [];
      for (const star of constellation.stars) {
        const pos = equatorialToCanvas(star.equatorial.ra, star.equatorial.dec, cx, cy, zoom, ra0, dec0);
        if (pos.x >= -50 && pos.x <= canvas.width + 50 && pos.y >= -50 && pos.y <= canvas.height + 50) {
          starPositions.push({ x: pos.x, y: pos.y, star });
        }
      }

      if (showLines && starPositions.length > 0) {
        const isSelected = isFocused;
        ctx.strokeStyle = isSelected ? 'rgba(96, 165, 250, 0.85)' : lineColor;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.shadowBlur = isSelected ? 6 : 0;
        ctx.shadowColor = isSelected ? 'rgba(96, 165, 250, 0.5)' : 'transparent';
        for (const line of constellation.lines) {
          const star1 = starPositions[line[0]];
          const star2 = starPositions[line[1]];
          if (star1 && star2) {
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }

      for (const { x, y, star } of starPositions) {
        // Magnitude → taille : échelle non linéaire (mag faible = brillant = plus grand). Formule type flux : 2.512^(-0.4*(mag - magRef)), bornée pour éviter extrêmes.
        const magRef = 2.5;
        const magScale = Math.pow(2.512, -0.4 * (star.magnitude - magRef));
        const minSize = 1.0;
        const maxSize = 5.0;
        const t = Math.max(0, Math.min(1, (magScale - 0.4) / 1.8));
        const baseSize = (minSize + t * (maxSize - minSize)) * Math.sqrt(zoom);

        const color = star.color || starColor;
        const isHovered = hoveredStar?.constellationId === constellation.id && hoveredStar?.starId === star.id;
        const pulse = isHovered ? 1 + Math.sin(animationTime * 3) * 0.2 : 1;

        // Halo (radial gradient) réservé aux étoiles les plus brillantes (mag < 1.5) ou au survol — pas de shadowBlur massif
        if (star.magnitude < 1.5 || isHovered) {
          const haloSize = baseSize * (isHovered ? 3 : 2) * pulse;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, haloSize);
          gradient.addColorStop(0, color + '35');
          gradient.addColorStop(0.4, color + '12');
          gradient.addColorStop(1, color + '00');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, haloSize, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Lueur légère (cercle semi-transparent)
        const glowSize = baseSize * (isHovered ? 1.8 : 1.3) * pulse;
        ctx.fillStyle = color + (isHovered ? '50' : '22');
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, 2 * Math.PI);
        ctx.fill();

        // Disque principal (cercle net)
        const starSize = baseSize * (isHovered ? 1.2 : 1) * pulse;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, starSize, 0, 2 * Math.PI);
        ctx.fill();

        // Centre brillant pour les plus lumineuses
        if (star.magnitude < 1.2 || isHovered) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x, y, starSize * 0.35, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Star name and info on hover
        if (isHovered) {
          ctx.font = `bold ${Math.max(12, 13 * Math.sqrt(zoom))}px var(--font-space-grotesk), sans-serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(star.name, x + starSize + 10, y - starSize - 4);
          
          if (showDistances || showCoordinates) {
            const infoLines: string[] = [];
            if (showDistances) infoLines.push(`${star.distance} al`);
            if (showCoordinates) infoLines.push(`RA: ${star.equatorial.ra.toFixed(2)}h, Dec: ${star.equatorial.dec.toFixed(2)}°`);
            if (infoLines.length > 0) {
              ctx.font = `${Math.max(10, 11 * Math.sqrt(zoom))}px var(--font-space-grotesk), sans-serif`;
              infoLines.forEach((line, idx) => {
                ctx.fillText(line, x + starSize + 10, y - starSize + 16 + idx * 14);
              });
            }
          }
          
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }
      }

      if (showConstellationLabels && starPositions.length > 0) {
        const bx = starPositions.reduce((s, p) => s + p.x, 0) / starPositions.length;
        const by = starPositions.reduce((s, p) => s + p.y, 0) / starPositions.length;
        ctx.globalAlpha = isFocused ? 1 : 0.9;
        ctx.font = `600 ${Math.max(11, 12 * Math.sqrt(zoom))}px var(--font-space-grotesk), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = isFocused ? 'rgba(220, 238, 255, 0.98)' : 'rgba(180, 215, 255, 0.78)';
        ctx.fillText(constellation.name, bx, by - 16);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    }
  }, [zoom, ra0, dec0, showLines, showDistances, showCoordinates, selectedConstellation, hoveredStar, filteredConstellations, animationTime]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationTime(prev => prev + 0.016);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(Math.max(0.5, Math.min(5, zoom + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      const sens = 0.15 / Math.max(0.5, zoom);
      setRa0(prev => (prev - dx * sens + 24) % 24);
      setDec0(prev => Math.max(-90, Math.min(90, prev + dy * sens)));
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else {
      const star = findStarAt(x, y);
      setHoveredStar(star);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // D'abord vérifier si on a cliqué sur une étoile
    const star = findStarAt(x, y);
    if (star) {
      setSelectedStar({ constellationId: star.constellationId, starId: star.starId });
      // Sélectionner aussi la constellation à laquelle appartient l'étoile
      setSelectedConstellation(star.constellationId);
      return;
    }
    
    // Sinon vérifier si on a cliqué sur une constellation
    const constellation = findConstellationAt(x, y);
    if (constellation) {
      setSelectedConstellation(constellation);
      setSelectedStar(null); // Désélectionner l'étoile si on clique sur une constellation
    } else {
      // Si on clique ailleurs, désélectionner tout
      setSelectedConstellation(null);
      setSelectedStar(null);
    }
  };

  const resetView = () => {
    setZoom(1.0);
    setRa0(0);
    setDec0(60);
    setSelectedConstellation(null);
    setSelectedStar(null);
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = selectedConstellation 
      ? CONSTELLATIONS.find(c => c.id === selectedConstellation)
      : CONSTELLATIONS;

    if (!data) return;

    if (format === 'json') {
      const jsonStr = JSON.stringify(Array.isArray(data) ? data : [data], null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `constellations-${selectedConstellation || 'all'}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvRows: string[] = [];
      const constellations = Array.isArray(data) ? data : [data];
      
      csvRows.push('Constellation,Étoile,Magnitude,Distance (al),Masse (M☉),RA,Dec');
      constellations.forEach(constellation => {
        constellation.stars.forEach(star => {
          csvRows.push(
            `"${constellation.name}","${star.name}",${star.magnitude},${star.distance},${star.mass},${star.equatorial.ra},${star.equatorial.dec}`
          );
        });
      });

      const csvStr = csvRows.join('\n');
      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `constellations-${selectedConstellation || 'all'}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const selectedConst = CONSTELLATIONS.find(c => c.id === selectedConstellation);

  // Fonction pour déterminer le type d'étoile basé sur la couleur, la magnitude et la masse
  const getStarType = (star: Star): string => {
    if (!star.color) return 'Étoile';
    
    const color = star.color.toLowerCase();
    const magnitude = star.magnitude;
    const mass = star.mass;
    
    // Supergéante rouge (rouge, très brillante, masse très élevée)
    if ((color.includes('#ff6b47') || color.includes('red')) && magnitude < 0.5 && mass > 15) {
      return 'Supergéante rouge';
    }
    
    // Géante rouge (rouge/orange, brillante, masse moyenne à élevée)
    if ((color.includes('#ff6b47') || color.includes('#ffcc6f') || color.includes('red') || color.includes('orange')) && magnitude < 2 && mass > 3) {
      return 'Géante rouge';
    }
    
    // Naine rouge (rouge, magnitude élevée, petite masse)
    if ((color.includes('#ff6b47') || color.includes('red')) && magnitude > 2 && mass < 1) {
      return 'Naine rouge';
    }
    
    // Supergéante bleue (bleue, très brillante, masse très élevée)
    if ((color.includes('#b3d9ff') || color.includes('#9bb5ff') || color.includes('blue')) && magnitude < 0.5 && mass > 15) {
      return 'Supergéante bleue';
    }
    
    // Géante bleue (bleue, brillante, masse élevée)
    if ((color.includes('#b3d9ff') || color.includes('#9bb5ff') || color.includes('blue')) && magnitude < 2 && mass > 8) {
      return 'Géante bleue';
    }
    
    // Étoile bleue chaude (bleue, magnitude moyenne à élevée)
    if (color.includes('#b3d9ff') || color.includes('#9bb5ff') || color.includes('blue')) {
      return 'Étoile bleue chaude';
    }
    
    // Géante blanche (blanche, brillante, masse élevée)
    if ((color.includes('#ffffff') || color.includes('white')) && magnitude < 1.5 && mass > 5) {
      return 'Géante blanche';
    }
    
    // Naine blanche (blanche, magnitude élevée, petite masse)
    if ((color.includes('#ffffff') || color.includes('white')) && magnitude > 4 && mass < 1.5) {
      return 'Naine blanche';
    }
    
    // Naine jaune (blanche/jaune, magnitude moyenne, masse proche du Soleil)
    // Le Soleil est une naine jaune avec magnitude ~4.8 mais visible car proche
    // Ici on considère les étoiles blanches/jaunes avec masse entre 0.8 et 1.5 masses solaires
    if ((color.includes('#ffffff') || color.includes('white') || color.includes('#fff4e6') || color.includes('#ffcc6f')) && mass >= 0.8 && mass <= 1.5) {
      if (magnitude < 2) return 'Étoile jaune brillante';
      return 'Naine jaune';
    }
    
    // Géante orange/jaune (orange/jaune, brillante, masse élevée)
    if ((color.includes('#ffcc6f') || color.includes('#fff4e6') || color.includes('orange') || color.includes('yellow')) && magnitude < 1.5 && mass > 5) {
      return 'Géante orange';
    }
    
    // Étoile orange/jaune (orange/jaune, magnitude moyenne)
    if (color.includes('#ffcc6f') || color.includes('#fff4e6') || color.includes('orange') || color.includes('yellow')) {
      return 'Étoile orange';
    }
    
    // Étoile blanche par défaut
    if (color.includes('#ffffff') || color.includes('white')) {
      return 'Étoile blanche';
    }
    
    // Étoile rouge par défaut
    if (color.includes('#ff6b47') || color.includes('red')) {
      return 'Étoile rouge';
    }
    
    return 'Étoile';
  };

  // Fonction pour obtenir l'explication de la magnitude
  const getMagnitudeExplanation = (magnitude: number): string => {
    if (magnitude < 0) {
      return `Magnitude ${magnitude.toFixed(2)} : Cette étoile est exceptionnellement brillante. Plus la magnitude est faible (voire négative), plus l'étoile est brillante. Les étoiles les plus brillantes du ciel ont une magnitude proche de 0 ou négative.`;
    } else if (magnitude < 1) {
      return `Magnitude ${magnitude.toFixed(2)} : Étoile très brillante, parmi les plus visibles à l'œil nu. Elle fait partie des étoiles de première magnitude, les plus brillantes du ciel nocturne.`;
    } else if (magnitude < 2) {
      return `Magnitude ${magnitude.toFixed(2)} : Étoile brillante de deuxième magnitude. Facilement visible à l'œil nu, elle fait partie des étoiles les plus remarquables du ciel.`;
    } else if (magnitude < 3) {
      return `Magnitude ${magnitude.toFixed(2)} : Étoile de troisième magnitude. Visible à l'œil nu dans de bonnes conditions, elle fait partie des étoiles modérément brillantes.`;
    } else if (magnitude < 4) {
      return `Magnitude ${magnitude.toFixed(2)} : Étoile de quatrième magnitude. Juste visible à l'œil nu dans un ciel sombre, elle nécessite de bonnes conditions d'observation.`;
    } else {
      return `Magnitude ${magnitude.toFixed(2)} : Étoile faible. Plus la magnitude augmente, plus l'étoile est faible. À partir de la magnitude 6, les étoiles ne sont généralement plus visibles à l'œil nu.`;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <ViewSourceButton filename="Constellations.tsx" />
      <section className="wf-section wf-hero">
        <div className="wf-hero-bg">
          <div className="wf-starfield-layer"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="curve-glow curve-glow-1"></div>
          <div className="curve-glow curve-glow-2"></div>
        </div>
        <div className="wf-inner hero-inner">
          <div className="wf-hero-content">
            <div className="wf-hero-text">
              <p className="eyebrow">Exploration Astronomique</p>
              <h1 className="wf-hero-title">
                Simulateur de<br />
                <span className="underline-wave">Constellations</span>
              </h1>
              <p className="lead">
                Explorez le ciel étoilé interactif avec {CONSTELLATIONS.length} constellations. Découvrez les mythologies, les distances et coordonnées.
                Recherche, focus sur une constellation et zoom fluide façon planétarium.
              </p>
            </div>
          </div>
        </div>
        <div className="wf-wave-divider wf-wave-bottom">
          <svg viewBox="0 0 1440 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveHeroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="40%" stopColor="#10163B" />
                <stop offset="75%" stopColor="#1B355A" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveHeroGrad)" d="M0,160 C260,220 420,80 720,140 C1040,200 1180,260 1440,200 L1440,240 L0,240 Z" />
          </svg>
        </div>
      </section>

      <section className="wf-section wf-projects">
        <div className="wf-wave-divider wf-wave-top">
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
          <div className="constellations-wrapper">
            <div className="constellations-container" ref={containerRef}>
              <canvas
                ref={canvasRef}
                id="constellations-canvas"
                className="constellations-canvas"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleClick}
              />
            </div>

            {selectedConst && (
              <div className={`constellation-info visible ${selectedConstellation ? 'constellation-info--focus' : ''}`} style={infoPanelStyle} data-focus-constellation={selectedConstellation || undefined}>
                <div className="info-header">
                  <h3>{selectedConst.name} ({selectedConst.nameLatin})</h3>
                  <button className="info-close" onClick={() => setSelectedConstellation(null)}>×</button>
                </div>
                <div className="info-content">
                  <div className="info-section">
                    <div className="info-section-title">Description</div>
                    <div className="info-section-content">{selectedConst.description}</div>
                  </div>
                  {showMythology && (
                    <div className="info-section">
                      <div className="info-section-title">Mythologie</div>
                      <div className="info-section-content">{getMythology(selectedConst.id) || selectedConst.mythology}</div>
                    </div>
                  )}
                  <div className="info-section">
                    <div className="info-section-title">Étoiles ({selectedConst.stars.length})</div>
                    <ul className="info-stars-list">
                      {selectedConst.stars.map(star => (
                        <li key={star.id} className="info-star-name">
                          {star.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedStar && (() => {
              const constellation = CONSTELLATIONS.find(c => c.id === selectedStar.constellationId);
              const star = constellation?.stars.find(s => s.id === selectedStar.starId);
              if (!star || !constellation) return null;
              
              const starType = getStarType(star);
              
              return (
                <div className="star-info visible" style={starInfoPanelStyle}>
                  <div className="info-header">
                    <h3>{star.name}</h3>
                    <button className="info-close" onClick={() => setSelectedStar(null)}>×</button>
                  </div>
                  <div className="info-content">
                    {star.color && (
                      <div className="info-section">
                        <div className="info-section-title">Couleur et Type</div>
                        <div className="info-section-content">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: star.color, borderRadius: '50%', border: '2px solid rgba(125, 243, 255, 0.5)', boxShadow: '0 0 10px ' + star.color }}></div>
                            <span style={{ fontWeight: 600 }}>{starType}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="info-section">
                      <div className="info-section-title">Distance</div>
                      <div className="info-section-content">{star.distance} années-lumière</div>
                    </div>
                    <div className="info-section">
                      <div className="info-section-title">Masse</div>
                      <div className="info-section-content">{star.mass} M☉ (masses solaires)</div>
                    </div>
                    <div className="info-section">
                      <div className="info-section-title">Magnitude apparente</div>
                      <div className="info-section-content">
                        <div style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
                          {star.magnitude.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '0.75rem' }}>
                          {getMagnitudeExplanation(star.magnitude)}
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.6', fontStyle: 'italic', paddingTop: '0.75rem', borderTop: '1px solid rgba(125, 243, 255, 0.1)' }}>
                          La magnitude est une échelle qui mesure la luminosité des astres.<br />
                          Elle est inverse : une magnitude plus faible signifie un astre plus brillant. Limite à l'œil nu +6
                        </div>
                      </div>
                    </div>
                    {showCoordinates && (
                      <div className="info-section">
                        <div className="info-section-title">Coordonnées équatoriales</div>
                        <div className="info-section-content">
                          <div>Ascension droite: {star.equatorial.ra.toFixed(2)}h</div>
                          <div>Déclinaison: {star.equatorial.dec.toFixed(2)}°</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="constellations-controls">
              <div className="controls-section">
                <h4 className="controls-title">Recherche</h4>
                <div className="control-group control-group--search">
                  <input
                    type="text"
                    placeholder="Constellation ou étoile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="constellation-search-input"
                    list="constellation-suggestions"
                    autoComplete="off"
                    aria-label="Rechercher une constellation ou une étoile"
                  />
                  <datalist id="constellation-suggestions">
                    {CONSTELLATIONS.map(c => (
                      <option key={c.id} value={c.name} />
                    ))}
                    {CONSTELLATIONS.map(c => (
                      <option key={`${c.id}-lat`} value={c.nameLatin} />
                    ))}
                  </datalist>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setSelectedConstellation(null); }}
                      className="constellation-btn constellation-btn--clear"
                      aria-label="Effacer la recherche"
                    >
                      Effacer
                    </button>
                  )}
                  {searchQuery.trim() && (
                    <p className={`search-hint ${filteredConstellations.length === 0 ? 'search-hint--empty' : ''}`} role="status">
                      {filteredConstellations.length === 0
                        ? 'Aucune constellation trouvée'
                        : filteredConstellations.length === 1
                          ? '1 constellation'
                          : `${filteredConstellations.length} résultats`}
                    </p>
                  )}
                </div>
              </div>

              <div className="controls-section">
                <h4 className="controls-title">Affichage</h4>
                <div className="control-group">
                  <label className="control-checkbox">
                    <input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} />
                    <span className="checkbox-label">Lignes de connexion</span>
                  </label>
                  <label className="control-checkbox">
                    <input type="checkbox" checked={showMythology} onChange={(e) => setShowMythology(e.target.checked)} />
                    <span className="checkbox-label">Mythologie</span>
                  </label>
                  <label className="control-checkbox">
                    <input type="checkbox" checked={showDistances} onChange={(e) => setShowDistances(e.target.checked)} />
                    <span className="checkbox-label">Distances</span>
                  </label>
                  <label className="control-checkbox">
                    <input type="checkbox" checked={showCoordinates} onChange={(e) => setShowCoordinates(e.target.checked)} />
                    <span className="checkbox-label">Coordonnées</span>
                  </label>
                </div>
              </div>

              <div className="controls-section">
                <h4 className="controls-title">Navigation</h4>
                <div className="control-group">
                  <label>
                    <span className="label-text">Zoom:</span>
                    <span className="label-value">{zoom.toFixed(1)}x</span>
                  </label>
                  <input
                    type="range"
                    id="zoom-slider"
                    className="control-slider"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                  />
                </div>
                <div className="control-buttons">
                  <button onClick={resetView} className="constellation-btn constellation-btn--reset">
                    Reset
                  </button>
                </div>
              </div>

              <div className="controls-section">
                <h4 className="controls-title">Export</h4>
                <div className="control-buttons">
                  <button 
                    onClick={() => exportData('json')} 
                    className="constellation-btn constellation-btn--export"
                    disabled={!selectedConstellation}
                  >
                    Export JSON
                  </button>
                  <button 
                    onClick={() => exportData('csv')} 
                    className="constellation-btn constellation-btn--export"
                    disabled={!selectedConstellation}
                  >
                    Export CSV
                  </button>
                </div>
                {selectedConstellation && (
                  <p className="export-hint">
                    Export de {selectedConst?.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

