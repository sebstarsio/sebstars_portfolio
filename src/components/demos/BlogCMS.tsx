'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import RichTextEditor from './RichTextEditor';
import ViewSourceButton from '@/components/ui/ViewSourceButton';
import '../../styles/demos/blog-cms.css';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  published: boolean;
  tags: Array<{ id: string; name: string }>;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'AUTHOR' | 'ADMIN';
}

export default function BlogCMS() {
  const { data: session, status } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', tags: '' });
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Charger les articles
  useEffect(() => {
    fetchArticles();
  }, [session]);

  const MIN_LOADING_MS = 650;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const start = Date.now();
      const url = session ? '/api/posts?all=true' : '/api/posts';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setArticles(data);
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining));
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({ title: '', excerpt: '', content: '', tags: '' });
    setShowModal(true);
    setError(null);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      tags: article.tags.map(t => t.name).join(', '),
    });
    setShowModal(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setSelectedArticle(null);
      await fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Erreur lors de la suppression de l\'article');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || null,
        tags,
        published: true,
      };

      let response;
      if (editingArticle) {
        response = await fetch(`/api/posts/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      setShowModal(false);
      setFormData({ title: '', excerpt: '', content: '', tags: '' });
      await fetchArticles();
    } catch (err: any) {
      console.error('Error saving article:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement de l\'article');
    }
  };

  const user = session?.user as any;
  const userRole = user?.role as 'USER' | 'AUTHOR' | 'ADMIN' | undefined;
  const canEdit = userRole === 'ADMIN' || userRole === 'AUTHOR';

  const publishedArticles = articles
    .filter(a => a.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div style={{ position: 'relative' }}>
      <ViewSourceButton filename="BlogCMS.tsx" />
      <section className="wf-section wf-hero blog-cms-hero">
        <div className="wf-hero-bg">
          <div className="wf-starfield-layer"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="curve-glow curve-glow-1"></div>
          <div className="curve-glow curve-glow-2"></div>
        </div>
        
        <div className="wf-inner hero-inner" style={{ position: 'relative', zIndex: 2 }}>
          <div className="wf-hero-content">
            <div className="wf-hero-text">
              <p className="eyebrow">Gestion de Contenu</p>
              <h1 className="wf-hero-title">
                Blog/CMS<br />
                <span className="underline-wave">Full Stack</span>
              </h1>
              <p className="lead">
                Système de gestion de contenu complet avec authentification, CRUD d&apos;articles,
                gestion des utilisateurs et interface d&apos;administration. Utilise PostgreSQL, Prisma et NextAuth.js.
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

      <section className="wf-section wf-projects blog-cms-projects-section">
        <div className="wf-wave-divider wf-wave-top blog-cms-wave-parasite">
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
          <div className="blog-wrapper">
            {status === 'loading' ? (
              <div className="blog-section">
                <div className="blog-card">
                  <p>Chargement...</p>
                </div>
              </div>
            ) : !session ? (
              <div className="blog-section">
                <div className="blog-card">
                  <h2>Connexion</h2>
                  <LoginForm />
                  <p className="login-hint">
                    Utilisateurs de démo : admin@blog.com/admin ou author@blog.com/admin
                  </p>
                </div>
              </div>
            ) : (
              <div className="blog-section">
                {selectedArticle ? (
                  /* Vue détail : transition d’entrée */
                  <div
                    key={`detail-${selectedArticle.id}`}
                    className="blog-view-wrap"
                  >
                    <div className="article-detail">
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(null)}
                        className="blog-btn-back"
                      >
                        ← Retour aux articles
                      </button>
                      <article className="article-detail-card">
                        <h1 className="article-detail-title">{selectedArticle.title}</h1>
                        <p className="article-meta">
                          Par {selectedArticle.author.username} • {new Date(selectedArticle.createdAt).toLocaleDateString('fr-FR')}
                          {selectedArticle.tags.length > 0 && (
                            <span className="article-tags">
                              {selectedArticle.tags.map(tag => (
                                <span key={tag.id} className="tag">{tag.name}</span>
                              ))}
                            </span>
                          )}
                        </p>
                        {selectedArticle.content && (
                          <div
                            className="article-body"
                            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                          />
                        )}
                        <div className="article-actions">
                          {canEdit && (
                            <>
                              <button onClick={() => handleEdit(selectedArticle)} className="blog-btn-small">
                                Modifier
                              </button>
                              <button onClick={() => handleDelete(selectedArticle.id)} className="blog-btn-small blog-btn-danger">
                                Supprimer
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    </div>
                  </div>
                ) : (
                  /* Vue liste : transition d’entrée + skeletons */
                  <div key="list" className="blog-view-wrap">
                    <div className="blog-header">
                      <h2>Articles du Blog</h2>
                      <div className="blog-actions">
                        <span className="user-info">
                          Connecté en tant que {user?.name || user?.email} ({userRole})
                        </span>
                        {canEdit && (
                          <button onClick={handleCreate} className="blog-btn">
                            Nouvel Article
                          </button>
                        )}
                        <button onClick={() => signOut()} className="blog-btn">
                          Déconnexion
                        </button>
                      </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {loading ? (
                      <div className="articles-list" aria-busy="true" aria-label="Chargement des articles">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="skeleton-card" aria-hidden="true">
                            <div className="skeleton-title" />
                            <div className="skeleton-meta" />
                            <div className="skeleton-text skeleton-text--short" />
                            <div className="skeleton-text skeleton-text--medium" />
                            <div className="skeleton-cta" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="articles-list">
                        {publishedArticles.length === 0 ? (
                          <p>Aucun article publié pour le moment.</p>
                        ) : (
                          publishedArticles.map(article => (
                            <article key={article.id} className="article-card">
                              <h3>{article.title}</h3>
                              <p className="article-meta">
                                Par {article.author.username} • {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                                {article.tags.length > 0 && (
                                  <span className="article-tags">
                                    {article.tags.map(tag => (
                                      <span key={tag.id} className="tag">{tag.name}</span>
                                    ))}
                                  </span>
                                )}
                              </p>
                              {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
                              <div className="article-actions">
                                <button
                                  type="button"
                                  onClick={() => setSelectedArticle(article)}
                                  className="blog-btn-read"
                                >
                                  Lire l&apos;article
                                </button>
                                {canEdit && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(article); }} className="blog-btn-small">
                                      Modifier
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(article.id); }} className="blog-btn-small blog-btn-danger">
                                      Supprimer
                                    </button>
                                  </>
                                )}
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {showModal && (
              <div className="modal" onClick={() => setShowModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <span className="modal-close" onClick={() => setShowModal(false)}>&times;</span>
                  <h2>{editingArticle ? 'Modifier l\'article' : 'Nouvel Article'}</h2>
                  {error && <div className="error-message">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Titre"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <textarea
                      placeholder="Résumé"
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-space-grotesk)' }}>
                        Contenu
                      </label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        placeholder="Commencez à écrire votre article..."
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Tags (séparés par des virgules)"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                    <div className="form-actions">
                      <button 
                        type="button" 
                        onClick={() => setShowPreview(!showPreview)} 
                        className="blog-btn"
                        style={{ background: showPreview ? 'var(--bg-mid)' : 'transparent', border: '1px solid var(--border-subtle)' }}
                      >
                        {showPreview ? 'Masquer' : 'Aperçu'}
                      </button>
                      <button type="submit" className="blog-btn">Enregistrer</button>
                      <button type="button" onClick={() => setShowModal(false)} className="blog-btn" style={{ background: 'transparent', border: '1px solid var(--border-subtle)' }}>Annuler</button>
                    </div>
                    {showPreview && (
                      <div className="preview-section" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-mid)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--accent)', marginBottom: '1rem' }}>Aperçu</h3>
                        <div 
                          className="preview-content"
                          style={{ 
                            color: 'var(--text-main)', 
                            fontFamily: 'var(--font-space-grotesk)',
                            lineHeight: '1.6'
                          }}
                          dangerouslySetInnerHTML={{ __html: formData.content || '<p style="color: var(--text-muted)">Commencez à écrire pour voir l\'aperçu...</p>' }}
                        />
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
