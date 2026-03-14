import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projects';
import Header from '@/components/Header';
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
function DefaultDemo({ project }: { project: { title: string; subtitle?: string; github?: string } }) {
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
          {project.github && (
            <a
              href={project.github}
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

  // Rendre le composant de démo approprié
  const renderDemo = () => {
    switch (id) {
      case 'solar-system':
        return <SolarSystem />;
      case 'calculatrice':
        return <Calculator />;
      case 'constellations':
        return <Constellations />;
      case 'blog-cms':
        return <BlogCMS />;
      case 'ecommerce':
        return <Ecommerce />;
      case 'dashboard':
        return <Dashboard />;
      case 'three-body':
        return <ThreeBody />;
      case 'astro-data-viewer':
        return <AstroDataViewer />;
      case 'fractal-generator':
        return <FractalGenerator />;
      default:
        return <DefaultDemo project={project} />;
    }
  };

  return (
    <>
      <AnalyticsTracker path={`/demo/${id}`} />
      <Header />
      <main className="wf-main">
        {renderDemo()}
      </main>
    </>
  );
}
