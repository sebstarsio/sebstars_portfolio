import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getAllProjects } from '@/lib/projects';
import Header from '@/components/Header';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { StructuredData } from '@/components/StructuredData';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProjectById(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sebstars.io';

  if (!project) {
    return {
      title: 'Projet non trouvé',
    };
  }

  const projectUrl = `${baseUrl}/projects/${id}`;
  const projectImage = `${baseUrl}/projects/${id}/opengraph-image`;

  return {
    title: `${project.title} | SebStars.io`,
    description: project.subtitle || project.description,
    keywords: project.technologies?.join(', ') || '',
    authors: [{ name: 'Sébastien' }],
    openGraph: {
      type: 'website',
      url: projectUrl,
      title: `${project.title} | SebStars.io`,
      description: project.subtitle || project.description,
      images: [
        {
          url: projectImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      siteName: 'SebStars.io',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | SebStars.io`,
      description: project.subtitle || project.description,
      images: [projectImage],
    },
    alternates: {
      canonical: projectUrl,
    },
  };
}

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: 'Projets', url: '/projects' },
    { name: project.title, url: `/projects/${id}` },
  ];

  return (
    <>
      {/* Structured Data - CreativeWork */}
      <StructuredData type="project" project={project} />
      {/* Structured Data - SoftwareSourceCode (SEO projet) */}
      <StructuredData type="software-source-code" project={project} />
      {/* Structured Data - BreadcrumbList */}
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      <AnalyticsTracker path={`/projects/${id}`} />
      <Header />
      <main className="wf-main">
        <section className="wf-section" style={{ paddingTop: '100px' }}>
          <div className="wf-inner">
            <Link href="/" className="btn-ghost" style={{ marginBottom: '2rem', display: 'inline-block' }}>
              ← Retour
            </Link>

            <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '2rem', marginBottom: '1rem' }}>
              {project.title}
            </h1>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>
              {project.subtitle}
            </p>

            {project.image && (
              <div style={{ marginBottom: '2rem', borderRadius: 'var(--radius-card)', overflow: 'hidden', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Image
                  src={project.image}
                  alt={`${project.title} - ${project.subtitle || project.description.substring(0, 150)}`}
                  width={800}
                  height={450}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                Description
              </h2>
              <p style={{ marginBottom: '1rem' }}>{project.description}</p>
              {project.longDescription && (
                <p style={{ whiteSpace: 'pre-line' }}>{project.longDescription}</p>
              )}
            </div>

            {project.features && project.features.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  Fonctionnalités
                </h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {project.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  Technologies
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="rail-card-tech-tag"
                      style={{ display: 'inline-block' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="project-links" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {project.demo && (
                <a
                  href={project.demo}
                  className="project-link project-link-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir la démo
                </a>
              )}
              <a
                href={project.github || 'https://github.com/sebstars/sebstars_portfolio'}
                className="project-link project-link-github"
                target="_blank"
                rel="noopener noreferrer"
                title="Voir le code source sur GitHub"
              >
                Voir le code
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
