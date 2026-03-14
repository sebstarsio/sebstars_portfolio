import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';
import Header from '@/components/Header';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import ProjectsGallery from '@/components/ProjectsGallery';

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Projets réalisés par SebStars : applications web, dashboards, simulateurs, blog CMS, e-commerce. React, Next.js, TypeScript.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="wf-main">
      <AnalyticsTracker path="/projects" />
      <Header />
      <ProjectsGallery projects={projects} />
    </main>
  );
}
