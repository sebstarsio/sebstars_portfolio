'use client';

export default function Hero() {
  return (
    <section id="hero" className="wf-section wf-hero">
      {/* ARRIÈRE-PLAN HERO */}
      <div className="wf-hero-bg">
        <div className="wf-starfield-layer"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="curve-glow curve-glow-1"></div>
        <div className="curve-glow curve-glow-2"></div>
      </div>

      {/* CONTENU HERO */}
      <div className="wf-inner hero-inner">
        <div className="wf-hero-content">
          {/* TEXTE HERO */}
          <div className="wf-hero-text">
            <p className="eyebrow">Studio Web, IA & Univers Virtuels</p>
            <h1>
              Un portfolio qui
              <span className="underline-wave">surfe entre galaxies</span><br />
              et applications web.
            </h1>
            <p className="lead">
              Explorateur freelance, j&apos;assemble des <strong>sites</strong>,
              des <strong>outils IA</strong> et des <strong>dashboards</strong>
              avec une interface moderne : lisible, fluide, réactif, avec une touche
              d&apos;astronomie.
            </p>
            <div className="wf-hero-status">
              <span className="status-dot"></span>
              <span className="status-text">Profil : <strong>Solo Dev</strong>, niveau <strong>cosmique</strong>.</span>
            </div>
          </div>

        </div>
      </div>

      {/* VAGUE DE SÉPARATION */}
      <div className="wf-wave-divider wf-wave-bottom">
        <svg viewBox="0 0 1440 240" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveHeroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050716" />
              <stop offset="40%" stopColor="#10163B" />
              <stop offset="75%" stopColor="#1B355A" />
              <stop offset="100%" stopColor="#050716" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveHeroGrad)"
            d="M0,160 C260,220 420,80 720,140 C1040,200 1180,260 1440,200 L1440,240 L0,240 Z"
          />
        </svg>
      </div>
    </section>
  );
}

