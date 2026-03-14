'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { Project } from '@/types';

/**
 * Carte projet complète (identique au carrousel Home).
 * Réutilisée sur la Home (carrousel) et sur la page /projects (grille).
 */
const ProjectCard = memo(function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const id = `${project.id}-${index}`;
  const categoryText = `Projet #${String(index + 1).padStart(2, '0')} · ${project.category}`;
  const fallbackIcon =
    project.category === 'animation'
      ? '✨'
      : project.category === 'vitrine'
        ? '🎨'
        : project.category === 'ecommerce'
          ? '🛒'
          : project.category === 'fullstack'
            ? '💻'
            : project.category === 'data-ia'
              ? '📊'
              : '🚀';

  return (
    <article key={id} className="rail-card" data-project-id={project.id}>
      <div className="rail-pill">{categoryText}</div>
      <div className="rail-card-image">
        {(project.thumbnailUrl ?? project.image) ? (
          <Image
            src={project.thumbnailUrl ?? project.image ?? ''}
            alt={`${project.title} - ${project.subtitle || project.description.substring(0, 100)}`}
            fill
            className="rail-card-thumbnail"
            style={{ objectFit: 'cover' }}
            loading={index < 3 ? 'eager' : 'lazy'}
            priority={index < 3}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
          />
        ) : (
          <div className="rail-card-fallback">
            <span className="rail-card-icon">{fallbackIcon}</span>
          </div>
        )}
      </div>
      <h3 className="rail-card-title">{project.title}</h3>
      <p className="rail-card-description">{project.description}</p>
      <div className="rail-card-footer">
        {project.technologies && project.technologies.length > 0 && (
          <div className="rail-card-technologies">
            {project.technologies.slice(0, 3).map((tech: string, i: number) => (
              <span key={i} className="rail-card-tech-tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="rail-card-tech-tag">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="project-links">
          {project.demo && (
            <Link
              href={
                project.demo.startsWith('http') ? project.demo : project.demo
              }
              target={project.demo.startsWith('http') ? '_blank' : undefined}
              rel={
                project.demo.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="project-link project-link-demo"
              onClick={() => track('project_demo_click', { project_id: project.id })}
            >
              Voir le projet
            </Link>
          )}
          <Link
            href={`/projects/${project.id}`}
            className="project-link project-link-details"
            onClick={() => track('project_details_click', { project_id: project.id })}
          >
            Détails
          </Link>
        </div>
      </div>
    </article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
