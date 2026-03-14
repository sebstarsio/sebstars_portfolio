'use client';

import { useState, useEffect, useRef } from 'react';
import type { ArchitectureNotesData } from '@/components/ui/ArchitectureNotes';
import '../../styles/demos/dashboard.css';

interface DataPoint {
  date: string;
  value: number;
}

interface Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

type ChartType = 'line' | 'bar' | 'area' | 'pie';
type TimeRange = '7d' | '30d' | '90d' | '1y';

interface DashboardProps {
  architectureNotes?: ArchitectureNotesData;
  lang?: 'fr' | 'en';
}

export default function Dashboard({ architectureNotes, lang = 'fr' }: DashboardProps = {}) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateMetrics();
    generateChartData();
    const interval = setInterval(() => {
      generateMetrics();
      generateChartData();
    }, 5000);
    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    generateChartData();
  }, [timeRange]);

  useEffect(() => {
    if (chartType === 'pie') {
      if (pieCanvasRef.current && metrics.length > 0) {
        drawPieChart();
      }
    } else {
      if (canvasRef.current && chartData.length > 0) {
        if (chartType === 'bar') {
          drawBarChart(chartData);
        } else if (chartType === 'area') {
          drawAreaChart(chartData);
        } else {
          drawLineChart(chartData);
        }
      }
    }
  }, [chartData, chartType, metrics, timeRange]);

  const generateMetrics = () => {
    const newMetrics: Metric[] = [
      {
        id: 'users',
        label: 'Utilisateurs actifs',
        value: Math.floor(Math.random() * 5000) + 10000,
        unit: '',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        color: '#3b82f6',
      },
      {
        id: 'revenue',
        label: 'Revenus',
        value: Math.floor(Math.random() * 10000) + 50000,
        unit: '€',
        trend: Math.random() > 0.3 ? 'up' : 'down',
        color: '#10b981',
      },
      {
        id: 'orders',
        label: 'Commandes',
        value: Math.floor(Math.random() * 200) + 500,
        unit: '',
        trend: Math.random() > 0.4 ? 'up' : 'stable',
        color: '#8b5cf6',
      },
      {
        id: 'conversion',
        label: 'Taux de conversion',
        value: Math.floor(Math.random() * 5) + 15,
        unit: '%',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        color: '#f59e0b',
      },
      {
        id: 'sessions',
        label: 'Sessions',
        value: Math.floor(Math.random() * 3000) + 15000,
        unit: '',
        trend: Math.random() > 0.4 ? 'up' : 'down',
        color: '#ec4899',
      },
      {
        id: 'bounce',
        label: 'Taux de rebond',
        value: Math.floor(Math.random() * 20) + 30,
        unit: '%',
        trend: Math.random() > 0.6 ? 'down' : 'up',
        color: '#ef4444',
      },
      {
        id: 'avg-session',
        label: 'Durée moyenne',
        value: Math.floor(Math.random() * 5) + 3,
        unit: 'min',
        trend: Math.random() > 0.5 ? 'up' : 'stable',
        color: '#06b6d4',
      },
      {
        id: 'pageviews',
        label: 'Pages vues',
        value: Math.floor(Math.random() * 10000) + 50000,
        unit: '',
        trend: Math.random() > 0.4 ? 'up' : 'down',
        color: '#84cc16',
      },
    ];
    setMetrics(newMetrics);
  };

  const generateChartData = () => {
    const data: DataPoint[] = [];
    const today = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateFormat = days <= 30
        ? date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        : date.toLocaleDateString('fr-FR', { month: 'short' });
      data.push({
        date: dateFormat,
        value: Math.floor(Math.random() * 1000) + 500,
      });
    }
    setChartData(data);
  };

  const drawLineChart = (data: DataPoint[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = 300;

    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isLight = document.documentElement.classList.contains('theme-light');
    const lineColor = isLight ? '#2563eb' : '#60a5fa';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const textColor = isLight ? '#1e293b' : '#cbd5e1';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (width / (data.length - 1)) * index;
      const y = padding + height - ((point.value - min) / range) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    ctx.fillStyle = lineColor;
    data.forEach((point, index) => {
      const x = padding + (width / (data.length - 1)) * index;
      const y = padding + height - ((point.value - min) / range) * height;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = textColor;
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 10));
    data.forEach((point, index) => {
      if (index % step === 0 || index === data.length - 1) {
        const x = padding + (width / (data.length - 1)) * index;
        ctx.fillText(point.date, x, canvas.height - 10);
      }
    });
  };

  const drawBarChart = (data: DataPoint[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = 300;

    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isLight = document.documentElement.classList.contains('theme-light');
    const barColor = isLight ? '#2563eb' : '#60a5fa';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const textColor = isLight ? '#1e293b' : '#cbd5e1';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const barWidth = width / data.length * 0.6;
    const spacing = width / data.length;

    ctx.fillStyle = barColor;
    data.forEach((point, index) => {
      const x = padding + spacing * index + (spacing - barWidth) / 2;
      const barHeight = ((point.value - min) / range) * height;
      ctx.fillRect(x, padding + height - barHeight, barWidth, barHeight);
    });

    ctx.fillStyle = textColor;
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 10));
    data.forEach((point, index) => {
      if (index % step === 0 || index === data.length - 1) {
        const x = padding + spacing * index + spacing / 2;
        ctx.fillText(point.date, x, canvas.height - 10);
      }
    });
  };

  const drawAreaChart = (data: DataPoint[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = 300;

    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isLight = document.documentElement.classList.contains('theme-light');
    const lineColor = isLight ? '#2563eb' : '#60a5fa';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const textColor = isLight ? '#1e293b' : '#cbd5e1';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // Dessiner la zone remplie
    ctx.fillStyle = isLight ? 'rgba(37, 99, 235, 0.2)' : 'rgba(96, 165, 250, 0.2)';
    ctx.beginPath();
    ctx.moveTo(padding, padding + height);
    data.forEach((point, index) => {
      const x = padding + (width / (data.length - 1)) * index;
      const y = padding + height - ((point.value - min) / range) * height;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + width, padding + height);
    ctx.closePath();
    ctx.fill();

    // Dessiner la ligne
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + (width / (data.length - 1)) * index;
      const y = padding + height - ((point.value - min) / range) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 10));
    data.forEach((point, index) => {
      if (index % step === 0 || index === data.length - 1) {
        const x = padding + (width / (data.length - 1)) * index;
        ctx.fillText(point.date, x, canvas.height - 10);
      }
    });
  };

  const drawPieChart = () => {
    const canvas = pieCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;

    const total = metrics.reduce((sum, m) => sum + m.value, 0);
    let currentAngle = -Math.PI / 2;

    metrics.forEach((metric, index) => {
      const sliceAngle = (metric.value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = metric.color;
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(metric.label, labelX, labelY);

      currentAngle += sliceAngle;
    });
  };

  const handleRefresh = () => {
    generateMetrics();
    generateChartData();
  };

  const exportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = {
        metrics: metrics,
        chartData: chartData,
        chartType: chartType,
        timeRange: timeRange,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csv = [
        ['Date', 'Valeur'],
        ...chartData.map(d => [d.date, d.value.toString()])
      ].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <section className="wf-section wf-hero">
        <div className="wf-hero-bg">
          <div className="wf-starfield-layer"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="curve-glow curve-glow-1"></div>
          <div className="curve-glow curve-glow-2"></div>
        </div>
        <div className="wf-inner hero-inner">
          <div className="wf-hero-content">
            <div className="wf-hero-text">
              <p className="eyebrow">Visualisation de Données</p>
              <h1 className="wf-hero-title">
                Dashboard<br />
                <span className="underline-wave">Temps Réel</span>
              </h1>
              <p className="lead">
                Dashboard interactif avec métriques en temps réel, graphiques dynamiques
                et visualisations de données. Mise à jour automatique toutes les 5 secondes.
              </p>
            </div>
          </div>
        </div>
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
            <path fill="url(#waveHeroGrad)" d="M0,160 C260,220 420,80 720,140 C1040,200 1180,260 1440,200 L1440,240 L0,240 Z" />
          </svg>
        </div>
      </section>

      <section className="wf-section wf-projects">
        <div className="wf-wave-divider wf-wave-top">
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveControlsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="30%" stopColor="#10163B" />
                <stop offset="70%" stopColor="#241848" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveControlsGrad)" d="M0,40 C260,-10 420,140 720,90 C1040,40 1180,-40 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="wf-inner">
          <div className="dashboard-wrapper">
            <div className="dashboard-header">
              <h2>Métriques en Temps Réel</h2>
              <div className="dashboard-actions">
                <button className="dashboard-btn" onClick={handleRefresh}>
                  🔄 Actualiser
                </button>
                <button className="dashboard-btn" onClick={() => exportData('json')} style={{ marginLeft: '0.5rem' }}>
                  📥 Export JSON
                </button>
                <button className="dashboard-btn" onClick={() => exportData('csv')} style={{ marginLeft: '0.5rem' }}>
                  📥 Export CSV
                </button>
              </div>
            </div>

            <div className="metrics-grid">
              {metrics.map(metric => (
                <div key={metric.id} className="metric-card">
                  <div className="metric-header">
                    <span className="metric-label">{metric.label}</span>
                    <span className={`metric-trend trend-${metric.trend}`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                  <div className="metric-value" style={{ color: metric.color }}>
                    {metric.value.toLocaleString('fr-FR')} {metric.unit}
                  </div>
                </div>
              ))}
            </div>

            <div className="chart-container">
              <div className="chart-controls">
                <h3>Évolution des données</h3>
                <div className="chart-options">
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as ChartType)}
                    className="chart-select"
                  >
                    <option value="line">Ligne</option>
                    <option value="bar">Barres</option>
                    <option value="area">Aires</option>
                    <option value="pie">Camembert</option>
                  </select>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    className="chart-select"
                  >
                    <option value="7d">7 jours</option>
                    <option value="30d">30 jours</option>
                    <option value="90d">90 jours</option>
                    <option value="1y">1 an</option>
                  </select>
                </div>
              </div>
              {chartType === 'pie' ? (
                <canvas ref={pieCanvasRef} id="pie-chart"></canvas>
              ) : (
                <canvas ref={canvasRef} id="metrics-chart"></canvas>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
