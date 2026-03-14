'use client';

import { FormEvent, useState, memo } from 'react';
import { track } from '@vercel/analytics';

const Contact = memo(function Contact() {
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    track('contact_submit');

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Encoder les valeurs pour l'URL mailto
    const subject = encodeURIComponent(`Message de contact depuis SebStars.io - ${name}`);
    const body = encodeURIComponent(
      `Bonjour,\n\n` +
      `Vous avez reçu un nouveau message de contact depuis votre portfolio.\n\n` +
      `---\n` +
      `Nom: ${name}\n` +
      `Email: ${email}\n` +
      `Date: ${new Date().toLocaleString('fr-FR')}\n` +
      `---\n\n` +
      `Message:\n${message}\n\n` +
      `---\n` +
      `Vous pouvez répondre directement à cet email.`
    );

    // Email de destination (peut être configuré via variable d'environnement)
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@sebstars.io';
    
    // Créer le lien mailto
    const mailtoLink = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    // Ouvrir le client email
    window.location.href = mailtoLink;

    // Afficher un message de confirmation
    setSubmitMessage('✅ Votre client email va s\'ouvrir. Composez et envoyez votre message !');
    
    // Réinitialiser le formulaire après un court délai
    setTimeout(() => {
      form.reset();
      setSubmitMessage('');
    }, 5000);
  };

  return (
    <section id="contact" className="wf-section wf-contact">
      <div className="wf-inner wf-contact-inner">
        <div className="wf-contact-copy">
          <p className="eyebrow">Brief de projet</p>
          <h2>On prépare la prochaine expédition&nbsp;?</h2>
          <p className="section-lead">
            Tu peux m&apos;envoyer un court message avec ton contexte : activité,
            budget approximatif, deadline, niveau de technicité. On structure
            ensuite un projet clair, avec des objectifs atteignables.
          </p>
          <div className="wf-contact-tags">
            <span className="contact-tag">Astronomie</span>
            <span className="contact-tag">Applications web</span>
            <span className="contact-tag">IA pragmatique</span>
          </div>
        </div>

        <form className="wf-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">Votre pseudo / nom</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex : Seb, dev indépendant"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="email">Votre email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="message">Votre projet en quelques lignes</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Parlez-moi de votre idée, même si ce n'est qu'un ressenti ou une envie."
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-full">
            Ouvrir mon client email
          </button>
          {submitMessage && (
            <p className="form-note" style={{ 
              color: submitMessage.includes('✅') ? 'var(--accent)' : 'var(--error, #ef4444)',
              marginTop: '1rem'
            }}>
              {submitMessage}
            </p>
          )}
        </form>
      </div>

      <div className="wf-wave-divider wf-wave-bottom">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveContactGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050716" />
              <stop offset="40%" stopColor="#141A45" />
              <stop offset="80%" stopColor="#050716" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveContactGrad)"
            d="M0,180 C260,140 420,220 720,190 C1040,160 1180,200 1440,190 L1440,240 L0,240 Z"
          />
        </svg>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;

