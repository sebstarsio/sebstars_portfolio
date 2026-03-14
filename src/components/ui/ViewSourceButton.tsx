'use client';

const LABELS = { fr: 'Code source', en: 'View Source' } as const;

/** Base URL des fichiers démo dans le dépôt (sans nom de fichier). */
export const GITHUB_DEMO_BASE =
  'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/';

type Lang = keyof typeof LABELS;

interface ViewSourceButtonProps {
  /** URL complète vers le fichier source, ou nom du fichier (ex. SolarSystem.tsx) si filename utilisé. */
  href?: string;
  /** Nom du fichier .tsx du composant (ex. SolarSystem.tsx). Utilisé si href non fourni. */
  filename?: string;
  /** Langue pour le label (défaut: fr). */
  lang?: Lang;
}

/**
 * Bouton discret "Voir le code sur GitHub" pour les démos du Lab.
 * Positionné en absolu dans le wrapper parent (coin supérieur droit).
 */
export default function ViewSourceButton({ href: hrefProp, filename, lang = 'fr' }: ViewSourceButtonProps) {
  const href = hrefProp ?? (filename ? `${GITHUB_DEMO_BASE}${filename}` : '#');
  const label = LABELS[lang];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="view-source-btn"
      title={label}
      aria-label={label}
    >
      <span className="view-source-btn-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </span>
      <span className="view-source-btn-label">{label}</span>
    </a>
  );
}
