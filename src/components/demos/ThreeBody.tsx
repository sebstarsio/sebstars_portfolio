'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import type { ArchitectureNotesData } from '@/components/ui/ArchitectureNotes';
import '../../styles/demos/three-body.css';

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
  trail: { x: number; y: number }[];
  maxTrail: number;
}

interface Energy {
  kinetic: number;
  potential: number;
  total: number;
}

interface SimulationConfig {
  G: number;
  DT: number;
  vFactor: number;
  masses: number[];
  palette: string;
  scientificMode: boolean;
  bodyCount: number;
  name?: string;
  timestamp?: number;
}

const PALETTES: Record<string, string[]> = {
  classic: ['#ff6bcb', '#46e6ff', '#ffe66b', '#ff9b6b', '#a96bff', '#4bd9ff'],
  neon: ['#ff2e92', '#32ffe3', '#e4ff54', '#ff6b6b', '#ffc26b', '#ffd36b'],
  nebula: ['#a96bff', '#4bd9ff', '#ff9b6b', '#ff6bcb', '#46e6ff', '#ffe66b'],
  nova: ['#ffc26b', '#ff6b6b', '#ffd36b', '#ff2e92', '#32ffe3', '#e4ff54'],
};

interface ThreeBodyProps {
  architectureNotes?: ArchitectureNotesData;
  lang?: 'fr' | 'en';
}

export default function ThreeBody({ architectureNotes, lang = 'fr' }: ThreeBodyProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bodyMeshesRef = useRef<THREE.Mesh[]>([]);
  const trailLinesRef = useRef<THREE.Line[]>([]);
  
  const [bodies, setBodies] = useState<Body[]>([]);
  const [G, setG] = useState(0.4);
  const [DT, setDT] = useState(0.05);
  const [vFactor, setVFactor] = useState(1.0);
  const [mass1, setMass1] = useState(25);
  const [mass2, setMass2] = useState(25);
  const [mass3, setMass3] = useState(30);
  const [mass4, setMass4] = useState(20);
  const [mass5, setMass5] = useState(15);
  const [bodyCount, setBodyCount] = useState(3);
  const [palette, setPalette] = useState('classic');
  const [scientificMode, setScientificMode] = useState(false);
  const [educationalMode, setEducationalMode] = useState(false);
  const [use3D, setUse3D] = useState(true);
  const [energy, setEnergy] = useState<Energy>({ kinetic: 0, potential: 0, total: 0 });
  const [simTime, setSimTime] = useState(0);
  const [trajectoryHistory, setTrajectoryHistory] = useState<Array<{ time: number; bodies: Array<{ x: number; y: number; vx: number; vy: number; mass: number }> }>>([]);
  const [savedConfigs, setSavedConfigs] = useState<SimulationConfig[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonBodies, setComparisonBodies] = useState<Body[]>([]);

  const getMasses = useCallback(() => {
    return [mass1, mass2, mass3, mass4, mass5].slice(0, bodyCount);
  }, [mass1, mass2, mass3, mass4, mass5, bodyCount]);

  const createBody = useCallback((x: number, y: number, vx: number, vy: number, mass: number, color: string): Body => {
    return {
      x,
      y,
      vx,
      vy,
      mass,
      color,
      trail: [],
      maxTrail: 600,
    };
  }, []);

  // Initialisation Three.js
  useEffect(() => {
    if (!containerRef.current || !use3D) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.min(600, window.innerHeight * 0.6);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.z = 500;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices: number[] = [];
    for (let i = 0; i < 2000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = Math.min(600, window.innerHeight * 0.6);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [use3D]);

  // Create 3D meshes for bodies
  useEffect(() => {
    if (!sceneRef.current || !use3D) return;

    const scene = sceneRef.current;
    
    // Clear existing meshes
    bodyMeshesRef.current.forEach(mesh => scene.remove(mesh));
    trailLinesRef.current.forEach(line => scene.remove(line));
    bodyMeshesRef.current = [];
    trailLinesRef.current = [];

    // Create meshes for each body
    bodies.forEach((body, index) => {
      const radius = Math.sqrt(body.mass) * 2;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: body.color,
        emissive: body.color,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.4,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(body.x - 500, body.y - 300, 0);
      scene.add(mesh);
      bodyMeshesRef.current.push(mesh);

      // Trail line
      if (body.trail.length > 1) {
        const trailGeometry = new THREE.BufferGeometry();
        const trailVertices = body.trail.map(p => new THREE.Vector3(p.x - 500, p.y - 300, 0));
        trailGeometry.setFromPoints(trailVertices);
        const trailMaterial = new THREE.LineBasicMaterial({
          color: body.color,
          linewidth: 2,
          transparent: true,
          opacity: 0.6,
        });
        const trailLine = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(trailLine);
        trailLinesRef.current.push(trailLine);
      }
    });
  }, [bodies, use3D]);

  const stepPhysics = useCallback(() => {
    let currentBodies: Body[] = [];
    setBodies(prev => {
      const newBodies = prev.map(b => ({ ...b }));
      const forces = newBodies.map(() => ({ fx: 0, fy: 0 }));

      for (let i = 0; i < newBodies.length; i++) {
        for (let j = i + 1; j < newBodies.length; j++) {
          const bi = newBodies[i];
          const bj = newBodies[j];
          const dx = bj.x - bi.x;
          const dy = bj.y - bi.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq) || 0.0001;
          const forceMag = (G * bi.mass * bj.mass) / (distSq + 0.0001);
          const fx = (forceMag * dx) / dist;
          const fy = (forceMag * dy) / dist;
          forces[i].fx += fx;
          forces[i].fy += fy;
          forces[j].fx -= fx;
          forces[j].fy -= fy;
        }
      }

      for (let i = 0; i < newBodies.length; i++) {
        const b = newBodies[i];
        const f = forces[i];
        const ax = f.fx / b.mass;
        const ay = f.fy / b.mass;
        b.vx += ax * DT;
        b.vy += ay * DT;
        b.x += b.vx * DT;
        b.y += b.vy * DT;
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > b.maxTrail) {
          b.trail.shift();
        }
      }

      currentBodies = newBodies;
      return newBodies;
    });
    
    setSimTime(prev => {
      const newTime = prev + DT;
      if (Math.floor(newTime * 10) % 5 === 0 && currentBodies.length > 0) {
        setTrajectoryHistory(historyPrev => {
          const newHistory = [...historyPrev];
          newHistory.push({
            time: newTime,
            bodies: currentBodies.map(b => ({ x: b.x, y: b.y, vx: b.vx, vy: b.vy, mass: b.mass }))
          });
          if (newHistory.length > 1000) {
            newHistory.shift();
          }
          return newHistory;
        });
      }
      return newTime;
    });
  }, [G, DT]);

  // Update 3D scene and physics
  useEffect(() => {
    if (!use3D || !sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        stepPhysics();
        lastTime = currentTime;
      }
      
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

      // Update body positions
      bodies.forEach((body, index) => {
        if (bodyMeshesRef.current[index]) {
          bodyMeshesRef.current[index].position.set(body.x - 500, body.y - 300, 0);
          const radius = Math.sqrt(body.mass) * 2;
          bodyMeshesRef.current[index].scale.set(radius / 10, radius / 10, radius / 10);
        }

        // Update trails
        if (body.trail.length > 1) {
          if (!trailLinesRef.current[index]) {
            const trailGeometry = new THREE.BufferGeometry();
            const trailMaterial = new THREE.LineBasicMaterial({
              color: body.color,
              linewidth: 2,
              transparent: true,
              opacity: 0.6,
            });
            const trailLine = new THREE.Line(trailGeometry, trailMaterial);
            if (sceneRef.current) {
              sceneRef.current.add(trailLine);
              trailLinesRef.current[index] = trailLine;
            }
          }
          const trailGeometry = new THREE.BufferGeometry();
          const trailVertices = body.trail.map(p => new THREE.Vector3(p.x - 500, p.y - 300, 0));
          trailGeometry.setFromPoints(trailVertices);
          trailLinesRef.current[index].geometry.dispose();
          trailLinesRef.current[index].geometry = trailGeometry;
        }
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bodies, use3D, stepPhysics]);

  const initDefault = useCallback(() => {
    const cols = PALETTES[palette];
    const masses = getMasses();
    const centerX = 500;
    const centerY = 300;
    const newBodies: Body[] = [];
    
    for (let i = 0; i < bodyCount; i++) {
      const angle = (i / bodyCount) * Math.PI * 2;
      const radius = 100 + i * 20;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const vMag = (0.8 + i * 0.2) * vFactor;
      const vx = -Math.sin(angle) * vMag;
      const vy = Math.cos(angle) * vMag;
      newBodies.push(createBody(x, y, vx, vy, masses[i], cols[i % cols.length]));
    }
    
    setBodies(newBodies);
    setSimTime(0);
    setTrajectoryHistory([]);
  }, [bodyCount, palette, vFactor, getMasses, createBody]);

  const initRandom = useCallback(() => {
    const cols = PALETTES[palette];
    const masses = getMasses();
    const centerX = 500;
    const centerY = 300;
    const newBodies: Body[] = [];
    
    for (let i = 0; i < bodyCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 200;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const base = (Math.random() * 1.2 + 0.2) * vFactor;
      const vMag = base * (Math.random() < 0.5 ? 1 : -1);
      const vx = -Math.sin(angle) * vMag;
      const vy = Math.cos(angle) * vMag;
      newBodies.push(createBody(x, y, vx, vy, masses[i], cols[i % cols.length]));
    }
    
    setBodies(newBodies);
    setSimTime(0);
    setTrajectoryHistory([]);
  }, [bodyCount, palette, vFactor, getMasses, createBody]);

  const presetQuasiStable = useCallback(() => {
    initDefault();
  }, [initDefault]);

  const presetChaos = useCallback(() => {
    const cols = PALETTES[palette];
    const masses = getMasses();
    const centerX = 500;
    const centerY = 300;
    const enhancedVFactor = vFactor * 1.4;
    const newBodies: Body[] = [];
    
    for (let i = 0; i < bodyCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 250;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const vMag = (1.5 + Math.random() * 1.5) * enhancedVFactor;
      const vx = Math.cos(angle + Math.PI / 2) * vMag;
      const vy = Math.sin(angle + Math.PI / 2) * vMag;
      newBodies.push(createBody(x, y, vx, vy, masses[i], cols[i % cols.length]));
    }
    
    setBodies(newBodies);
    setSimTime(0);
    setTrajectoryHistory([]);
  }, [bodyCount, palette, vFactor, getMasses, createBody]);

  const presetCollision = useCallback(() => {
    const cols = PALETTES[palette];
    const masses = getMasses();
    const centerX = 500;
    const centerY = 300;
    const newBodies: Body[] = [];
    
    for (let i = 0; i < bodyCount; i++) {
      const angle = (i / bodyCount) * Math.PI * 2;
      const radius = 150;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const vx = -Math.sin(angle) * vFactor * 1.2;
      const vy = Math.cos(angle) * vFactor * 1.2;
      newBodies.push(createBody(x, y, vx, vy, masses[i], cols[i % cols.length]));
    }
    
    setBodies(newBodies);
    setSimTime(0);
    setTrajectoryHistory([]);
  }, [bodyCount, palette, vFactor, getMasses, createBody]);

  useEffect(() => {
    initDefault();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- rendu initial à t=0, une seule fois au montage
  }, []);

  // Canvas 2D fallback
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    if (use3D) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const w = container.clientWidth;
    const h = Math.min(600, window.innerHeight * 0.6);
    canvas.width = w;
    canvas.height = h;
    setWidth(w);
    setHeight(h);
  }, [use3D]);

  const draw2D = useCallback(() => {
    if (use3D || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, width, height);

    bodies.forEach(b => {
      if (b.trail.length < 2) return;
      
      const gradient = ctx.createLinearGradient(
        b.trail[0].x,
        b.trail[0].y,
        b.trail[b.trail.length - 1].x,
        b.trail[b.trail.length - 1].y
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      gradient.addColorStop(0.5, b.color + '80');
      gradient.addColorStop(1, b.color);

      ctx.beginPath();
      ctx.moveTo(b.trail[0].x, b.trail[0].y);
      for (let i = 1; i < b.trail.length; i++) {
        ctx.lineTo(b.trail[i].x, b.trail[i].y);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      const radius = Math.sqrt(b.mass) * 0.8;
      
      const haloGradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius * 1.5);
      haloGradient.addColorStop(0, b.color + '40');
      haloGradient.addColorStop(1, b.color + '00');
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      const bodyGradient = ctx.createRadialGradient(b.x - radius * 0.3, b.y - radius * 0.3, 0, b.x, b.y, radius);
      bodyGradient.addColorStop(0, b.color + 'FF');
      bodyGradient.addColorStop(1, b.color + 'CC');
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x - radius * 0.2, b.y - radius * 0.2, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [bodies, width, height, use3D]);

  useEffect(() => {
    if (use3D) return;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        stepPhysics();
        draw2D();
        lastTime = currentTime;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (bodies.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bodies.length, stepPhysics, draw2D, use3D]);

  const computeEnergy = useCallback((): Energy => {
    let kinetic = 0;
    let potential = 0;

    bodies.forEach(b => {
      const v2 = b.vx * b.vx + b.vy * b.vy;
      kinetic += 0.5 * b.mass * v2;
    });

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const bi = bodies[i];
        const bj = bodies[j];
        const dx = bj.x - bi.x;
        const dy = bj.y - bi.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        potential += -(G * bi.mass * bj.mass) / dist;
      }
    }

    return { kinetic, potential, total: kinetic + potential };
  }, [bodies, G]);

  useEffect(() => {
    if (bodies.length > 0) {
      setEnergy(computeEnergy());
    }
  }, [bodies, computeEnergy]);

  // Save/Load configurations
  const handleSaveConfig = () => {
    const config: SimulationConfig = {
      G,
      DT,
      vFactor,
      masses: getMasses(),
      palette,
      scientificMode,
      bodyCount,
      name: `Config ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(),
    };
    const saved = [...savedConfigs, config];
    setSavedConfigs(saved);
    localStorage.setItem('threeBodyConfigs', JSON.stringify(saved));
  };

  const handleLoadConfig = (config: SimulationConfig) => {
    setG(config.G);
    setDT(config.DT);
    setVFactor(config.vFactor);
    setPalette(config.palette);
    setScientificMode(config.scientificMode);
    setBodyCount(config.bodyCount);
    if (config.masses[0]) setMass1(config.masses[0]);
    if (config.masses[1]) setMass2(config.masses[1]);
    if (config.masses[2]) setMass3(config.masses[2]);
    if (config.masses[3]) setMass4(config.masses[3]);
    if (config.masses[4]) setMass5(config.masses[4]);
    setTimeout(() => initDefault(), 100);
  };

  const handleDeleteConfig = (index: number) => {
    const newConfigs = savedConfigs.filter((_, i) => i !== index);
    setSavedConfigs(newConfigs);
    localStorage.setItem('threeBodyConfigs', JSON.stringify(newConfigs));
  };

  useEffect(() => {
    const saved = localStorage.getItem('threeBodyConfigs');
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved configs:', e);
      }
    }
  }, []);

  // Comparison mode
  const handleStartComparison = () => {
    setComparisonBodies([...bodies]);
    setComparisonMode(true);
  };

  const handleStopComparison = () => {
    setComparisonMode(false);
    setComparisonBodies([]);
  };

  const handleExport = () => {
    const config: SimulationConfig = {
      G,
      DT,
      vFactor,
      masses: getMasses(),
      palette,
      scientificMode,
      bodyCount,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'three-body-config.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config: SimulationConfig = JSON.parse(event.target?.result as string);
        handleLoadConfig(config);
      } catch (error) {
        alert('Erreur lors du chargement de la configuration');
      }
    };
    reader.readAsText(file);
  };

  const handleExportTrajectories = () => {
    const data = {
      config: { G, DT, vFactor, masses: getMasses(), palette, scientificMode, bodyCount },
      trajectories: trajectoryHistory,
      energy: energy,
      simulationTime: simTime,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `three-body-trajectories-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['Time', ...bodies.flatMap((_, i) => [`Body${i+1}_X`, `Body${i+1}_Y`, `Body${i+1}_VX`, `Body${i+1}_VY`])];
    const rows = trajectoryHistory.map(t => {
      return [t.time, ...t.bodies.flatMap(b => [b.x, b.y, b.vx, b.vy])].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `three-body-trajectories-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
        <div className="wf-inner hero-inner">
          <div className="wf-hero-content">
            <div className="wf-hero-text">
              <p className="eyebrow">Simulation Physique</p>
              <h1 className="wf-hero-title">
                Problème à N Corps<br />
                <span className="underline-wave">Chaos Déterministe</span>
              </h1>
              <p className="lead">
                Simulation interactive du problème à N corps en gravitation newtonienne avec rendu WebGL/Three.js.
                Explorez le chaos déterministe avec 3 à 5 corps.
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
        <div className="wf-wave-divider wf-wave-top three-body-wave-parasite">
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
          <div className="three-body-controls">
            <div className="control-buttons">
              <button onClick={initDefault} className="control-btn">Reset</button>
              <button onClick={initRandom} className="control-btn">Random</button>
              <button onClick={presetQuasiStable} className="control-btn">Quasi stable</button>
              <button onClick={presetChaos} className="control-btn">Hyper chaotique</button>
              <button onClick={presetCollision} className="control-btn">Collision</button>
              <select value={palette} onChange={(e) => setPalette(e.target.value)} className="control-select">
                <option value="classic">Palette : Classic</option>
                <option value="neon">Palette : Neon</option>
                <option value="nebula">Palette : Nebula</option>
                <option value="nova">Palette : Nova Warm</option>
              </select>
              <label className="toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={use3D} onChange={(e) => setUse3D(e.target.checked)} />
                <span>WebGL 3D</span>
              </label>
              <button onClick={handleSaveConfig} className="control-btn">💾 Sauvegarder</button>
              <label className="control-btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
                📁 Charger
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
              </label>
              <button onClick={handleExport} className="control-btn">Exporter Config</button>
              <button onClick={handleExportTrajectories} className="control-btn" disabled={trajectoryHistory.length === 0}>
                Exporter Trajectoires (JSON)
              </button>
              <button onClick={handleExportCSV} className="control-btn" disabled={trajectoryHistory.length === 0}>
                Exporter CSV
              </button>
              {!comparisonMode ? (
                <button onClick={handleStartComparison} className="control-btn">🔬 Comparer</button>
              ) : (
                <button onClick={handleStopComparison} className="control-btn">❌ Arrêter comparaison</button>
              )}
              <span className="energy-display">
                E: {energy.total.toFixed(2)} | K: {energy.kinetic.toFixed(2)} | P: {energy.potential.toFixed(2)}
              </span>
            </div>
          </div>

          {savedConfigs.length > 0 && (
            <div className="saved-configs" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <div className="group-title" style={{ marginBottom: '0.5rem' }}>Configurations sauvegardées</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {savedConfigs.map((config, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                    <button onClick={() => handleLoadConfig(config)} className="control-btn" style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}>
                      📂 {config.name || `Config ${index + 1}`}
                    </button>
                    <button onClick={() => handleDeleteConfig(index)} className="control-btn" style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)' }}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="three-body-panel">
            <div className="control-group">
              <div className="group-title">Nombre de corps</div>
              <div className="slider-row">
                <label>Corps</label>
                <input type="range" min="3" max="5" step="1" value={bodyCount} onChange={(e) => setBodyCount(Number(e.target.value))} />
                <div className="value">{bodyCount}</div>
              </div>
            </div>

            <div className="control-group">
              <div className="group-title">Masses (unités arbitraires)</div>
              <div className="slider-row">
                <label>M1</label>
                <input type="range" min="10" max="60" step="1" value={mass1} onChange={(e) => setMass1(Number(e.target.value))} disabled={bodyCount < 1} />
                <div className="value">{mass1}</div>
              </div>
              <div className="slider-row">
                <label>M2</label>
                <input type="range" min="10" max="60" step="1" value={mass2} onChange={(e) => setMass2(Number(e.target.value))} disabled={bodyCount < 2} />
                <div className="value">{mass2}</div>
              </div>
              <div className="slider-row">
                <label>M3</label>
                <input type="range" min="10" max="60" step="1" value={mass3} onChange={(e) => setMass3(Number(e.target.value))} disabled={bodyCount < 3} />
                <div className="value">{mass3}</div>
              </div>
              <div className="slider-row">
                <label>M4</label>
                <input type="range" min="10" max="60" step="1" value={mass4} onChange={(e) => setMass4(Number(e.target.value))} disabled={bodyCount < 4} />
                <div className="value">{mass4}</div>
              </div>
              <div className="slider-row">
                <label>M5</label>
                <input type="range" min="10" max="60" step="1" value={mass5} onChange={(e) => setMass5(Number(e.target.value))} disabled={bodyCount < 5} />
                <div className="value">{mass5}</div>
              </div>
            </div>

            <div className="control-group">
              <div className="group-title">Vitesse & Gravité</div>
              <div className="slider-row">
                <label>V₀</label>
                <input type="range" min="0.4" max="2.0" step="0.1" value={vFactor} onChange={(e) => setVFactor(Number(e.target.value))} />
                <div className="value">{vFactor.toFixed(1)}×</div>
              </div>
              <div className="slider-row">
                <label>G</label>
                <input type="range" min="0.1" max="1.0" step="0.05" value={G} onChange={(e) => setG(Number(e.target.value))} />
                <div className="value">{G.toFixed(2)}</div>
              </div>
              <div className="slider-row">
                <label>dt</label>
                <input type="range" min="0.01" max="0.12" step="0.01" value={DT} onChange={(e) => setDT(Number(e.target.value))} />
                <div className="value">{DT.toFixed(2)}</div>
              </div>
            </div>

            <div className="control-group">
              <div className="group-title">Modes</div>
              <label className="toggle">
                <input type="checkbox" checked={scientificMode} onChange={(e) => setScientificMode(e.target.checked)} />
                Mode scientifique
              </label>
              <label className="toggle">
                <input type="checkbox" checked={educationalMode} onChange={(e) => setEducationalMode(e.target.checked)} />
                Mode éducatif
              </label>
              {scientificMode && (
                <div className="scientific-hint">
                  - 1 px ≈ 100 000 km<br />
                  - 1 unité de temps ≈ 1 heure<br />
                  - Vitesses en km/s
                </div>
              )}
            </div>
          </div>

          <div className="three-body-canvas-wrapper">
            <div className="three-body-canvas-container">
              {use3D ? (
                <div ref={containerRef} style={{ width: '100%', height: '600px', position: 'relative' }}></div>
              ) : (
                <canvas ref={canvasRef} id="simCanvas" style={{ width: '100%', height: '600px', display: 'block' }}></canvas>
              )}
              <div className="hint">
                Astuce : change les masses, G, dt, les palettes et les presets pour explorer des comportements chaotiques uniques.
                {use3D && ' Mode WebGL 3D activé pour un rendu avancé.'}
              </div>
              {scientificMode && (
                <div className="sci-overlay">
                  Temps: {simTime.toFixed(2)} | Corps: {bodyCount} | {use3D ? 'WebGL 3D' : 'Canvas 2D'}
                </div>
              )}
            </div>
            {educationalMode && (
              <div className="educational-panel">
                <div className="edu-title">💡 Explications scientifiques</div>
                <div className="edu-content">
                  <p><strong>Problème à N Corps :</strong> {bodyCount} masses s&apos;attirent mutuellement selon la loi de la gravitation universelle de Newton (F = G × m₁ × m₂ / r²).</p>
                  <p><strong>Chaos déterministe :</strong> Même avec des équations déterministes, de petites variations initiales produisent des trajectoires complètement différentes (effet papillon).</p>
                  <p><strong>Conservation de l&apos;énergie :</strong> L&apos;énergie totale (cinétique + potentielle) reste constante dans un système isolé. Observez E, K et P ci-dessus.</p>
                  <p><strong>Rendu WebGL :</strong> Le mode 3D utilise Three.js/WebGL pour un rendu accéléré par GPU avec effets de lumière et matériaux avancés.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
