'use client';

import React, { useRef, useState, memo } from 'react';
import { getAllProjects } from '../lib/projects';
import ProjectCard from './ProjectCard';

const Projects = memo(function Projects({ fullPage = false }: { fullPage?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
            const itemsPerView = 3; // Nombre de projets visibles à la fois
            const cardWidth = 360; // Largeur d'une carte en px
            const gap = 22; // Gap entre les cartes en px
  const cardWidthWithGap = cardWidth + gap; // Largeur d'une carte + gap

  const projects = getAllProjects();
  const totalProjects = projects.length;
  const maxIndex = Math.max(0, totalProjects - itemsPerView);

  // Calculer la position de translation basée sur l'index
  // Utiliser modulo pour créer une boucle infinie
  const normalizedIndex = currentIndex % totalProjects;
  const currentPosition = -normalizedIndex * cardWidthWithGap;

  const handlePrevClick = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerView;
      // Si on dépasse le début, revenir au dernier groupe possible
      if (newIndex < 0) {
        // Calculer le dernier index valide (multiple de itemsPerView)
        const lastGroupStart = Math.floor(maxIndex / itemsPerView) * itemsPerView;
        return lastGroupStart;
      }
      return newIndex;
    });
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + itemsPerView;
      // Si on dépasse la fin, revenir au début (index 0)
      if (newIndex > maxIndex) {
        return 0;
      }
      return newIndex;
    });
  };

  return (
    <section id="projects" className="wf-section wf-projects">
      <div className="wf-wave-divider wf-wave-top">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveProjectsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050716" />
              <stop offset="30%" stopColor="#10163B" />
              <stop offset="70%" stopColor="#241848" />
              <stop offset="100%" stopColor="#050716" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveProjectsGrad)"
            d="M0,40 C260,-10 420,140 720,90 C1040,40 1180,-40 1440,10 L1440,0 L0,0 Z"
          ></path>
        </svg>
      </div>

      <div className="wf-inner">
        <div className="wf-section-header">
          <p className="eyebrow">Projets réalisés</p>
          <h2>Des projets concrets<br />présentés sur un rail sinusoïdal.</h2>
          <p className="section-lead">
            Chaque carte est un projet que je peux développer pour un client :
            application web santé, carte stellaire interactive, dashboard IA, simulateur
            de données statistiques.
          </p>
        </div>
      </div>

      {fullPage ? (
        <div className="wf-inner projects-full-grid-wrapper">
          <div className="projects-full-grid">
            {projects.map((project, index) => (
              <ProjectCard key={`${project.id}-${index}`} project={project} index={index} />
            ))}
          </div>
        </div>
      ) : (
      <div className="wf-wave-rail">
        <svg className="wf-rail-svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,120 C60,40 120,200 180,120 C240,40 300,200 360,120 C420,40 480,200 540,120 C600,40 660,200 720,120 C780,40 840,200 900,120 C960,40 1020,200 1080,120 C1140,40 1200,200 1260,120 C1320,40 1380,200 1440,120" />
        </svg>

        <div className="wf-carousel-wrapper">
          <button
            id="projects-prev"
            className="wf-carousel-btn wf-carousel-btn-prev"
            aria-label="Projets précédents"
            onClick={handlePrevClick}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="wf-rail-cards wf-inner-rail">
            <div
              className="wf-carousel-track"
              ref={trackRef}
              style={{ 
                transform: `translateX(${currentPosition}px)`,
                transition: 'transform 0.6s ease-in-out'
              }}
            >
              {/* Premier set de projets */}
              {projects.map((project, index) => (
                <ProjectCard key={`${project.id}-${index}`} project={project} index={index} />
              ))}
              {/* Duplication pour effet de boucle seamless */}
              {projects.map((project, index) => (
                <ProjectCard key={`${project.id}-${index + totalProjects}`} project={project} index={index + totalProjects} />
              ))}
            </div>
          </div>

          <button
            id="projects-next"
            className="wf-carousel-btn wf-carousel-btn-next"
            aria-label="Projets suivants"
            onClick={handleNextClick}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
      )}
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
