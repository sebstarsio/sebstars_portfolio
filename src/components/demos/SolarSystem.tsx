'use client';

import { useEffect, useRef, useState } from 'react';
import { PLANETS_DATA, PlanetData, formatDistance, formatPeriod } from '@/lib/demos/solar-system-data';
import type { ArchitectureNotesData } from '@/components/ui/ArchitectureNotes';
import '../../styles/demos/solar-system.css';

// Interface simple pour l'animation CSS (gardée pour compatibilité)
interface PlanetSimple {
  name: string;
  speed: string;
  revolution: string;
  mass: string;
  moons: string;
  className: string;
  orbitClass: string;
}

// Mapping des noms vers les classes CSS
const PLANET_CLASSES: Record<string, { className: string; orbitClass: string }> = {
  'Soleil': { className: 'sun', orbitClass: '' },
  'Mercure': { className: 'planet mercury', orbitClass: 'mercury-orbit' },
  'Vénus': { className: 'planet venus', orbitClass: 'venus-orbit' },
  'Terre': { className: 'planet earth', orbitClass: 'earth-orbit' },
  'Mars': { className: 'planet mars', orbitClass: 'mars-orbit' },
  'Jupiter': { className: 'planet jupiter', orbitClass: 'jupiter-orbit' },
  'Saturne': { className: 'planet saturn', orbitClass: 'saturn-orbit' },
  'Uranus': { className: 'planet uranus', orbitClass: 'uranus-orbit' },
  'Neptune': { className: 'planet neptune', orbitClass: 'neptune-orbit' },
};

// Conversion des données détaillées vers le format simple pour l'animation
const PLANETS: PlanetSimple[] = PLANETS_DATA.map(planet => {
  const classes = PLANET_CLASSES[planet.name] || { className: 'planet', orbitClass: '' };
  return {
    name: planet.name,
    speed: planet.distance === 0 ? 'Étoile centrale' : `${planet.speed.toFixed(2)} km/s`,
    revolution: planet.distance === 0 ? 'Notre étoile' : formatPeriod(planet.period),
    mass: planet.mass.toExponential(2) + ' kg',
    moons: planet.moons.length.toString(),
    className: classes.className,
    orbitClass: classes.orbitClass,
  };
});

interface SolarSystemProps {
  architectureNotes?: ArchitectureNotesData;
  lang?: 'fr' | 'en';
}

export default function SolarSystem({ architectureNotes, lang = 'fr' }: SolarSystemProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scale, setScale] = useState(0.7);
  const [selectedPlanetSimple, setSelectedPlanetSimple] = useState<PlanetSimple | null>(PLANETS[0]);
  const [educationalMode, setEducationalMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [comparisonPlanet, setComparisonPlanet] = useState<PlanetData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const lastWheelTime = useRef(0);
  const MOBILE_BREAKPOINT = 768;
  /** Taille de l'orbite la plus externe en px (neptune) — mobile = 600 (solar-system.css), desktop = 960 */
  const ORBIT_SIZE_MOBILE = 600;
  const ORBIT_SIZE_DESKTOP = 960;

  // Sur mobile : calculer l'échelle pour remplir le conteneur (évite système minuscule + bordures vides)
  useEffect(() => {
    const updateMobileScale = () => {
      if (typeof window === 'undefined' || window.innerWidth >= MOBILE_BREAKPOINT) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const orbitSize = ORBIT_SIZE_MOBILE;
      const scaleToFit = (Math.min(rect.width, rect.height) / orbitSize) * 0.9;
      const next = Math.min(1.1, Math.max(0.35, scaleToFit));
      setScale(prev => (Math.abs(prev - next) < 0.02 ? prev : next));
    };
    const raf = requestAnimationFrame(() => updateMobileScale());
    const timeout = setTimeout(updateMobileScale, 150);
    window.addEventListener('resize', updateMobileScale);
    const container = containerRef.current;
    const observer =
      typeof ResizeObserver !== 'undefined' && container
        ? new ResizeObserver(updateMobileScale)
        : null;
    if (observer && container) observer.observe(container);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      window.removeEventListener('resize', updateMobileScale);
      observer?.disconnect();
    };
  }, []);

  // Filtrer les planètes selon la recherche
  const filteredPlanets = PLANETS_DATA.filter(planet =>
    planet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    planet.nameLatin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculer les statistiques globales
  const totalMoons = PLANETS_DATA.reduce((sum, p) => sum + p.moons.length, 0);
  const totalMass = PLANETS_DATA.reduce((sum, p) => sum + p.mass, 0);
  const averageDistance = PLANETS_DATA
    .filter(p => p.distance > 0)
    .reduce((sum, p) => sum + p.distance, 0) / (PLANETS_DATA.length - 1);
  const largestPlanet = PLANETS_DATA.reduce((max, p) => p.radius > max.radius ? p : max, PLANETS_DATA[1]);
  const hottestPlanet = PLANETS_DATA.reduce((max, p) => p.temperature > max.temperature ? p : max, PLANETS_DATA[0]);

  // Trouver les données détaillées correspondantes
  const selectedPlanet = selectedPlanetSimple
    ? PLANETS_DATA.find(p => p.name === selectedPlanetSimple.name) || null
    : null;

  useEffect(() => {
    if (!containerRef.current || !systemRef.current) return;

    // Position verticale : ne jamais pousser la démo sous le Hero (évite le chevauchement sur desktop/mobile)
    const updateSystemPosition = () => {
      const heroSection = document.querySelector('.wf-hero');
      if (!containerRef.current || !systemRef.current) return;

      let translateY = 0;
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = containerRect.top;
        const neptuneRadius = 480 * scale;
        const offset = heroBottom - containerTop - neptuneRadius + 50;
        // Clamp : ne jamais appliquer un translateY négatif qui masquerait la démo sous le Hero
        translateY = Math.max(0, offset);
      }

      systemRef.current.style.transform = `translateY(${translateY}px) scale3d(${scale}, ${scale}, 1)`;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < 16) return;
      lastWheelTime.current = now;

      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.min(Math.max(0.5, scale + delta), 2);
      setScale(newScale);
      updateSystemPosition();
    };

    // Mettre à jour la position au chargement et au redimensionnement
    updateSystemPosition();
    window.addEventListener('resize', updateSystemPosition);
    window.addEventListener('scroll', updateSystemPosition);

    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      containerRef.current?.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateSystemPosition);
      window.removeEventListener('scroll', updateSystemPosition);
    };
  }, [scale]);

  // Mettre à jour la position quand le scale change (même règle : pas de translateY négatif)
  useEffect(() => {
    if (!containerRef.current || !systemRef.current) return;

    let translateY = 0;
    const heroSection = document.querySelector('.wf-hero');
    if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      const heroBottom = heroRect.bottom;
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const neptuneRadius = 480 * scale;
      const offset = heroBottom - containerTop - neptuneRadius + 50;
      translateY = Math.max(0, offset);
    }
    systemRef.current.style.transform = `translateY(${translateY}px) scale3d(${scale}, ${scale}, 1)`;
  }, [scale]);

  // Le scale est maintenant géré dans le premier useEffect avec updateSystemPosition

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetSystem = () => {
    setIsPaused(false);
    setScale(1);
    if (systemRef.current) {
      systemRef.current.style.transform = 'scale3d(1, 1, 1)';
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    if (!selectedPlanet) return;

    if (format === 'json') {
      const data = {
        planet: selectedPlanet.name,
        data: {
          name: selectedPlanet.name,
          nameLatin: selectedPlanet.nameLatin,
          type: selectedPlanet.type,
          distance: selectedPlanet.distance,
          period: selectedPlanet.period,
          speed: selectedPlanet.speed,
          mass: selectedPlanet.mass,
          radius: selectedPlanet.radius,
          temperature: selectedPlanet.temperature,
          eccentricity: selectedPlanet.eccentricity,
          inclination: selectedPlanet.inclination,
          rotation: selectedPlanet.rotation,
          moons: selectedPlanet.moons,
          description: selectedPlanet.description,
        },
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedPlanet.name.toLowerCase().replace('é', 'e').replace('û', 'u')}-data.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const rows = [
        ['Propriété', 'Valeur'],
        ['Nom', selectedPlanet.name],
        ['Nom latin', selectedPlanet.nameLatin],
        ['Type', selectedPlanet.type],
        ['Distance du Soleil (UA)', selectedPlanet.distance.toString()],
        ['Période orbitale (jours)', selectedPlanet.period.toString()],
        ['Vitesse orbitale (km/s)', selectedPlanet.speed.toString()],
        ['Masse (kg)', selectedPlanet.mass.toString()],
        ['Rayon (km)', selectedPlanet.radius.toString()],
        ['Température (K)', selectedPlanet.temperature.toString()],
        ['Excentricité', selectedPlanet.eccentricity.toString()],
        ['Inclinaison (°)', selectedPlanet.inclination.toString()],
        ['Rotation (jours)', selectedPlanet.rotation.toString()],
        ['Nombre de lunes', selectedPlanet.moons.length.toString()],
      ];
      const csv = rows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedPlanet.name.toLowerCase().replace('é', 'e').replace('û', 'u')}-data.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
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
              <p className="eyebrow">Simulation Interactive</p>
              <h1 className="wf-hero-title">
                Système Solaire<br />
                <span className="underline-wave">Orbites Réalistes</span>
              </h1>
              <p className="lead">
                Simulation interactive du système solaire avec orbites réalistes et informations planétaires.
                Rendu en temps réel avec animations CSS 3D.
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
          <div className="solar-system-container" id="solar-system" ref={containerRef}>
            <div className="solar-system" id="solar-system-inner" ref={systemRef}>
              <div
                className={PLANETS[0].className}
                onClick={() => setSelectedPlanetSimple(PLANETS[0])}
                style={{ cursor: 'pointer' }}
              />
              {PLANETS.slice(1).map((planet, idx) => (
                <div
                  key={planet.name}
                  className={`orbit ${planet.orbitClass} ${isPaused ? 'paused' : ''}`}
                >
                  <div
                    className={planet.className}
                    onClick={() => setSelectedPlanetSimple(planet)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="solar-controls">
            <div className="controls-row">
              <button id="toggle-pause-btn" onClick={togglePause} className="btn btn--toggle">
                <span id="pause-icon">{isPaused ? '▶' : '⏸'}</span>
                <span id="pause-text">{isPaused ? 'Play' : 'Pause'}</span>
              </button>
              <button id="reset-btn" onClick={resetSystem} className="btn btn-ghost">
                Reset
              </button>
              <button id="fullscreen-btn" onClick={toggleFullscreen} className="btn btn-ghost">
                <span id="fullscreen-icon">⛶</span>
                <span id="fullscreen-text">Plein écran</span>
              </button>
            </div>
            <div className="controls-row">
              <label className="control-checkbox">
                <input
                  type="checkbox"
                  checked={educationalMode}
                  onChange={(e) => setEducationalMode(e.target.checked)}
                />
                <span>Mode éducatif</span>
              </label>
              <label className="control-checkbox">
                <input
                  type="checkbox"
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                />
                <span>Statistiques</span>
              </label>
            </div>
            {educationalMode && (
              <div className="controls-row">
                <input
                  type="text"
                  placeholder="Rechercher une planète..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="control-search"
                />
              </div>
            )}
          </div>

          {showStats && (
            <div className="solar-stats">
              <h3>Statistiques du Système Solaire</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Planètes</span>
                  <span className="stat-value">{PLANETS_DATA.length - 1}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Lunes totales</span>
                  <span className="stat-value">{totalMoons}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Distance moyenne</span>
                  <span className="stat-value">{formatDistance(averageDistance)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Plus grande planète</span>
                  <span className="stat-value">{largestPlanet.name}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Plus chaude</span>
                  <span className="stat-value">{hottestPlanet.name}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Masse totale</span>
                  <span className="stat-value">{(totalMass / 1.989e30).toFixed(2)} M☉</span>
                </div>
              </div>
            </div>
          )}

          {educationalMode && searchQuery && (
            <div className="search-results">
              <h4>Résultats de recherche</h4>
              <div className="search-results-list">
                {filteredPlanets.map(planet => (
                  <button
                    key={planet.name}
                    className="search-result-item"
                    onClick={() => {
                      const simplePlanet = PLANETS.find(p => p.name === planet.name);
                      if (simplePlanet) setSelectedPlanetSimple(simplePlanet);
                      setSearchQuery('');
                    }}
                  >
                    <strong>{planet.name}</strong> ({planet.nameLatin})
                    {planet.distance > 0 && ` - ${formatDistance(planet.distance)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedPlanet && (
            <div className="planet-info">
              <div className="planet-info-header">
                <h3 id="planet-name">{selectedPlanet.name} {selectedPlanet.nameLatin && `(${selectedPlanet.nameLatin})`}</h3>
                <span className="planet-type">
                  {selectedPlanet.type === 'star' ? 'Étoile' :
                   selectedPlanet.type === 'terrestrial' ? 'Planète tellurique' :
                   selectedPlanet.type === 'gas-giant' ? 'Géante gazeuse' :
                   'Géante de glace'}
                </span>
              </div>
              <div className="planet-info-content">
                {educationalMode && selectedPlanet.description && (
                  <div className="info-section">
                    <div className="info-section-title">Description</div>
                    <div className="info-section-content">
                      <p className="planet-description">{selectedPlanet.description}</p>
                    </div>
                  </div>
                )}
                <div className="info-section">
                  <div className="info-section-title">Caractéristiques</div>
                  <div className="info-section-content">
                    <div className="info-grid">
                  {selectedPlanet.distance > 0 && (
                    <>
                      <div className="info-item">
                        <span className="info-label">Distance du Soleil</span>
                        <span className="info-value">{formatDistance(selectedPlanet.distance)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Période orbitale</span>
                        <span className="info-value">{formatPeriod(selectedPlanet.period)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Vitesse orbitale</span>
                        <span className="info-value">{selectedPlanet.speed.toFixed(2)} km/s</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Excentricité</span>
                        <span className="info-value">{selectedPlanet.eccentricity.toFixed(3)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Inclinaison orbitale</span>
                        <span className="info-value">{selectedPlanet.inclination.toFixed(2)}°</span>
                      </div>
                    </>
                  )}
                  <div className="info-item">
                    <span className="info-label">Masse</span>
                    <span className="info-value">{selectedPlanet.mass.toExponential(2)} kg</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rayon</span>
                    <span className="info-value">{selectedPlanet.radius.toLocaleString()} km</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Température</span>
                    <span className="info-value">{selectedPlanet.temperature} K ({(selectedPlanet.temperature - 273.15).toFixed(1)}°C)</span>
                  </div>
                  {selectedPlanet.rotation !== 0 && (
                    <div className="info-item">
                      <span className="info-label">Rotation</span>
                      <span className="info-value">
                        {Math.abs(selectedPlanet.rotation).toFixed(2)} jours
                        {selectedPlanet.rotation < 0 && ' (rétrograde)'}
                      </span>
                    </div>
                  )}
                </div>
                  </div>
                </div>
                {educationalMode && selectedPlanet.distance > 0 && (
                  <div className="info-section">
                    <div className="info-section-title">Comparer avec</div>
                    <div className="info-section-content">
                      <div className="comparison-buttons">
                        {PLANETS_DATA
                          .filter(p => p.distance > 0 && p.name !== selectedPlanet.name)
                          .slice(0, 4)
                          .map(planet => (
                            <button
                              key={planet.name}
                              className="comparison-btn"
                              onClick={() => setComparisonPlanet(planet)}
                            >
                              {planet.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedPlanet && selectedPlanet.moons.length > 0 && (
            <div className="planet-info planet-info-right">
              <div className="planet-info-header">
                <h3 id="planet-name">Lunes de {selectedPlanet.name}</h3>
              </div>
              <div className="planet-info-content">
                <div className="info-section">
                  <div className="info-section-title">Lunes principales ({selectedPlanet.moons.length})</div>
                  <div className="info-section-content">
                    <ul className="moons-list">
                      {selectedPlanet.moons.map(moon => (
                        <li key={moon.name}>
                          <strong>{moon.name}</strong> - {moon.radius.toLocaleString()} km de rayon,
                          période : {moon.period.toFixed(2)} jours
                          {educationalMode && `, distance : ${(moon.distance / 1000).toFixed(0)} km`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {comparisonPlanet && selectedPlanet && educationalMode && (
            <div className="planet-comparison">
              <div className="comparison-header">
                <h3>Comparaison</h3>
                <button className="close-btn" onClick={() => setComparisonPlanet(null)}>×</button>
              </div>
              <div className="comparison-grid">
                <div className="comparison-item">
                  <div className="comparison-planet">
                    <h4>{selectedPlanet.name}</h4>
                    <div className="comparison-data">
                      <div>Distance: {formatDistance(selectedPlanet.distance)}</div>
                      <div>Masse: {selectedPlanet.mass.toExponential(2)} kg</div>
                      <div>Rayon: {selectedPlanet.radius.toLocaleString()} km</div>
                      <div>Température: {selectedPlanet.temperature} K</div>
                      <div>Période: {formatPeriod(selectedPlanet.period)}</div>
                    </div>
                  </div>
                  <div className="comparison-vs">VS</div>
                  <div className="comparison-planet">
                    <h4>{comparisonPlanet.name}</h4>
                    <div className="comparison-data">
                      <div>Distance: {formatDistance(comparisonPlanet.distance)}</div>
                      <div>Masse: {comparisonPlanet.mass.toExponential(2)} kg</div>
                      <div>Rayon: {comparisonPlanet.radius.toLocaleString()} km</div>
                      <div>Température: {comparisonPlanet.temperature} K</div>
                      <div>Période: {formatPeriod(comparisonPlanet.period)}</div>
                    </div>
                  </div>
                </div>
                <div className="comparison-ratios">
                  <h4>Rapports</h4>
                  <div className="ratio-item">
                    <span>Masse: </span>
                    <span>{(selectedPlanet.mass / comparisonPlanet.mass).toFixed(2)}x</span>
                  </div>
                  <div className="ratio-item">
                    <span>Rayon: </span>
                    <span>{(selectedPlanet.radius / comparisonPlanet.radius).toFixed(2)}x</span>
                  </div>
                  <div className="ratio-item">
                    <span>Distance: </span>
                    <span>{(selectedPlanet.distance / comparisonPlanet.distance).toFixed(2)}x</span>
                  </div>
                  <div className="ratio-item">
                    <span>Température: </span>
                    <span>{(selectedPlanet.temperature / comparisonPlanet.temperature).toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
