/**
 * Store en mémoire pour la démo Blog/CMS (sans Prisma/DB).
 * Données de seed identiques au legacy sebstarsionextjs (api/posts/seed).
 */

export interface StoreTag {
  id: string;
  name: string;
}

export interface StoreArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  authorId: string;
  author: { id: string; username: string; email: string };
  createdAt: string;
  updatedAt: string;
  published: boolean;
  tags: StoreTag[];
}

let tagIdCounter = 100;
const tagByName = new Map<string, StoreTag>();

function getOrCreateTag(name: string): StoreTag {
  const n = name.trim();
  if (!n) throw new Error('Tag name required');
  let tag = tagByName.get(n);
  if (!tag) {
    tag = { id: `tag-${++tagIdCounter}`, name: n };
    tagByName.set(n, tag);
  }
  return tag;
}

const DEMO_AUTHOR = { id: '1', username: 'Admin', email: 'admin@blog.com' };

/** Articles techniques réels (contenu crédible, blocs de code inclus). */
const loremArticles: Array<{
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
}> = [
  {
    title: 'Introduction au développement web moderne',
    excerpt: 'Stack moderne, outils et bonnes pratiques : React, Next.js, API et déploiement en production.',
    content: [
      '<h1>Introduction au développement web moderne</h1>',
      '<p>Le développement web actuel repose sur une stack éprouvée : frontend réactif, API structurées et déploiement automatisé. Voici comment enchaîner les briques sans se perdre.</p>',
      '<h2>Stack recommandée</h2>',
      '<p>Pour un projet full stack cohérent, on privilégie un runtime unique (Node.js) et des conventions partagées entre client et serveur.</p>',
      '<ul>',
      '<li>Frontend : React avec Next.js (SSR, routing, API Routes)</li>',
      '<li>Backend : API Routes Next.js ou Node + Express</li>',
      '<li>Base de données : PostgreSQL avec Prisma ou Drizzle</li>',
      '<li>Auth : NextAuth.js ou session JWT</li>',
      '</ul>',
      '<h2>Exemple : appel API depuis un Server Component</h2>',
      '<p>En Next.js App Router, les Server Components peuvent fetcher directement sans exposer de clé côté client.</p>',
      '<pre><code>// app/dashboard/page.tsx (Server Component)\nasync function DashboardPage() {\n  const res = await fetch(\'https://api.example.com/stats\', {\n    next: { revalidate: 60 }\n  });\n  const data = await res.json();\n  return (\n    &lt;div&gt;\n      &lt;h1&gt;Stats&lt;/h1&gt;\n      &lt;p&gt;Visiteurs : {data.visitors}&lt;/p&gt;\n    &lt;/div&gt;\n  );\n}</code></pre>',
      '<blockquote><p>Règle d’or : garder la logique métier et les secrets côté serveur, et n’exposer que des contrats API clairs au client.</p></blockquote>',
    ].join('\n'),
    tags: ['développement', 'web', 'technologie'],
    published: true,
  },
  {
    title: 'Les meilleures pratiques en TypeScript',
    excerpt: 'Strict mode, types utilitaires et inférence : écrire du TypeScript maintenable dans des projets React/Next.js.',
    content: [
      '<h1>Les meilleures pratiques en TypeScript</h1>',
      '<p>TypeScript apporte de la sécurité et de l’autocomplétion à condition d’éviter les échappatoires (any, as) et d’utiliser des types explicites là où l’inférence ne suffit pas.</p>',
      '<h2>Configuration stricte</h2>',
      '<p>Dans <code>tsconfig.json</code>, activer <code>strict: true</code> et <code>noUncheckedIndexedAccess</code> pour limiter les accès indices non vérifiés.</p>',
      '<h2>Types pour les props et l’état</h2>',
      '<p>Définir des interfaces pour les props de composants et pour les réponses API évite les erreurs à l’exécution.</p>',
      '<pre><code>interface Article {\n  id: string;\n  title: string;\n  excerpt: string | null;\n  author: { id: string; username: string };\n}\n\nfunction ArticleCard({ article }: { article: Article }) {\n  return (\n    &lt;article&gt;\n      &lt;h2&gt;{article.title}&lt;/h2&gt;\n      &lt;p&gt;{article.excerpt ?? \'\'}&lt;/p&gt;\n    &lt;/article&gt;\n  );\n}</code></pre>',
      '<blockquote><p>Préférer <code>interface</code> pour les objets publics (API, props) et <code>type</code> pour les unions et les utilitaires.</p></blockquote>',
    ].join('\n'),
    tags: ['typescript', 'programmation', 'react'],
    published: true,
  },
  {
    title: 'Guide complet de Next.js 14',
    excerpt: 'App Router, Server Components, routing dynamique et API Routes : tour d’horizon des fonctionnalités clés.',
    content: [
      '<h1>Guide complet de Next.js 14</h1>',
      '<p>Next.js 14 consolide l’App Router et les Server Components comme modèle par défaut. Le routing basé sur le système de fichiers et le chargement progressif changent la façon de structurer une app.</p>',
      '<h2>App Router vs Pages Router</h2>',
      '<p>L’App Router (dossier <code>app/</code>) apporte les layouts imbriqués, le streaming, et la distinction explicite Server / Client Components.</p>',
      '<ul>',
      '<li>Layouts partagés sans re-render inutile</li>',
      '<li>Streaming et Suspense pour un premier affichage plus rapide</li>',
      '<li>Server Components par défaut : moins de JS envoyé au client</li>',
      '</ul>',
      '<h2>Route dynamique et generateStaticParams</h2>',
      '<p>Pour des pages statiques pré-générées à partir d’un slug ou d’un id :</p>',
      '<pre><code>// app/posts/[slug]/page.tsx\nexport async function generateStaticParams() {\n  const posts = await getPosts();\n  return posts.map((p) => ({ slug: p.slug }));\n}\n\nexport default async function PostPage({ params }: { params: { slug: string } }) {\n  const post = await getPostBySlug(params.slug);\n  if (!post) notFound();\n  return &lt;Article data={post} /&gt;;\n}</code></pre>',
      '<p>Ainsi, les pages sont générées au build tout en restant cohérentes avec le routing dynamique.</p>',
    ].join('\n'),
    tags: ['nextjs', 'react', 'framework'],
    published: true,
  },
  {
    title: 'Authentification sécurisée avec NextAuth.js',
    excerpt: 'Mise en place de NextAuth.js avec Credentials et JWT, callbacks session et protection des routes API.',
    content: [
      '<h1>Authentification sécurisée avec NextAuth.js</h1>',
      '<p>NextAuth.js s’intègre à Next.js pour gérer sessions, providers (Credentials, OAuth) et protection des routes. En mode JWT, pas besoin de session en base à chaque requête.</p>',
      '<h2>Configuration de base</h2>',
      '<p>Un fichier <code>auth.ts</code> exporte <code>authOptions</code> : providers, callbacks (jwt, session) et options de session (strategy, maxAge).</p>',
      '<pre><code>// lib/auth.ts\nimport { NextAuthOptions } from \'next-auth\';\nimport CredentialsProvider from \'next-auth/providers/credentials\';\nimport { compare } from \'bcryptjs\';\n\nexport const authOptions: NextAuthOptions = {\n  providers: [\n    CredentialsProvider({\n      async authorize(credentials) {\n        const user = await db.user.findUnique({\n          where: { email: credentials?.email }\n        });\n        if (!user || !credentials?.password) return null;\n        const ok = await compare(credentials.password, user.password);\n        return ok ? { id: user.id, email: user.email, name: user.name } : null;\n      }\n    })\n  ],\n  callbacks: {\n    jwt({ token, user }) {\n      if (user) token.role = user.role;\n      return token;\n    },\n    session({ session, token }) {\n      if (session.user) session.user.role = token.role;\n      return session;\n    }\n  },\n  session: { strategy: \'jwt\', maxAge: 30 * 24 * 60 * 60 }\n};</code></pre>',
      '<h2>Protéger une API</h2>',
      '<p>Côté route handler, utiliser <code>getServerSession(authOptions)</code> et renvoyer 401 si pas de session.</p>',
      '<blockquote><p>Ne jamais exposer le hash du mot de passe ; vérifier avec bcrypt (ou équivalent) et ne stocker que le hash.</p></blockquote>',
    ].join('\n'),
    tags: ['nextauth', 'authentification', 'sécurité'],
    published: true,
  },
  {
    title: "Optimisation des performances avec Prisma",
    excerpt: "Réduire le nombre de requêtes et la quantité de données avec select, include et la pagination.",
    content: [
      '<h1>Optimisation des performances avec Prisma</h1>',
      '<p>Prisma simplifie l’accès à la base mais peut générer des requêtes lourdes si on charge trop de relations ou de colonnes. Quelques règles pour garder des temps de réponse acceptables.</p>',
      '<h2>Techniques de base</h2>',
      '<ul>',
      '<li><strong>select</strong> : ne récupérer que les champs nécessaires</li>',
      '<li><strong>include</strong> : limiter la profondeur et les champs des relations</li>',
      '<li>Pagination avec <code>take</code> / <code>skip</code> ou cursor-based</li>',
      '<li>Index sur les colonnes utilisées dans les where et orderBy</li>',
      '</ul>',
      '<h2>Exemple : liste d’articles avec auteur</h2>',
      '<p>Éviter le N+1 en chargeant les auteurs en une requête, et ne pas ramener le contenu HTML pour une liste.</p>',
      '<pre><code>const posts = await prisma.post.findMany({\n  where: { published: true },\n  select: {\n    id: true,\n    title: true,\n    excerpt: true,\n    createdAt: true,\n    author: {\n      select: { id: true, username: true }\n    }\n  },\n  orderBy: { createdAt: \'desc\' },\n  take: 20\n});</code></pre>',
      '<blockquote><p>Pour les listes, exclure systématiquement les champs lourds (content, body) et les relations inutiles.</p></blockquote>',
    ].join('\n'),
    tags: ['prisma', 'base de données', 'performance'],
    published: true,
  },
  {
    title: "Création d'interfaces utilisateur modernes",
    excerpt: "Composants réutilisables, tokens de design et accessibilité : structurer une UI cohérente avec React.",
    content: [
      '<h1>Création d\'interfaces utilisateur modernes</h1>',
      '<p>Une UI moderne repose sur des composants réutilisables, des tokens (couleurs, espacements, typo) et une attention à l’accessibilité. React + CSS (ou CSS-in-JS) suffit pour un design system interne.</p>',
      '<h2>Design tokens en CSS</h2>',
      '<p>Centraliser les variables dans un fichier (ex. <code>variables.css</code>) pour garder une cohérence et faciliter les thèmes.</p>',
      '<pre><code>:root {\n  --color-accent: #7df3ff;\n  --color-bg-card: rgba(8, 12, 28, 0.4);\n  --radius-sm: 6px;\n  --radius-card: 12px;\n  --font-heading: var(--font-orbitron);\n  --font-body: var(--font-space-grotesk);\n}\n\n.card {\n  background: var(--color-bg-card);\n  border-radius: var(--radius-card);\n  font-family: var(--font-body);\n}</code></pre>',
      '<h2>Composants accessibles</h2>',
      '<p>Boutons et liens : contraste suffisant, <code>:focus-visible</code> visible au clavier, labels ou aria-label sur les icônes.</p>',
      '<blockquote><p>Un bon design system réduit la dette visuelle et accélère les itérations sans tout refaire à chaque fois.</p></blockquote>',
    ].join('\n'),
    tags: ['design', 'ui', 'react', 'css'],
    published: true,
  },
];

let postIdCounter = 1;
const posts = new Map<string, StoreArticle>();

function seed(): void {
  if (posts.size > 0) return;
  const now = new Date().toISOString();
  loremArticles.forEach((a) => {
    const id = `post-${++postIdCounter}`;
    const tags = a.tags.map((name) => getOrCreateTag(name));
    posts.set(id, {
      id,
      title: a.title,
      content: a.content.trim(),
      excerpt: a.excerpt,
      authorId: DEMO_AUTHOR.id,
      author: DEMO_AUTHOR,
      createdAt: now,
      updatedAt: now,
      published: a.published,
      tags,
    });
  });
}

seed();

export function getAllPosts(includeUnpublished: boolean): StoreArticle[] {
  seed();
  const list = Array.from(posts.values());
  const filtered = includeUnpublished ? list : list.filter((p) => p.published);
  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPostById(id: string): StoreArticle | undefined {
  return posts.get(id);
}

export function createPost(data: {
  title: string;
  content: string;
  excerpt: string | null;
  tags: string[];
  published: boolean;
  authorId: string;
  author: { id: string; username: string; email: string };
}): StoreArticle {
  const id = `post-${++postIdCounter}`;
  const now = new Date().toISOString();
  const tagObjs = data.tags.map((name) => getOrCreateTag(name));
  const article: StoreArticle = {
    id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    authorId: data.authorId,
    author: data.author,
    createdAt: now,
    updatedAt: now,
    published: data.published,
    tags: tagObjs,
  };
  posts.set(id, article);
  return article;
}

export function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string | null;
    tags?: string[];
    published?: boolean;
  }
): StoreArticle | null {
  const existing = posts.get(id);
  if (!existing) return null;
  const tagObjs = (data.tags ?? existing.tags.map((t) => t.name)).map((name) =>
    getOrCreateTag(name)
  );
  const updated: StoreArticle = {
    ...existing,
    title: data.title ?? existing.title,
    content: data.content ?? existing.content,
    excerpt: data.excerpt !== undefined ? data.excerpt : existing.excerpt,
    updatedAt: new Date().toISOString(),
    published: data.published !== undefined ? data.published : existing.published,
    tags: tagObjs,
  };
  posts.set(id, updated);
  return updated;
}

export function deletePost(id: string): boolean {
  return posts.delete(id);
}
