import { Palette, Code } from 'lucide-react';
import type { Service, PortfolioItem } from './types';

export const SERVICES: Service[] = [
  {
    id: "design-graphique",
    title: "Design Graphique",
    subtitle: "Identité visuelle & Communication",
    description: "Création d'identités visuelles percutantes, logos, supports print.",
    features: ["Création de logos", "Charte graphique", "Supports print"],
    pricing: "À partir de 150.000 FCFA",
    duration: "3-7 jours",
    gradient: "from-pink-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
    icon: Palette
  },
  {
    id: "developpement-web",
    title: "Développement Web",
    subtitle: "Sites & Applications sur mesure",
    description: "Sites web et applications sur mesure, performants et sécurisés.",
    features: ["Sites responsives", "PWA", "CMS Integration"],
    pricing: "À partir de 650.000 FCFA",
    duration: "2-6 semaines",
    gradient: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    icon: Code
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: 'Plateforme Éducative LMS',
    category: 'web',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    description: 'Système de gestion de l\'apprentissage complet.',
    tags: ['React', 'Node.js'],
    client: 'EduTech Faso'
  }
];
