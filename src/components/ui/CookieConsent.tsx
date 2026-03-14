'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sebstars_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      setVisible(false);
    } catch {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-label="Information sur les cookies et la confidentialité"
    >
      <p className="cookie-consent-text">
        Ce site utilise des technologies respectueuses de la vie privée (sans cookies de pistage)
        pour analyser le trafic et améliorer l&apos;expérience utilisateur.
      </p>
      <button
        type="button"
        className="cookie-consent-btn"
        onClick={handleAccept}
        aria-label="Accepter et fermer"
      >
        J&apos;ai compris
      </button>
    </div>
  );
}
