import type { Metadata } from 'next';
import Header from '@/components/Header';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import About from '@/components/About';

export const metadata: Metadata = {
  title: 'À propos — Fullstack & Architecte logiciel',
  description: 'Profil de Sébastien : développeur Fullstack, architecte logiciel. Parcours, méthode, expertise et vision. Identité premium et cosmique SebStars.',
  alternates: { canonical: '/a-propos' },
};

export default function AProposPage() {
  return (
    <main className="wf-main">
      <AnalyticsTracker path="/a-propos" />
      <Header />
      <About />
    </main>
  );
}
