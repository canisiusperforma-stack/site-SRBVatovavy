export interface Division {
  id: string;
  name: string;
  description: string;
  chef: string;
  chefImageUrl?: string;
  missions: string[];
  competences: string[];
  dossiersTraites: string[];
  documentsUtiles: { name: string; url: string }[];
  contacts: string;
}

export interface Dossier {
  id: string;
  name: string;
  description: string;
  divisionId: string;
  piecesAFournir: string[];
  conditions: string[];
  delais: string;
  telechargements: { name: string; url: string }[];
  statut: "Actif" | "Inactif";
  responsable: string;
  createdAt: string;
  updatedAt: string;
}

export interface Actualite {
  id: string;
  title: string;
  resume: string;
  contenu: string;
  category: string;
  author: string;
  date: string;
  imageUrl?: string;
  pdfUrl?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Media {
  id: string;
  name: string;
  type: "photo" | "pdf" | "rapport" | "communique";
  url: string;
  size: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  role: "Administrateur" | "Éditeur";
  fullName: string;
}

export interface LogEntry {
  id: string;
  user: string;
  action: string;
  date: string;
  details: string;
}

export interface Settings {
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  hours: string;
  mapsUrl: string;
  history: string;
  vision: string;
  missionsText: string;
  values: string[];
}

export interface PortalData {
  divisions: Division[];
  dossiers: Dossier[];
  actualites: Actualite[];
  faq: FAQ[];
  medias: Media[];
  settings: Settings;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
