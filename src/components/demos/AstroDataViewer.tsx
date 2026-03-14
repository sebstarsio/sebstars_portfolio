'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { logger } from '@/lib/logger';
import type { ArchitectureNotesData } from '@/components/ui/ArchitectureNotes';
import '../../styles/demos/astro-data-viewer.css';

interface AstroItem {
  id: string;
  type: 'image' | 'exoplanet';
  title: string;
  description?: string;
  imageUrl?: string;
  thumbUrl?: string;
  date?: string;
  tag?: string;
  orbitalDistance?: number;
  planetRadius?: number;
  stellarRadius?: number;
  mass?: number;
  orbitalPeriod?: number;
  temperature?: number;
  copyright?: string;
  keywords?: string[];
}

type Language = 'fr' | 'en';

interface AstroDataViewerProps {
  architectureNotes?: ArchitectureNotesData;
  lang?: 'fr' | 'en';
}

export default function AstroDataViewer({ architectureNotes, lang = 'fr' }: AstroDataViewerProps = {}) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'images' | 'exoplanets'>('images');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AstroItem | null>(null);
  const [view3D, setView3D] = useState(false);
  const [data, setData] = useState<AstroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('nebula');
  const [localSearch, setLocalSearch] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [descriptionLang, setDescriptionLang] = useState<Language>('fr');
  const [translating, setTranslating] = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState<string>('');
  const canvas3DRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Vérifier si la clé API est configurée
  const hasRealApiKey = () => {
    if (!mounted) return false;
    // On ne peut pas accéder directement à process.env côté client
    // On suppose que si les données se chargent, la clé fonctionne
    return true; // Simplifié pour l'instant
  };

  // Réinitialiser la page quand on change d'onglet ou de recherche
  useEffect(() => {
    setPage(1);
    setHasMore(false);
    setTotalResults(0);
  }, [tab, searchQuery]);

  // Charger les données selon l'onglet actif et la page
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, searchQuery, page]);

  // Réinitialiser la sélection quand on change d'onglet
  useEffect(() => {
    setSelected(null);
    setLocalSearch('');
  }, [tab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (tab === 'images') {
        // Charger les images APOD (Astronomy Picture of the Day)
        let apodItems: AstroItem[] = [];
        try {
          const apodResponse = await fetch(`/api/nasa/apod?count=5`);
          if (apodResponse.ok) {
            const apodData = await apodResponse.json();
            apodItems = Array.isArray(apodData.items) ? apodData.items : [apodData.items];
          }
        } catch (err) {
          logger.warn('APOD failed, continuing with search images only:', err);
        }

        // Charger des images supplémentaires selon la recherche
        let searchItems: AstroItem[] = [];
        let hasMorePages = false;
        let total = 0;
        try {
          const imagesResponse = await fetch(`/api/nasa/images?q=${encodeURIComponent(searchQuery)}&page=${page}&page_size=50`);
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            searchItems = imagesData.items || [];
            hasMorePages = imagesData.hasMore || false;
            total = imagesData.total || 0;
          }
        } catch (err) {
          logger.warn('NASA Images search failed:', err);
        }

        // Combiner APOD et images de recherche (éviter les doublons)
        // Pour la page 1, on inclut les APOD, sinon seulement les résultats de recherche
        const allImages = page === 1 ? [...apodItems] : [];
        const existingIds = new Set(allImages.map(item => item.id));
        searchItems.forEach(item => {
          if (!existingIds.has(item.id)) {
            allImages.push(item);
          }
        });
        
        setData(allImages);
        setHasMore(hasMorePages);
        setTotalResults(total);
      } else {
        // Charger les exoplanètes
        const exoplanetsResponse = await fetch('/api/nasa/exoplanets');
        if (!exoplanetsResponse.ok) throw new Error('Failed to fetch exoplanets');
        const exoplanetsData = await exoplanetsResponse.json();
        setData(exoplanetsData.items || []);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (tab === 'images' && search.trim()) {
      setSearchQuery(search.trim());
      setPage(1); // Réinitialiser à la page 1 pour une nouvelle recherche
      setLoading(true);
      await loadData();
    }
  };

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1 && !loading) {
      setPage(prev => prev - 1);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'Title', 'Description', 'Date', 'Tag', 'Orbital Distance (UA)', 'Planet Radius (R⊕)', 'Stellar Radius (R☉)'];
    const rows = filteredData.map(item => [
      item.id,
      item.type,
      item.title,
      item.description || '',
      item.date || '',
      item.tag || '',
      item.orbitalDistance?.toString() || '',
      item.planetRadius?.toString() || '',
      item.stellarRadius?.toString() || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `astro-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `astro-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const shareImage = async () => {
    if (!selected?.imageUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: selected.title,
          text: selected.description || '',
          url: selected.imageUrl,
        });
      } else {
        // Fallback: copier le lien
        await navigator.clipboard.writeText(selected.imageUrl);
        alert('Lien de l\'image copié dans le presse-papiers !');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  // Traduire la description via l'API Next.js (évite les problèmes CORS)
  const translateDescription = async (text: string, targetLang: Language): Promise<string> => {
    if (!text) return '';
    if (targetLang === 'en') return text; // Pas besoin de traduire si déjà en anglais
    
    try {
      setTranslating(true);
      
      // Utiliser notre route API Next.js pour éviter les problèmes CORS
      const response = await fetch(
        `/api/translate?text=${encodeURIComponent(text)}&lang=${targetLang}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur de traduction');
      }
      
      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('Erreur de traduction:', error);
      // En cas d'erreur, retourner le texte original
      return text;
    } finally {
      setTranslating(false);
    }
  };

  // Traduire la description quand la langue change ou qu'une image est sélectionnée
  useEffect(() => {
    if (selected?.description && selected.type === 'image') {
      if (descriptionLang === 'en') {
        // Texte original en anglais
        setTranslatedDescription(selected.description);
      } else {
        // Traduire depuis l'anglais vers la langue sélectionnée
        translateDescription(selected.description, descriptionLang).then(setTranslatedDescription);
      }
    } else {
      setTranslatedDescription('');
    }
  }, [selected, descriptionLang]);

  const filteredData = data.filter(item => {
    if (tab === 'images' && item.type !== 'image') return false;
    if (tab === 'exoplanets' && item.type !== 'exoplanet') return false;
    if (localSearch && !item.title.toLowerCase().includes(localSearch.toLowerCase()) && 
        !item.description?.toLowerCase().includes(localSearch.toLowerCase())) return false;
    if (year && tab === 'images' && item.date && !item.date.startsWith(year)) return false;
    return true;
  });

  useEffect(() => {
    if (view3D && selected?.type === 'exoplanet' && canvas3DRef.current) {
      const container = canvas3DRef.current;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050510);

      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 5, 15);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 5);
      scene.add(directionalLight);

      const starGeometry = new THREE.BufferGeometry();
      const starVertices: number[] = [];
      for (let i = 0; i < 1000; i++) {
        starVertices.push(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200
        );
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }));
      scene.add(stars);

      if (selected.orbitalDistance && selected.planetRadius) {
        const starGeometry2 = new THREE.SphereGeometry(selected.stellarRadius || 0.5, 32, 32);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const star = new THREE.Mesh(starGeometry2, starMaterial);
        scene.add(star);

        const orbitRadius = selected.orbitalDistance * 10;
        const planetGeometry = new THREE.SphereGeometry(selected.planetRadius * 0.3, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(orbitRadius, 0, 0);
        scene.add(planet);

        const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.1, orbitRadius + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = -Math.PI / 2;
        scene.add(orbit);

        const animate = () => {
          planet.rotation.y += 0.01;
          planet.position.x = Math.cos(planet.rotation.y) * orbitRadius;
          planet.position.z = Math.sin(planet.rotation.y) * orbitRadius;
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
      }

      sceneRef.current = scene;
      rendererRef.current = renderer;

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }
  }, [view3D, selected]);

  const status = loading ? 'Chargement des données...' : `${filteredData.length} ${totalResults > 0 ? `sur ${totalResults}` : ''} résultats`;
  const sectionHeading = tab === 'images' ? 'Images astronomiques (NASA / JWST)' : 'Exoplanètes (catalogue)';

  // Ne pas rendre avant que le composant soit monté côté client
  if (!mounted) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9ca3af', fontFamily: '"Space Grotesk", sans-serif' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="astro-viewer-container" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside className="astro-sidebar">
        <div>
          <div className="astro-logo">
            Seb<span>Stars</span>.io
          </div>
          <div className="astro-app-title">Astro Data Viewer</div>
        </div>

        <div>
          <div className="astro-section-label">Sources de données</div>
          <div className="astro-tabs">
            <button
              className={`astro-tab-btn ${tab === 'images' ? 'active' : ''}`}
              onClick={() => setTab('images')}
            >
              <span className="label">Images du cosmos</span>
              <span className="tag">NASA / JWST</span>
            </button>
            <button
              className={`astro-tab-btn ${tab === 'exoplanets' ? 'active' : ''}`}
              onClick={() => setTab('exoplanets')}
            >
              <span className="label">Exoplanètes</span>
              <span className="tag">Archive</span>
            </button>
          </div>
        </div>

        <div>
          <div className="astro-section-label">Filtres</div>
          <div className="astro-filters">
            {tab === 'images' && (
              <div className="astro-field">
                <label htmlFor="astro-search">Recherche NASA</label>
                <input
                  id="astro-search"
                  type="text"
                  placeholder="Galaxie, nébuleuse, exoplanète..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(70, 230, 255, 0.1)',
                    border: '1px solid rgba(70, 230, 255, 0.3)',
                    borderRadius: '4px',
                    color: '#e5e7eb',
                    cursor: loading || !search.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    opacity: loading || !search.trim() ? 0.5 : 1,
                  }}
                  disabled={loading || !search.trim()}
                >
                  {loading ? '⏳ Recherche...' : '🔍 Rechercher'}
                </button>
              </div>
            )}
            <div className="astro-field">
              <label htmlFor="astro-filter">Filtrer les résultats</label>
              <input
                id="astro-filter"
                type="text"
                placeholder={tab === 'images' ? 'Filtrer les résultats...' : 'Rechercher dans les exoplanètes...'}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            {tab === 'images' && (
              <div className="astro-field">
                <label htmlFor="astro-year">Année (images)</label>
                <select
                  id="astro-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Toutes</option>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="astro-section-label">Export / Import</div>
          <div className="astro-filters" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={exportToJSON}
              style={{
                padding: '0.5rem',
                background: 'rgba(70, 230, 255, 0.1)',
                border: '1px solid rgba(70, 230, 255, 0.3)',
                borderRadius: '4px',
                color: '#e5e7eb',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Exporter JSON
            </button>
            <button
              onClick={exportToCSV}
              style={{
                padding: '0.5rem',
                background: 'rgba(70, 230, 255, 0.1)',
                border: '1px solid rgba(70, 230, 255, 0.3)',
                borderRadius: '4px',
                color: '#e5e7eb',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Exporter CSV
            </button>
          </div>
        </div>

        {(tab === 'exoplanets') && (
          <div>
            <div className="astro-section-label">Options</div>
            <div className="astro-filters">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={view3D}
                  onChange={(e) => setView3D(e.target.checked)}
                  disabled={!selected || selected.type !== 'exoplanet'}
                />
                <span style={{ fontSize: '0.85rem' }}>Vue 3D</span>
              </label>
            </div>
          </div>
        )}

        <div className="astro-sidebar-footer">
          Données issues des APIs publiques (<span>NASA</span>, archives
          d&apos;exoplanètes, etc.) – interface SebStars orientée exploration
          visuelle &amp; pédagogique.
          {!hasRealApiKey() && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(70, 230, 255, 0.1)', borderRadius: '6px', fontSize: '0.75rem', lineHeight: '1.4' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#38bdf8' }}>
                💡 Améliorez votre expérience
              </div>
              <div style={{ opacity: 0.9, marginBottom: '0.5rem' }}>
                Mode démo actif (30 req/jour). Configurez une clé API NASA gratuite pour :
              </div>
              <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem', opacity: 0.8 }}>
                <li>1000 requêtes/heure (au lieu de 30/jour)</li>
                <li>Meilleure fiabilité</li>
                <li>Accès prioritaire</li>
              </ul>
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  background: 'rgba(70, 230, 255, 0.2)',
                  border: '1px solid rgba(70, 230, 255, 0.4)',
                  borderRadius: '4px',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                Obtenir une clé gratuite →
              </a>
              <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', opacity: '0.7' }}>
                Puis ajoutez dans <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.125rem 0.25rem', borderRadius: '2px' }}>.env.local</code>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="astro-main">
        <div className="astro-top-bar">
          <div className="astro-status">
            <div className="astro-status-dot" />
            <span>{status}</span>
          </div>
          <div className="astro-stat-pill">
            <span>{filteredData.length} résultats</span>
          </div>
        </div>

        <div className="astro-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="astro-section-heading">{sectionHeading}</div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          {loading && filteredData.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  animation: 'pulse 2s ease-in-out infinite',
                  animationDelay: `${i * 0.1}s`
                }}>
                  <div style={{ width: '100%', height: '180px', background: 'rgba(255, 255, 255, 0.05)' }}></div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ height: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', marginBottom: '0.5rem', width: '80%' }}></div>
                    <div style={{ height: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', width: '60%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="astro-empty-state">Aucun résultat. Essayez un autre terme ou une autre source.</div>
          ) : (
            <>
              <div className="astro-cards">
                {filteredData.map((item) => (
                  <article
                    key={item.id}
                    className="astro-card"
                    onClick={() => setSelected(item)}
                    style={{ 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(70, 230, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {item.thumbUrl && (
                      <img 
                        src={item.thumbUrl} 
                        alt={item.title} 
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/1a1a2e/7d7d7d?text=Image+non+disponible';
                        }}
                      />
                    )}
                    <div className="astro-card-body">
                      <div className="astro-card-title">{item.title}</div>
                      <div className="astro-card-meta">{item.date || item.tag || ''}</div>
                      {item.tag && (
                        <div className="astro-card-tag">{item.tag}</div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Pagination */}
              {tab === 'images' && (hasMore || page > 1) && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginTop: '2rem',
                  padding: '1rem',
                }}>
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1 || loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: page === 1 || loading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(70, 230, 255, 0.1)',
                      border: '1px solid rgba(70, 230, 255, 0.3)',
                      borderRadius: '8px',
                      color: page === 1 || loading ? '#6b7280' : '#e5e7eb',
                      cursor: page === 1 || loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'all 0.2s',
                    }}
                  >
                    ← Précédent
                  </button>
                  
                  <span style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: '#9ca3af',
                    fontSize: '0.9rem',
                  }}>
                    Page {page}
                  </span>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore || loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: !hasMore || loading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(70, 230, 255, 0.1)',
                      border: '1px solid rgba(70, 230, 255, 0.3)',
                      borderRadius: '8px',
                      color: !hasMore || loading ? '#6b7280' : '#e5e7eb',
                      cursor: !hasMore || loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'all 0.2s',
                    }}
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="astro-detail">
          <button
            className="astro-detail-close"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <div className="astro-detail-content">
            <h2>{selected.title}</h2>
            <div className="astro-detail-meta">
              {selected.date && <span>{selected.date}</span>}
              {selected.tag && <span style={{ marginLeft: '1rem' }}>{selected.tag}</span>}
            </div>
            {selected.description && selected.type === 'image' && (
              <div style={{ marginBottom: '1rem' }}>
                <div className="astro-lang-selector-container">
                  <label className="astro-lang-selector-label">
                    Langue de la description :
                  </label>
                  <select
                    className="astro-lang-selector"
                    value={descriptionLang}
                    onChange={(e) => setDescriptionLang(e.target.value as Language)}
                    disabled={translating}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="astro-detail-description">
                  {translating ? (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>Traduction en cours...</div>
                  ) : translatedDescription ? (
                    translatedDescription
                  ) : (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>Chargement de la traduction...</div>
                  )}
                </div>
              </div>
            )}
            {selected.description && selected.type === 'exoplanet' && (
              <div className="astro-detail-description">{selected.description}</div>
            )}
            {selected.imageUrl && (
              <div className="astro-detail-image">
                <img 
                  src={selected.imageUrl} 
                  alt={selected.title}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/1a1a2e/7d7d7d?text=Image+non+disponible';
                  }}
                />
                {selected.copyright && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>
                    © {selected.copyright}
                  </p>
                )}
              </div>
            )}
            {view3D && selected.type === 'exoplanet' && (
              <div ref={canvas3DRef} style={{ width: '100%', height: '500px', marginBottom: '2rem', border: '1px solid rgba(125, 243, 255, 0.2)', borderRadius: '8px', overflow: 'hidden' }}></div>
            )}
            {selected.type === 'exoplanet' && (
              <>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '1.5rem', marginTop: '2rem' }}>
                  <h3 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.25rem', color: 'rgba(70, 230, 255, 1)', marginBottom: '1rem' }}>Informations scientifiques</h3>
                  {selected.orbitalDistance && <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e5e7eb', marginBottom: '0.5rem' }}>Distance orbitale: {selected.orbitalDistance} UA</p>}
                  {selected.planetRadius && <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e5e7eb', marginBottom: '0.5rem' }}>Rayon planétaire: {selected.planetRadius} R⊕</p>}
                  {selected.stellarRadius && <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e5e7eb', marginBottom: '0.5rem' }}>Rayon stellaire: {selected.stellarRadius} R☉</p>}
                  {selected.mass && <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e5e7eb', marginBottom: '0.5rem' }}>Masse: {selected.mass} M⊕</p>}
                  {selected.orbitalPeriod && <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e5e7eb', marginBottom: '0.5rem' }}>Période orbitale: {selected.orbitalPeriod} jours</p>}
                  {selected.temperature && <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e5e7eb', marginBottom: '0.5rem' }}>Température d&apos;équilibre: {selected.temperature} K</p>}
                  
                  {/* Explications scientifiques */}
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h4 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1rem', color: 'rgba(70, 230, 255, 1)', marginBottom: '0.75rem' }}>💡 Explications</h4>
                    {selected.orbitalDistance && (
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#e5e7eb' }}>Distance orbitale ({selected.orbitalDistance} UA) :</strong> La distance entre la planète et son étoile. 
                        {selected.orbitalDistance < 0.1 && ' Cette planète est très proche de son étoile, probablement une planète rocheuse chaude.'}
                        {selected.orbitalDistance >= 0.1 && selected.orbitalDistance < 1 && ' Cette planète se trouve dans la zone habitable potentielle, où l\'eau liquide pourrait exister.'}
                        {selected.orbitalDistance >= 1 && ' Cette planète est dans la zone externe du système, probablement une géante gazeuse.'}
                      </p>
                    )}
                    {selected.temperature && (
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#e5e7eb' }}>Température ({selected.temperature} K) :</strong> Température d\'équilibre calculée en fonction de la distance orbitale et de la luminosité stellaire. 
                        {selected.temperature > 273 && selected.temperature < 373 && ' Cette température permet théoriquement la présence d\'eau liquide à la surface.'}
                        {selected.temperature >= 373 && ' Cette température est trop élevée pour l\'eau liquide.'}
                        {selected.temperature <= 273 && ' Cette température est trop basse, l\'eau serait gelée.'}
                      </p>
                    )}
                    {selected.planetRadius && (
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#e5e7eb' }}>Rayon planétaire ({selected.planetRadius} R⊕) :</strong> 
                        {selected.planetRadius < 1.5 && ' Planète rocheuse (type Terre).'}
                        {selected.planetRadius >= 1.5 && selected.planetRadius < 4 && ' Planète de type "Super-Terre" ou "Mini-Neptune".'}
                        {selected.planetRadius >= 4 && ' Géante gazeuse (type Jupiter).'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tableau comparatif avec les autres exoplanètes */}
                {tab === 'exoplanets' && filteredData.filter(item => item.type === 'exoplanet').length > 1 && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem' }}>
                    <h3 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.25rem', color: 'rgba(70, 230, 255, 1)', marginBottom: '1rem' }}>Comparaison avec les autres exoplanètes</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(70, 230, 255, 1)', fontWeight: 600 }}>Planète</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', color: 'rgba(70, 230, 255, 1)', fontWeight: 600 }}>Distance (UA)</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', color: 'rgba(70, 230, 255, 1)', fontWeight: 600 }}>Rayon (R⊕)</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', color: 'rgba(70, 230, 255, 1)', fontWeight: 600 }}>Temp. (K)</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', color: 'rgba(70, 230, 255, 1)', fontWeight: 600 }}>Période (j)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.filter(item => item.type === 'exoplanet').slice(0, 5).map((item, idx) => (
                            <tr 
                              key={item.id}
                              style={{ 
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                backgroundColor: item.id === selected.id ? 'rgba(70, 230, 255, 0.1)' : 'transparent',
                                cursor: 'pointer',
                              }}
                              onClick={() => setSelected(item)}
                            >
                              <td style={{ padding: '0.75rem', color: item.id === selected.id ? 'rgba(70, 230, 255, 1)' : '#e5e7eb', fontWeight: item.id === selected.id ? 600 : 400 }}>
                                {item.title}
                                {item.id === selected.id && ' ←'}
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', color: '#9ca3af' }}>{item.orbitalDistance?.toFixed(3) || '-'}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', color: '#9ca3af' }}>{item.planetRadius?.toFixed(2) || '-'}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', color: '#9ca3af' }}>{item.temperature || '-'}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', color: '#9ca3af' }}>{item.orbitalPeriod?.toFixed(1) || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
            {selected.imageUrl && (
              <button
                onClick={shareImage}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(70, 230, 255, 0.2)',
                  border: '1px solid rgba(70, 230, 255, 0.4)',
                  borderRadius: '4px',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                🔗 Partager
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
