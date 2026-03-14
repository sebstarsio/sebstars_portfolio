import type { Metadata } from 'next';
import Header from '@/components/Header';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import SebStarsLab from '@/components/SebStarsLab';

export const metadata: Metadata = {
  title: 'Lab — Experimental UI Systems',
  description: 'SebStars Lab : showroom de composants interactifs, micro-interactions et design system expérimental. Magnetic buttons, loaders, inputs glassmorphism, contrôles premium.',
  alternates: { canonical: '/lab' },
};

export default function LabPage() {
  return (
    <main className="wf-main">
      <AnalyticsTracker path="/lab" />
      <Header />
      <SebStarsLab />
    </main>
  );
}
