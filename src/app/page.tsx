import { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

// Lazy loading des composants lourds
const Projects = lazy(() => import('@/components/Projects'));
const Services = lazy(() => import('@/components/Services'));
const Contact = lazy(() => import('@/components/Contact'));

// Composant de chargement
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    color: 'var(--text-muted)'
  }}>
    <div>Chargement...</div>
  </div>
);

export default function Home() {
  return (
    <main className="wf-main">
      <AnalyticsTracker path="/" />
      <Header />
      <Hero />
      <Suspense fallback={<LoadingSpinner />}>
        <Services />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Contact />
      </Suspense>
    </main>
  );
}
