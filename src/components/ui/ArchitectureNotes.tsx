'use client';

import { useState, useRef, useEffect } from 'react';
import { Cpu } from 'lucide-react';

export interface ArchitectureNotesContent {
  algorithm: string;
  performance: string;
  challenge: string;
}

export interface ArchitectureNotesData {
  fr: ArchitectureNotesContent;
  en: ArchitectureNotesContent;
}

type Lang = 'fr' | 'en';

const BADGE_LABELS = { fr: 'Specs', en: 'Specs' } as const;
const SECTION_LABELS = {
  fr: { algorithm: 'Algorithme', performance: 'Performance', challenge: 'Défi technique' },
  en: { algorithm: 'Algorithm', performance: 'Performance', challenge: 'Technical challenge' },
} as const;

interface ArchitectureNotesProps {
  /** Notes par langue (fr / en). */
  notes: ArchitectureNotesData;
  /** Langue d'affichage (défaut: fr). */
  lang?: Lang;
}

/**
 * Badge discret ouvrant un popover avec les Architecture Notes (algorithme, performance, défi).
 * Positionné en absolu dans le wrapper parent (coin supérieur gauche).
 */
export default function ArchitectureNotes({ notes, lang = 'fr' }: ArchitectureNotesProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const content = notes[lang];
  const sectionLabels = SECTION_LABELS[lang];
  const badgeLabel = BADGE_LABELS[lang];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="architecture-notes" ref={panelRef}>
      <button
        type="button"
        className="architecture-notes-badge"
        onClick={() => setOpen(!open)}
        title={badgeLabel}
        aria-label={badgeLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="architecture-notes-badge-icon" aria-hidden>
          <Cpu size={14} strokeWidth={2} />
        </span>
        <span className="architecture-notes-badge-label">{badgeLabel}</span>
      </button>
      {open && (
        <div className="architecture-notes-panel" role="dialog" aria-label={badgeLabel}>
          <div className="architecture-notes-section">
            <span className="architecture-notes-section-title">{sectionLabels.algorithm}</span>
            <p className="architecture-notes-section-text">{content.algorithm}</p>
          </div>
          <div className="architecture-notes-section">
            <span className="architecture-notes-section-title">{sectionLabels.performance}</span>
            <p className="architecture-notes-section-text">{content.performance}</p>
          </div>
          <div className="architecture-notes-section">
            <span className="architecture-notes-section-title">{sectionLabels.challenge}</span>
            <p className="architecture-notes-section-text">{content.challenge}</p>
          </div>
        </div>
      )}
    </div>
  );
}
