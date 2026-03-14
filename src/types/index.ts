export interface Project {
  id: string;
  category: string;
  image?: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  technologies?: string[];
  demo?: string;
  /** URL du dépôt ou de la source (ex. repo GitHub). */
  github?: string;
  /** URL directe vers le fichier du composant démo dans le dépôt (bouton "Voir le code"). */
  githubUrl?: string;
  features?: string[];
}
