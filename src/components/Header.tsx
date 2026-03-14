'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Accueil', ariaLabel: 'Retour à l\'accueil' },
  { href: '/projects', label: 'Projets', ariaLabel: 'Voir tous les projets' },
  { href: '/lab', label: 'Lab', ariaLabel: 'SebStars Lab' },
  { href: '/#services', label: 'Services', ariaLabel: 'Aller à la section services' },
  { href: '/a-propos', label: 'À propos', ariaLabel: 'Page À propos' },
] as const;

const Header = memo(function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/a-propos') return pathname === '/a-propos';
    if (href === '/lab') return pathname === '/lab';
    if (href === '/projects') return pathname === '/projects' || pathname?.startsWith('/projects/');
    return false;
  };

  return (
    <>
      {/* Zone de fond en haut de page : plus claire + micro-vague. Reste en haut au scroll (ne suit pas la navbar). */}
      <div className="wf-header-zone" aria-hidden="true" />
      <header className="wf-header">
        <div className="wf-header-inner">
        <Link href="/" className="wf-logo">
          <div className="wf-logo-mark">
            <Image
              src="/images/logo.svg"
              alt="SebStars.io Logo"
              width={44}
              height={44}
              priority
            />
          </div>
          <span className="wf-logo-text">SebStars.io</span>
        </Link>

        <nav className="wf-nav">
          {NAV_LINKS.map(({ href, label, ariaLabel }) => (
            <Link
              key={href}
              href={href}
              aria-label={ariaLabel}
              className={`wf-nav-link ${isActive(href) ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#contact"
            aria-label="Aller à la section contact"
            className="wf-nav-link wf-nav-cta"
          >
            Contact
          </Link>
        </nav>
        </div>
      </header>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
