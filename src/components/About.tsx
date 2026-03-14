'use client';

import Link from 'next/link';

const TIMELINE = [
  {
    year: 'Aujourd\'hui',
    title: 'Architecte logiciel & Fullstack',
    description: 'Conception de systèmes robustes, interfaces premium et expériences utilisateur à la croisée du produit et de la technique.',
  },
  {
    year: '2022 – 2024',
    title: 'Produits & plateformes',
    description: 'Développement full stack sur applications web ambitieuses : APIs, bases de données, interfaces réactives et déploiements maîtrisés.',
  },
  {
    year: '2019 – 2022',
    title: 'Montée en compétence technique',
    description: 'Stack moderne (React, Node, TypeScript), premières architectures et mise en production de projets complets.',
  },
  {
    year: 'Débuts',
    title: 'Passion logicielle & web',
    description: 'Découverte du développement web et des systèmes, premiers projets personnels et orientation vers le full stack.',
  },
];

export default function About() {
  return (
    <article className="about-page">
      {/* Intro asymétrique */}
      <section className="about-intro">
        <div className="about-intro-bg" aria-hidden="true" />
        <div className="about-intro-inner">
          <p className="about-eyebrow">À propos</p>
          <h1 className="about-title">
            Fullstack · Architecte
            <br />
            <span className="about-title-accent">Logiciel</span>
          </h1>
          <p className="about-lead">
            Je conçois et construis des produits numériques à l&apos;intersection du code, de l&apos;architecture et de l&apos;expérience. 
            Chaque projet est l&apos;occasion d&apos;allier rigueur technique et ambition créative.
          </p>
        </div>
      </section>

      {/* Manifesto / positionnement */}
      <section className="about-manifesto">
        <div className="about-glass about-glass-manifesto">
          <h2 className="about-section-title">Posture</h2>
          <p className="about-manifesto-text">
            Développeur full stack et architecte logiciel, je place la qualité des systèmes et l&apos;expérience utilisateur au centre. 
            J&apos;aime les interfaces exigeantes, les APIs claires et les bases de code maintenables. Mon univers : un laboratoire cosmique 
            où la technique sert la vision produit.
          </p>
        </div>
      </section>

      {/* Timeline parcours */}
      <section className="about-timeline-section">
        <h2 className="about-section-title about-section-title-center">Parcours</h2>
        <div className="about-timeline">
          <div className="about-timeline-line" aria-hidden="true" />
          {TIMELINE.map((step, index) => (
            <div key={index} className="about-timeline-node">
              <div className="about-timeline-node-marker" />
              <div className="about-glass about-timeline-card">
                <span className="about-timeline-year">{step.year}</span>
                <h3 className="about-timeline-title">{step.title}</h3>
                <p className="about-timeline-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expertise / stack / méthode */}
      <section className="about-expertise">
        <div className="about-expertise-grid">
          <div className="about-glass about-glass-card about-glass-offset-left">
            <h2 className="about-section-title">Expertise</h2>
            <ul className="about-list">
              <li>Frontend : React, Next.js, TypeScript, interfaces accessibles et performantes</li>
              <li>Backend : Node.js, APIs REST/GraphQL, bases de données (SQL, NoSQL)</li>
              <li>Architecture : conception de systèmes évolutifs, patterns et bonnes pratiques</li>
              <li>Produit : collaboration avec la vision métier, livraison itérative</li>
            </ul>
          </div>
          <div className="about-glass about-glass-card about-glass-offset-right">
            <h2 className="about-section-title">Méthode</h2>
            <p className="about-method-text">
              Je privilégie la clarté des specs, le code lisible et les décisions documentées. 
              Tests, revues et déploiements maîtrisés font partie du quotidien. 
              Chaque livrable vise la maintenabilité à long terme.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="about-vision">
        <div className="about-glass about-glass-vision">
          <h2 className="about-section-title">Vision</h2>
          <p className="about-vision-text">
            Construire des logiciels qui comptent : utiles, beaux et durables. 
            Mon ambition est de rester à la pointe des pratiques tout en gardant l&apos;humain et l&apos;utilisateur au centre. 
            Le portfolio que vous parcourez reflète cette recherche — cosmique, premium, technologique.
          </p>
          <div className="about-cta-wrap">
            <Link href="/#contact" className="about-cta">
              Échanger
            </Link>
            <Link href="/projects" className="about-cta about-cta-ghost">
              Voir les projets
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
