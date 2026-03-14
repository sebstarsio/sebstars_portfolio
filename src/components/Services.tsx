'use client';

import { memo } from 'react';
import '@/styles/components/services-waves.css';

const Services = memo(function Services() {
  return (
    <section id="services" className="wf-section wf-services services-dotted-wave-lines">
      <div className="services-wave-rail-overlay" aria-hidden="true">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,120 C60,40 120,200 180,120 C240,40 300,200 360,120 C420,40 480,200 540,120 C600,40 660,200 720,120 C780,40 840,200 900,120 C960,40 1020,200 1080,120 C1140,40 1200,200 1260,120 C1320,40 1380,200 1440,120" />
        </svg>
      </div>

      <div className="wf-wave-divider wf-wave-bottom">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveServicesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#141A45" />
              <stop offset="35%" stopColor="#2B205A" />
              <stop offset="75%" stopColor="#4B286F" />
              <stop offset="100%" stopColor="#050716" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveServicesGrad)"
            d="M0,200 C260,140 420,260 720,210 C1040,160 1180,80 1440,140 L1440,240 L0,240 Z"
          />
        </svg>
      </div>

      <div className="wf-inner">
        <div className="wf-section-header">
          <p className="eyebrow">Modules d&apos;upgrade</p>
          <h2 className="services-tagline">
            Des services pensés comme des modules d&apos;équipement.
          </h2>
          <p className="section-lead">
            Chaque module est autonome mais peut se combiner avec les autres :
            comme un build de personnage, version web & data.
          </p>
        </div>

        <div className="wf-service-grid">
          <article className="service-card">
            <div className="service-card-header">
              <div className="service-badges">
                <div className="service-badge">Web · UI</div>
              </div>
              <h3 className="service-title">Sites vitrines & hubs cosmiques</h3>
            </div>
            <p>
              Pages courbes, transitions fluides, composition claire : ton site devient
              un hub de commandement, pas juste une carte de visite.
            </p>
            <ul>
              <li>Landing pages & portfolios</li>
              <li>Performance & accessibilité</li>
              <li>Animations contrôlées (pas de cirque)</li>
            </ul>
          </article>

          <article className="service-card">
            <div className="service-card-header">
              <div className="service-badges">
                <div className="service-badge">IA · Automatisation</div>
              </div>
              <h3 className="service-title">Assistants & scripts sur mesure</h3>
            </div>
            <p>
              Chatbots internes, tri intelligent, génération de contenus, en restant
              centré sur tes vrais besoins métier, pas le buzzword.
            </p>
            <ul>
              <li>Intégration API IA</li>
              <li>Workflow réels (emails, docs…)</li>
              <li>Explications claires à ton équipe</li>
            </ul>
          </article>

          <article className="service-card">
            <div className="service-card-header">
              <div className="service-badges">
                <div className="service-badge">Data · Dashboard</div>
              </div>
              <h3 className="service-title">Dashboards interactifs</h3>
            </div>
            <p>
              Plutôt qu&apos;un tableau illisible, des courbes, jauges et cartes qui
              donnent envie d&apos;explorer tes chiffres.
            </p>
            <ul>
              <li>Connexion à tes sources existantes</li>
              <li>Visualisations personnalisées</li>
              <li>Documentation & prise en main</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
});

Services.displayName = 'Services';

export default Services;

