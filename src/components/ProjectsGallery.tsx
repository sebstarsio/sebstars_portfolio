'use client';

import React, { memo } from 'react';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types';

/**
 * Galerie pleine page pour /projects.
 * Reçoit la liste complète depuis le serveur et affiche toutes les cartes complètes (même structure que le carrousel).
 */
const ProjectsGallery = memo(function ProjectsGallery({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <section id="projects" className="wf-section wf-projects projects-gallery-page projects-section">
      {/* Skin visuel Hero (fond, blobs, glow) — sans vague du haut */}
      <div className="projects-gallery-header-skin">
        <div className="wf-hero-bg">
          <div className="wf-starfield-layer" />
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="curve-glow curve-glow-1" />
          <div className="curve-glow curve-glow-2" />
        </div>
        <div className="wf-inner">
          <div className="wf-section-header">
            <p className="eyebrow">Projets réalisés</p>
            <h1 className="wf-section-header-title">Des projets concrets<br />présentés sur un rail sinusoïdal.</h1>
            <p className="section-lead">
              Chaque carte est un projet que je peux développer pour un client :
              application web santé, carte stellaire interactive, dashboard IA, simulateur
              de données statistiques.
            </p>
          </div>
        </div>
      </div>

      <div className="wf-inner projects-full-grid-wrapper">
        <div className="projects-full-grid">
          {projects.map((project, index) => (
            <ProjectCard key={`${project.id}-${index}`} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

ProjectsGallery.displayName = 'ProjectsGallery';

export default ProjectsGallery;
