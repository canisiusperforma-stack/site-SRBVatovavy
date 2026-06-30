import fs from "fs";
import path from "path";

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
  passwordHash: string; // Simplifié pour la démo, en clair ou md5/sha256
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

export interface DatabaseSchema {
  divisions: Division[];
  dossiers: Dossier[];
  actualites: Actualite[];
  faq: FAQ[];
  medias: Media[];
  users: User[];
  logs: LogEntry[];
  settings: Settings;
}

const DB_FILE = path.join(process.cwd(), "src", "server", "db.json");

// Données initiales riches pour le SRB Vatovavy (Madagascar)
const INITIAL_DB: DatabaseSchema = {
  divisions: [
    {
      id: "div-solde",
      name: "Division de la Solde et des Pensions",
      description: "Chargée du traitement de la solde des agents de l'État en activité dans la région Vatovavy, ainsi que de la liquidation et du suivi des dossiers de pension des retraités.",
      chef: "M. Randriamiarisoa Jean Luc",
      chefImageUrl: "/chef-solde.jpg",
      missions: [
        "Traitement et mandatement de la solde des fonctionnaires régionaux",
        "Liquidation et révision des pensions civiles et militaires",
        "Délivrance des fiches de solde et des attestations de non-paiement",
        "Gestion des dossiers d'avancement, d'intégration et de reclassement des agents"
      ],
      competences: [
        "Vérification de la conformité des pièces de solde",
        "Calcul des droits à pension de retraite",
        "Mise à jour du fichier central du personnel de l'État dans la région"
      ],
      dossiersTraites: [
        "Dossier de première prise de service (Solde)",
        "Dossier de pension de retraite",
        "Demande d'indemnités d'éloignement ou de technicité",
        "Fiche individuelle de solde"
      ],
      documentsUtiles: [
        { name: "Formulaire d'ouverture de dossier de Solde", url: "/files/formulaire_solde_srb.pdf" },
        { name: "Guide de l'agent partant à la retraite - MEF", url: "/files/guide_retraite.pdf" }
      ],
      contacts: "solde.srbvatovavy@mef.gov.mg | Tél : +261 34 50 123 45"
    },
    {
      id: "div-controle",
      name: "Division du Contrôle des Dépenses Engagées (CDE)",
      description: "Assure le contrôle de la régularité financière des projets de dépenses publiques régionaux avant leur engagement juridique, préservant ainsi la conformité budgétaire.",
      chef: "Mme Rasoamanarivo Aimée",
      chefImageUrl: "/chef-controle.jpg",
      missions: [
        "Examen préalable de la conformité et de l'opportunité réglementaire des dépenses de l'État",
        "Visas des engagements financiers régionaux",
        "Conseil technique aux ordonnateurs et budgets annexes",
        "Tenue de la comptabilité des engagements"
      ],
      competences: [
        "Maîtrise du Code des Marchés Publics de Madagascar",
        "Audit de conformité des pièces justificatives",
        "Analyse de la disponibilité des crédits budgétaires"
      ],
      dossiersTraites: [
        "Visa d'engagement budgétaire",
        "Marché public régional (Contrats et avenants)",
        "Dossiers de subvention aux communes et structures publiques"
      ],
      documentsUtiles: [
        { name: "Circulaire d'Exécution Budgétaire 2026", url: "/files/circulaire_budget_2026.pdf" },
        { name: "Modèle de fiche d'engagement financier", url: "/files/fiche_engagement_modele.pdf" }
      ],
      contacts: "controle.srbvatovavy@mef.gov.mg | Tél : +261 32 45 678 90"
    },
    {
      id: "div-patrimoine",
      name: "Division du Budget, de la Comptabilité et du Patrimoine",
      description: "Pilote la préparation budgétaire régionale, suit l'exécution comptable des crédits et assure l'inventaire ainsi que le contrôle du patrimoine et du matériel de l'État.",
      chef: "M. Rakotonirina Harison",
      chefImageUrl: "/chef-patrimoine.jpg",
      missions: [
        "Suivi de l'exécution de la Loi de Finances au niveau régional",
        "Suivi comptable des ordonnateurs secondaires de Vatovavy",
        "Inventaire physique et comptabilité matières des biens de l'État",
        "Assistance technique à la préparation des budgets administratifs"
      ],
      competences: [
        "Élaboration de rapports d'exécution budgétaire trimestriels",
        "Suivi de la comptabilité générale et de la comptabilité de gestion",
        "Contrôle de l'utilisation rationnelle des matériels de l'État"
      ],
      dossiersTraites: [
        "Demande d'immatriculation de véhicule administratif",
        "Procès-verbal de réforme de matériel ou mobilier",
        "Dossier de virement ou transfert de crédits budgétaires"
      ],
      documentsUtiles: [
        { name: "Guide de la Comptabilité Matière Madagascar", url: "/files/guide_comptabilite_matiere.pdf" }
      ],
      contacts: "patrimoine.srbvatovavy@mef.gov.mg | Tél : +261 33 21 456 78"
    }
  ],
  dossiers: [
    {
      id: "dos-pension",
      name: "Constitution de dossier de Pension Civile de Retraite",
      description: "Cette procédure permet aux fonctionnaires retraités résidant dans la région Vatovavy d'ouvrir leur droit à la pension civile de retraite.",
      divisionId: "div-solde",
      piecesAFournir: [
        "Arrêté de mise à la retraite en original ou copie certifiée",
        "Dernier certificat administratif de solde avec arrêt de paiement",
        "Copie de la carte d'identité nationale certifiée conforme",
        "Fiche individuelle de solde récente ou bulletin de solde",
        "Certificat de vie individuel et de résidence (moins de 3 mois)",
        "Relevé d'identité bancaire (RIB) original au nom de l'intéressé",
        "Acte de naissance de l'intéressé et des enfants mineurs à charge"
      ],
      conditions: [
        "Avoir atteint l'âge légal de la retraite pour sa catégorie ou son corps",
        "Avoir accompli le nombre d'années de service requis",
        "Résider dans la région Vatovavy pour le dépôt physique"
      ],
      delais: "30 jours à compter du dépôt du dossier complet",
      telechargements: [
        { name: "Demande d'admission à la retraite - Formulaire", url: "/files/demande_retraite_form.pdf" },
        { name: "Liste des pièces à fournir - Version PDF imprimable", url: "/files/check_list_retraite.pdf" }
      ],
      statut: "Actif",
      responsable: "Mme Rafarasoa Viviane (Bureau des Pensions)",
      createdAt: "2026-01-15T09:00:00Z",
      updatedAt: "2026-06-10T14:30:00Z"
    },
    {
      id: "dos-solde",
      name: "Première Prise de Service (Demande de Solde de Base)",
      description: "Permet aux nouveaux fonctionnaires recrutés ou affectés dans la région de Vatovavy d'activer le paiement de leur solde auprès du Trésor public.",
      divisionId: "div-solde",
      piecesAFournir: [
        "Arrêté d'intégration, de nomination ou d'engagement",
        "Décision d'affectation régionale originale",
        "Procès-verbal de prise de service délivré par l'ordonnateur ou le supérieur",
        "Certificat de non-paiement de solde de l'administration d'origine (si transfert)",
        "Copie certifiée de la CIN et carte de fonctionnaire si disponible",
        "Relevé d'identité bancaire pour virement obligatoire"
      ],
      conditions: [
        "Avoir pris service physiquement à son poste dans la région",
        "Dépôt officiel au bureau de la solde du SRB Vatovavy à Mananjary"
      ],
      delais: "45 jours (le temps de la liaison avec le système informatique central)",
      telechargements: [
        { name: "Fiche d'ouverture de droits financiers", url: "/files/fiche_ouverture_droits.pdf" }
      ],
      statut: "Actif",
      responsable: "M. Rakotoarisoa Fenitra (Bureau de la Solde)",
      createdAt: "2026-02-10T08:30:00Z",
      updatedAt: "2026-05-12T11:00:00Z"
    },
    {
      id: "dos-visa-cde",
      name: "Visa des Dépenses et Engagements Financiers",
      description: "Soumission obligatoire de toutes les dépenses des structures publiques régionales de Vatovavy pour contrôle réglementaire avant passation ou ordonnancement.",
      divisionId: "div-controle",
      piecesAFournir: [
        "Fiche d'engagement financier dûment signée par l'Ordonnateur",
        "Projet de contrat, convention, bon de commande ou marché public",
        "Trois factures proforma comparatives (pour les achats de fournitures)",
        "Attestation de disponibilité de crédit budgétaire",
        "Plan de passation de marché annuel approuvé",
        "PV de sélection ou de délibération de la commission d'appel d'offres (si applicable)"
      ],
      conditions: [
        "Les crédits budgétaires correspondants doivent être disponibles et non gelés",
        "L'objet de la dépense doit correspondre strictement à l'imputation budgétaire"
      ],
      delais: "5 à 7 jours ouvrés pour obtention du visa ou retour motivé",
      telechargements: [
        { name: "Modèle de Fiche d'Engagement Financier PDF", url: "/files/fiche_engagement_officielle.pdf" },
        { name: "Guide pratique des procédures d'engagement", url: "/files/guide_proced_engagement.pdf" }
      ],
      statut: "Actif",
      responsable: "Mme Rasoamanarivo Aimée (Chef CDE)",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-06-25T16:15:00Z"
    }
  ],
  actualites: [
    {
      id: "actu-1",
      title: "Lancement de la numérisation des fiches de solde au SRB Vatovavy",
      resume: "Le Service Régional du Budget Vatovavy franchit une étape historique avec la dématérialisation complète des fiches individuelles de solde pour tous les fonctionnaires de la région.",
      contenu: "Dans le cadre de la modernisation de l'administration publique malagasy prônée par le Ministère de l'Économie et des Finances (MEF), le Service Régional du Budget (SRB) Vatovavy a officiellement lancé ce matin son nouveau portail de délivrance numérique des fiches individuelles de solde à Mananjary.\n\nCe projet vise à réduire drastiquement l'utilisation du papier, à éliminer les longues files d'attente mensuelles devant les bureaux, et à sécuriser les données financières des fonctionnaires contre toute fraude ou altération. Les agents n'auront plus besoin de se déplacer physiquement pour obtenir leurs justificatifs de solde, mais pourront les télécharger directement via ce portail sécurisé.\n\nLe Directeur Régional du Budget a souligné lors de son allocution : 'La numérisation est le cœur de notre stratégie pour offrir un service de qualité, transparent et rapide à tous les serviteurs de l'État dans Vatovavy. Nous nous rapprochons de nos usagers.'",
      category: "Modernisation",
      author: "Service Communication SRB",
      date: "2026-06-28",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "actu-2",
      title: "Séminaire régional sur la gestion saine du patrimoine de l'État",
      resume: "Un atelier de formation s'est tenu à Mananjary à l'attention des gestionnaires de patrimoine et comptables matières des districts de Mananjary, Ifanadiana et Nosy Varika.",
      contenu: "La Division du Budget, de la Comptabilité et du Patrimoine du SRB Vatovavy a organisé un séminaire de trois jours sur le renforcement du contrôle du patrimoine mobilier et immobilier de l'État.\n\nPlus de 40 comptables matières et ordonnateurs secondaires de la région ont participé activement à cette session. Les thèmes abordés comprenaient les nouvelles directives de tenue de l'inventaire physique des biens publics, l'immatriculation des véhicules administratifs et les processus légaux de réforme du matériel obsolète.\n\nCette initiative s'inscrit dans la lutte contre le détournement des biens publics et pour une allocation plus rationnelle des ressources étatiques au niveau décentralisé.",
      category: "Formation",
      author: "Division Patrimoine",
      date: "2026-06-15",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e08562744ad?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "actu-3",
      title: "Publication de la Circulaire d'Exécution Budgétaire 2026 pour la Région",
      resume: "Le SRB Vatovavy informe tous les ordonnateurs secondaires régionaux de la mise à disposition des nouvelles directives d'exécution budgétaire.",
      contenu: "La circulaire d'exécution budgétaire pour l'exercice 2026 détaille les priorités régionales en matière de dépenses de fonctionnement et d'investissement, ainsi que les règles strictes d'engagement financier visant à optimiser les deniers publics.\n\nLes ordonnateurs sont invités à télécharger ce document stratégique de référence et à l'appliquer rigoureusement. Des ateliers d'accompagnement personnalisés seront organisés par la Division du Contrôle des Dépenses Engagées (CDE) pour faciliter sa mise en œuvre.",
      category: "Réglementation",
      author: "Direction SRB",
      date: "2026-05-20",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop"
    }
  ],
  faq: [
    {
      id: "faq-1",
      question: "Quels sont les horaires d'ouverture des guichets du SRB Vatovavy ?",
      answer: "Les bureaux et guichets physiques du Service Régional du Budget Vatovavy, situés à Mananjary, sont ouverts au public du lundi au vendredi de 08h00 à 12h00 et de 14h00 à 16h00.",
      category: "Général"
    },
    {
      id: "faq-2",
      question: "Combien de temps faut-il pour obtenir une fiche de solde individuelle ?",
      answer: "Avec la mise en place du système d'automatisation régional, une fiche individuelle de solde physique est délivrée instantanément au guichet sur présentation de votre carte d'identité nationale et de votre numéro matricule. En ligne via le portail, le téléchargement est immédiat après authentification.",
      category: "Solde"
    },
    {
      id: "faq-3",
      question: "Où se situe le bureau du SRB Vatovavy à Mananjary ?",
      answer: "Nos bureaux principaux sont situés dans le quartier administratif de Mananjary, à proximité du Tribunal de Première Instance et de la Préfecture de Mananjary, Madagascar.",
      category: "Général"
    },
    {
      id: "faq-4",
      question: "Quelles pièces sont nécessaires pour une demande de pension de réversion (veuvage) ?",
      answer: "Pour une pension de réversion, les pièces requises incluent : l'acte de décès du conjoint fonctionnaire, l'acte de mariage original, l'arrêté de pension de l'auteur décédé, une copie légalisée de la CIN du conjoint survivant, le certificat de non-remariage, ainsi qu'un RIB bancaire pour le versement.",
      category: "Pensions"
    }
  ],
  medias: [
    {
      id: "med-1",
      name: "circulaire_budget_2026.pdf",
      type: "pdf",
      url: "/files/circulaire_budget_2026.pdf",
      size: "2.4 MB",
      date: "2026-05-18"
    },
    {
      id: "med-2",
      name: "guide_retraite_srb.pdf",
      type: "pdf",
      url: "/files/guide_retraite.pdf",
      size: "4.1 MB",
      date: "2026-06-10"
    },
    {
      id: "med-3",
      name: "photo_inauguration_portail.jpg",
      type: "photo",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      size: "820 KB",
      date: "2026-06-28"
    },
    {
      id: "med-4",
      name: "guide_comptabilite_matiere.pdf",
      type: "pdf",
      url: "/files/guide_comptabilite_matiere.pdf",
      size: "1.8 MB",
      date: "2026-06-15"
    }
  ],
  users: [
    {
      id: "user-admin",
      username: "admin",
      passwordHash: "srbadmin2026", // Mot de passe d'administration sécurisé
      role: "Administrateur",
      fullName: "Chef du Service Régional du Budget"
    },
    {
      id: "user-editor",
      username: "editor",
      passwordHash: "srbeditor2026",
      role: "Éditeur",
      fullName: "Responsable de Communication"
    }
  ],
  logs: [
    {
      id: "log-1",
      user: "System",
      action: "Initialisation du système",
      date: "2026-06-30T04:00:00Z",
      details: "Base de données initialisée avec succès avec les données de départ pour le SRB Vatovavy."
    }
  ],
  settings: {
    contactAddress: "Quartier Administratif, près de la Préfecture, Mananjary, 317 Madagascar",
    contactPhone: "+261 34 50 123 45 / +261 32 45 678 90",
    contactEmail: "srb.vatovavy@mef.gov.mg",
    hours: "Lundi au Vendredi : 08h00 - 12h00 | 14h00 - 16h00 (Guichet fermé les après-midis de mercredi pour traitement interne)",
    mapsUrl: "https://maps.google.com/?q=Mananjary,Madagascar",
    history: "Le Service Régional du Budget (SRB) Vatovavy a été renforcé à la suite de l'érection de la région Vatovavy en tant que collectivité territoriale distincte en 2021. Rattaché directement à la Direction Générale du Budget (DGB) du Ministère de l'Économie et des Finances de Madagascar, le SRB Vatovavy s'est imposé comme l'acteur central du pilotage des finances publiques, de la gestion de la solde et des pensions, et du contrôle de conformité budgétaire dans l'Est malgache. Nos locaux à Mananjary s'emploient quotidiennement à simplifier les démarches administratives pour rapprocher les services financiers des usagers régionaux.",
    vision: "Bâtir une administration budgétaire de proximité digne de confiance, moderne et entièrement transparente, contribuant activement au développement de la Région Vatovavy par une gestion saine et performante des deniers publics.",
    missionsText: "Le SRB Vatovavy assure l'administration décentralisée du budget de l'État dans sa juridiction territoriale. Ses missions essentielles consistent en : la préparation et le suivi d'exécution des lois de finances, le contrôle réglementaire rigoureux des dépenses de l'État (visa CDE), le calcul et la mise en paiement rapides de la solde des fonctionnaires régionaux, la liquidation diligente des pensions de retraite, et la gestion rigoureuse de la comptabilité matières des biens de l'État.",
    values: [
      "Intégrité et Éthique Publique",
      "Transparence dans la gestion des deniers de l'État",
      "Professionnalisme et Qualité du Service",
      "Égalité d'accès et Neutralité administrative",
      "Modernisation technologique au service des usagers"
    ]
  }
};

// Charge la base de données
export function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // S'assurer que le dossier parent existe
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf8");
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur lors du chargement de la base de données:", err);
    return INITIAL_DB;
  }
}

// Sauvegarde la base de données
export function saveDatabase(db: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Erreur lors de la sauvegarde de la base de données:", err);
  }
}

// Ajoute une entrée dans le journal d'activité
export function logActivity(user: string, action: string, details: string): void {
  const db = loadDatabase();
  const newLog: LogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    user,
    action,
    date: new Date().toISOString(),
    details
  };
  db.logs.unshift(newLog); // Plus récent d'abord
  // Garder seulement les 500 derniers logs pour éviter que le fichier grandisse indéfiniment
  if (db.logs.length > 500) {
    db.logs = db.logs.slice(0, 500);
  }
  saveDatabase(db);
}

// Fonction de recherche RAG - compile tout le savoir de la base pour le chatbot
export function queryKnowledgeBase(): string {
  const db = loadDatabase();
  
  let knowledge = `--- BASE DOCUMENTAIRE OFFICIELLE - SRB VATOVAVY, MADAGASCAR ---\n\n`;

  // 1. Présentation générale
  knowledge += `MISSION DU SERVICE REGIONAL DU BUDGET VATOVAVY:\n${db.settings.missionsText}\n\n`;
  knowledge += `HISTORIQUE & PRESENTATION:\n${db.settings.history}\n\n`;
  knowledge += `VISION DU SRB VATOVAVY:\n${db.settings.vision}\n\n`;
  knowledge += `VALEURS:\n${db.settings.values.map(v => `- ${v}`).join("\n")}\n\n`;
  knowledge += `COORDONNEES DU SRB VATOVAVY:\n`;
  knowledge += `- Adresse physique : ${db.settings.contactAddress}\n`;
  knowledge += `- Téléphone : ${db.settings.contactPhone}\n`;
  knowledge += `- Adresse Email officielle : ${db.settings.contactEmail}\n`;
  knowledge += `- Heures d'ouverture au public : ${db.settings.hours}\n\n`;

  // 2. Divisions
  knowledge += `DIVISIONS OFFICIELLES DU SRB VATOVAVY:\n`;
  db.divisions.forEach(div => {
    knowledge += `[Division : ${div.name}]\n`;
    knowledge += `- Description : ${div.description}\n`;
    knowledge += `- Responsable (Chef de division) : ${div.chef}\n`;
    knowledge += `- Missions : ${div.missions.join(", ")}\n`;
    knowledge += `- Compétences requises : ${div.competences.join(", ")}\n`;
    knowledge += `- Dossiers gérés : ${div.dossiersTraites.join(", ")}\n`;
    knowledge += `- Contact direct : ${div.contacts}\n\n`;
  });

  // 3. Procédures administratives (Dossiers)
  knowledge += `GUIDES DES PROCEDURES ET DOSSIERS ADMINISTRATIFS (Pièces à fournir):\n`;
  db.dossiers.forEach(dos => {
    const div = db.divisions.find(d => d.id === dos.divisionId);
    knowledge += `[Procédure : ${dos.name}]\n`;
    knowledge += `- Description : ${dos.description}\n`;
    knowledge += `- Division en charge : ${div ? div.name : "Non spécifié"}\n`;
    knowledge += `- Agent responsable : ${dos.responsable}\n`;
    knowledge += `- Statut de la procédure : ${dos.statut}\n`;
    knowledge += `- Conditions requises : ${dos.conditions.map(c => `  * ${c}`).join("\n")}\n`;
    knowledge += `- PIÈCES À FOURNIR OBLIGATOIRES :\n${dos.piecesAFournir.map(p => `  * [ ] ${p}`).join("\n")}\n`;
    knowledge += `- Délais de traitement habituels : ${dos.delais}\n\n`;
  });

  // 4. Actualités
  knowledge += `DERNIERES ACTUALITES DU SRB VATOVAVY:\n`;
  db.actualites.forEach(act => {
    knowledge += `[Actualité : ${act.title}] (Publiée le ${act.date} par ${act.author})\n`;
    knowledge += `- Résumé : ${act.resume}\n`;
    knowledge += `- Contenu : ${act.contenu}\n\n`;
  });

  // 5. Questions Fréquentes (FAQ)
  knowledge += `QUESTIONS FREQUENTES ET REPONSES (FAQ):\n`;
  db.faq.forEach(f => {
    knowledge += `Q: ${f.question}\nR: ${f.answer}\n(Catégorie: ${f.category})\n\n`;
  });

  return knowledge;
}
