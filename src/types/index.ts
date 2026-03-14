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
  github?: string;
  features?: string[];
}
