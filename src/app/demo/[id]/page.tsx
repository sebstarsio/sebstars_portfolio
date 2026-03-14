import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projects';
import Header from '@/components/Header';
import DemoTechnicalBadges from '@/components/DemoTechnicalBadges';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import SolarSystem from '@/components/demos/SolarSystem';
import Calculator from '@/components/demos/Calculator';
import Constellations from '@/components/demos/Constellations';
import BlogCMS from '@/components/demos/BlogCMS';
import Ecommerce from '@/components/demos/Ecommerce';
import Dashboard from '@/components/demos/Dashboard';
import ThreeBody from '@/components/demos/ThreeBody';
import AstroDataViewer from '@/components/demos/AstroDataViewer';
import FractalGenerator from '@/components/demos/FractalGenerator';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects
    .filter(project => project.demo)
    .map(project => ({
      id: project.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = getAllProjects();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return {
      title: 'Démo non trouvée',
    };
  }

  return {
    title: `${project.title} - Démo | SebStars.io`,
    description: project.description,
  };
}

interface DemoPageProps {
  params: Promise<{ id: string }>;
}

// Composant de démo par défaut (pour les projets non encore intégrés)
function DefaultDemo({ project }: { project: { title: string; subtitle?: string; github?: string; githubUrl?: string } }) {
  return (
    <section className="wf-section" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="wf-inner">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" className="btn-ghost" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            ← Retour au portfolio
          </Link>
          <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {project.title}
          </h1>
          <p className="eyebrow">{project.subtitle}</p>
        </div>

        <div style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-card)',
          padding: '3rem',
          textAlign: 'center',
          background: 'var(--card-bg)',
        }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            La démo de ce projet sera intégrée prochainement.
          </p>
          {(project.githubUrl || project.github) && (
            <a
              href={project.githubUrl || project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ marginTop: '1.5rem', display: 'inline-block' }}
            >
              Voir le code source sur GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { id } = await params;
  const projects = getAllProjects();
  const project = projects.find(p => p.id === id);

  if (!project || !project.demo) {
    notFound();
  }

  const notes = project.architectureNotes;
  const lang = 'fr' as const;

  // Rendre le composant de démo approprié
  const renderDemo = () => {
    switch (id) {
      case 'solar-system':
        return <SolarSystem architectureNotes={notes} lang={lang} />;
      case 'calculatrice':
        return <Calculator architectureNotes={notes} lang={lang} />;
      case 'constellations':
        return <Constellations architectureNotes={notes} lang={lang} />;
      case 'blog-cms':
        return <BlogCMS architectureNotes={notes} lang={lang} />;
      case 'ecommerce':
        return <Ecommerce architectureNotes={notes} lang={lang} />;
      case 'dashboard':
        return <Dashboard architectureNotes={notes} lang={lang} />;
      case 'three-body':
        return <ThreeBody architectureNotes={notes} lang={lang} />;
      case 'astro-data-viewer':
        return <AstroDataViewer architectureNotes={notes} lang={lang} />;
      case 'fractal-generator':
        return <FractalGenerator architectureNotes={notes} lang={lang} />;
      default:
        return <DefaultDemo project={project} />;
    }
  };

  return (
    <>
      <AnalyticsTracker path={`/demo/${id}`} />
      <Header />
      <DemoTechnicalBadges
        project={{
          id: project.id,
          architectureNotes: project.architectureNotes,
          githubUrl: project.githubUrl,
        }}
      />
      <main className="wf-main">
        {renderDemo()}
      </main>
    </>
  );
}
