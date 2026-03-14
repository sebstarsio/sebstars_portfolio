'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Détecte le paramètre ?studio=1 et applique data-studio="true" sur <body>
 * pour activer le Screenshot Studio Mode (styles dédiés capture).
 * Purement visuel, sans impact sur la logique métier.
 */
export default function StudioModeDetector() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const isStudio = searchParams.get('studio') === '1';
    if (isStudio) {
      document.body.setAttribute('data-studio', 'true');
    } else {
      document.body.removeAttribute('data-studio');
    }
    return () => document.body.removeAttribute('data-studio');
  }, [searchParams]);

  return null;
}
