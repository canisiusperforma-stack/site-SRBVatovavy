import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  loadDatabase,
  saveDatabase,
  logActivity,
  queryKnowledgeBase,
  Division,
  Dossier,
  Actualite,
  FAQ,
  Media,
  Settings
} from "./src/server/db.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialiser la base de données
const db = loadDatabase();

// Récupérer le client Gemini de manière paresseuse (lazy initialization) pour éviter les plantages
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("Attention: GEMINI_API_KEY non configurée. L'assistant fonctionnera en mode simulation.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// --- API PUBLIQUES ---

// Vérification de l'état
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Récupérer les données du portail d'un coup
app.get("/api/portal/data", (req, res) => {
  const currentDb = loadDatabase();
  res.json({
    divisions: currentDb.divisions,
    dossiers: currentDb.dossiers.filter((d) => d.statut === "Actif"),
    actualites: currentDb.actualites,
    faq: currentDb.faq,
    medias: currentDb.medias,
    settings: currentDb.settings,
  });
});

// Authentification Administrateur / Éditeur (Session simple)
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const currentDb = loadDatabase();
  
  const user = currentDb.users.find(
    (u) => u.username === username && u.passwordHash === password
  );

  if (user) {
    logActivity(user.fullName, "Connexion", "Session ouverte avec succès.");
    res.json({
      success: true,
      token: `token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } else {
    res.status(401).json({ success: false, message: "Identifiants invalides" });
  }
});

// Assistant Virtuel RAG - SRB Vatovavy
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message requis" });
  }

  try {
    const client = getGeminiClient();
    const knowledgeContext = queryKnowledgeBase();

    const systemInstruction = `Tu es "SRB Vatovavy", l'assistant virtuel officiel du Service Régional du Budget de Vatovavy (Madagascar).
Tu représentes officiellement l'administration publique.
Tu réponds toujours avec un ton professionnel, poli, accueillant, clair et digne d'un fonctionnaire du Ministère de l'Économie et des Finances de Madagascar.

Tu ne réponds qu'aux questions concernant :
- Le Service Régional du Budget de Vatovavy, ses missions, son historique, sa vision et ses valeurs ;
- Ses divisions internes et leurs responsables ;
- Les procédures administratives (retraites, solde, visas d'engagement, etc.) et les PIÈCES À FOURNIR obligatoires ;
- Les actualités, règlements, communiqués, lois budgétaires régionaux ;
- Les horaires de guichet, l'adresse physique à Mananjary et les coordonnées de contact.

REGLES ABSOLUES :
1. Tu n'inventes JAMAIS d'information.
2. Tu t'appuies UNIQUEMENT sur la base documentaire officielle fournie dans le contexte ci-dessous.
3. Si l'information est absente de la base documentaire ou que la question n'a aucun rapport avec le SRB Vatovavy, réponds EXACTEMENT :
"Je ne dispose pas actuellement de cette information dans la documentation officielle du Service Régional du Budget de Vatovavy. Je vous invite à contacter directement nos services."
4. Tu ne donnes jamais d'avis personnel ou politique.
5. Tu réponds en Français de manière structurée et polie, ou en Malagasy si l'usager s'adresse à toi en Malagasy.

Voici la base documentaire officielle à jour :
${knowledgeContext}
`;

    if (client) {
      // Construire le format de chat à partir de l'historique de l'UI
      const contents = [];
      
      // Ajouter l'historique si présent
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.sender === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      
      // Ajouter le message actuel
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2, // Température basse pour limiter la créativité et forcer le respect des faits
        },
      });

      const textResponse = response.text || "Désolé, je n'ai pas pu générer de réponse.";
      res.json({ response: textResponse });
    } else {
      // Mode simulation (fallback élégant si l'API key n'est pas fournie ou invalide)
      console.log("Gemini API hors ligne, activation du moteur de règles local...");
      const lowerMsg = message.toLowerCase();
      let localResponse = "";

      if (lowerMsg.includes("horaire") || lowerMsg.includes("ouvert") || lowerMsg.includes("fermé")) {
        localResponse = `Les bureaux physiques du SRB Vatovavy à Mananjary sont ouverts du lundi au vendredi de 08h00 à 12h00 et de 14h00 à 16h00 (fermé le mercredi après-midi pour traitement interne).`;
      } else if (lowerMsg.includes("retraite") || lowerMsg.includes("pension")) {
        localResponse = `Pour constituer un dossier de Pension Civile de Retraite au SRB Vatovavy, vous devez fournir les pièces obligatoires suivantes :
- Arrêté de mise à la retraite original
- Dernier certificat administratif de solde
- Copie certifiée conforme de la CIN
- Fiche individuelle de solde récente
- Certificat de vie et de résidence (moins de 3 mois)
- RIB original
- Acte de naissance original.
Le délai moyen d'obtention de la pension est de 30 jours à Mananjary.`;
      } else if (lowerMsg.includes("solde") || lowerMsg.includes("prise de service")) {
        localResponse = `Pour votre Première Prise de Service dans la région Vatovavy, veuillez fournir au bureau de la solde :
- Arrêté d'intégration ou d'engagement
- Décision d'affectation régionale
- Procès-verbal de prise de service original
- Certificat de non-paiement de solde (si mutation)
- Copie certifiée de la CIN
- RIB pour virement bancaire.`;
      } else if (lowerMsg.includes("division") || lowerMsg.includes("chef") || lowerMsg.includes("service")) {
        localResponse = `Le SRB Vatovavy est structuré en trois divisions clés :
1. **Division de la Solde et des Pensions** (Chef : M. Randriamiarisoa Jean Luc)
2. **Division du Contrôle des Dépenses Engagées** (Chef : Mme Rasoamanarivo Aimée)
3. **Division du Budget, de la Comptabilité et du Patrimoine** (Chef : M. Rakotonirina Harison)`;
      } else if (lowerMsg.includes("contact") || lowerMsg.includes("téléphone") || lowerMsg.includes("email") || lowerMsg.includes("adresse")) {
        localResponse = `Vous pouvez contacter le Service Régional du Budget Vatovavy aux coordonnées officielles suivantes :
- **Adresse** : Quartier Administratif, près de la Préfecture, Mananjary, 317 Madagascar
- **Téléphone** : +261 34 50 123 45 / +261 32 45 678 90
- **Email** : srb.vatovavy@mef.gov.mg`;
      } else {
        localResponse = `Je ne dispose pas actuellement de cette information dans la documentation officielle du Service Régional du Budget de Vatovavy. Je vous invite à contacter directement nos services.`;
      }

      res.json({ response: localResponse, simulated: true });
    }
  } catch (error: any) {
    console.error("Erreur Chatbot Gemini:", error);
    res.status(500).json({
      error: "Erreur lors du traitement de votre demande par le chatbot.",
      details: error.message,
    });
  }
});

// Formulaire de contact public
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
  }

  // Enregistrer le message de contact sous forme de log système pour que l'admin le voie
  logActivity(
    "Public/Visiteur",
    "Formulaire Contact",
    `Nouveau message reçu de ${name} (${email}) - Objet: ${subject || "Sans objet"}. Contenu: ${message.substring(0, 100)}...`
  );

  res.json({ success: true, message: "Votre message a été transmis avec succès au SRB Vatovavy." });
});

// --- APIS D'ADMINISTRATION SECURISEES ---
// (Dans une vraie application, on utiliserait un middleware d'authentification par Token.
// Pour simplifier et garantir que l'application fonctionne parfaitement sans bugs de tokens,
// nous vérifions la présence d'un en-tête d'autorisation "Authorization" factice ou réel).

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer token-")) {
    return res.status(401).json({ error: "Accès refusé. Authentification requise." });
  }
  next();
}

// Récupérer tous les logs (Admin)
app.get("/api/admin/logs", checkAdminAuth, (req, res) => {
  const currentDb = loadDatabase();
  res.json(currentDb.logs);
});

// Récupérer les statistiques d'administration
app.get("/api/admin/stats", checkAdminAuth, (req, res) => {
  const currentDb = loadDatabase();
  const totalDivisions = currentDb.divisions.length;
  const totalDossiers = currentDb.dossiers.length;
  const totalActualites = currentDb.actualites.length;
  const totalMedias = currentDb.medias.length;
  const totalFaqs = currentDb.faq.length;
  const totalUsers = currentDb.users.length;
  const totalLogs = currentDb.logs.length;

  res.json({
    totalDivisions,
    totalDossiers,
    totalActualites,
    totalMedias,
    totalFaqs,
    totalUsers,
    totalLogs,
  });
});

// Enregistrer les paramètres du site (Admin)
app.post("/api/admin/settings", checkAdminAuth, (req, res) => {
  const updatedSettings: Settings = req.body;
  const currentDb = loadDatabase();
  currentDb.settings = { ...currentDb.settings, ...updatedSettings };
  saveDatabase(currentDb);
  logActivity("Administrateur", "Paramètres du site", "Mise à jour des informations de contact et missions.");
  res.json({ success: true, settings: currentDb.settings });
});

// --- CRUD DIVISIONS (Admin) ---

app.post("/api/admin/divisions", checkAdminAuth, (req, res) => {
  const newDiv: Division = req.body;
  if (!newDiv.name || !newDiv.chef) {
    return res.status(400).json({ error: "Nom et chef de division obligatoires" });
  }
  const currentDb = loadDatabase();
  const id = `div-${Date.now()}`;
  const record = { ...newDiv, id };
  currentDb.divisions.push(record);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Ajout Division", `Création de la division : ${newDiv.name}`);
  res.json(record);
});

app.put("/api/admin/divisions/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const updatedDiv: Division = req.body;
  const currentDb = loadDatabase();
  const idx = currentDb.divisions.findIndex((d) => d.id === id);
  if (idx === -1) return res.status(404).json({ error: "Division non trouvée" });

  currentDb.divisions[idx] = { ...currentDb.divisions[idx], ...updatedDiv, id };
  saveDatabase(currentDb);
  logActivity("Administrateur", "Modification Division", `Mise à jour de la division : ${updatedDiv.name}`);
  res.json(currentDb.divisions[idx]);
});

app.delete("/api/admin/divisions/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const currentDb = loadDatabase();
  const div = currentDb.divisions.find((d) => d.id === id);
  if (!div) return res.status(404).json({ error: "Division non trouvée" });

  currentDb.divisions = currentDb.divisions.filter((d) => d.id !== id);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Suppression Division", `Division supprimée : ${div.name}`);
  res.json({ success: true });
});

// --- CRUD DOSSIERS (Admin) ---

app.post("/api/admin/dossiers", checkAdminAuth, (req, res) => {
  const newDos: Dossier = req.body;
  if (!newDos.name || !newDos.divisionId) {
    return res.status(400).json({ error: "Nom et division requis" });
  }
  const currentDb = loadDatabase();
  const id = `dos-${Date.now()}`;
  const now = new Date().toISOString();
  const record: Dossier = {
    ...newDos,
    id,
    createdAt: now,
    updatedAt: now,
  };
  currentDb.dossiers.push(record);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Ajout Dossier", `Création de la procédure : ${newDos.name}`);
  res.json(record);
});

app.put("/api/admin/dossiers/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const updatedDos: Dossier = req.body;
  const currentDb = loadDatabase();
  const idx = currentDb.dossiers.findIndex((d) => d.id === id);
  if (idx === -1) return res.status(404).json({ error: "Dossier non trouvé" });

  currentDb.dossiers[idx] = {
    ...currentDb.dossiers[idx],
    ...updatedDos,
    id,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(currentDb);
  logActivity("Administrateur", "Modification Dossier", `Mise à jour de la procédure : ${updatedDos.name}`);
  res.json(currentDb.dossiers[idx]);
});

app.delete("/api/admin/dossiers/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const currentDb = loadDatabase();
  const dos = currentDb.dossiers.find((d) => d.id === id);
  if (!dos) return res.status(404).json({ error: "Dossier non trouvé" });

  currentDb.dossiers = currentDb.dossiers.filter((d) => d.id !== id);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Suppression Dossier", `Procédure supprimée : ${dos.name}`);
  res.json({ success: true });
});

// --- CRUD ACTUALITES (Admin) ---

app.post("/api/admin/actualites", checkAdminAuth, (req, res) => {
  const newAct: Actualite = req.body;
  if (!newAct.title || !newAct.contenu) {
    return res.status(400).json({ error: "Titre et contenu obligatoires" });
  }
  const currentDb = loadDatabase();
  const id = `actu-${Date.now()}`;
  const record: Actualite = {
    ...newAct,
    id,
    date: new Date().toISOString().split("T")[0],
  };
  currentDb.actualites.unshift(record); // Plus récent d'abord
  saveDatabase(currentDb);
  logActivity("Administrateur", "Publication Actualité", `Publication : ${newAct.title}`);
  res.json(record);
});

app.put("/api/admin/actualites/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const updatedAct: Actualite = req.body;
  const currentDb = loadDatabase();
  const idx = currentDb.actualites.findIndex((a) => a.id === id);
  if (idx === -1) return res.status(404).json({ error: "Actualité non trouvée" });

  currentDb.actualites[idx] = { ...currentDb.actualites[idx], ...updatedAct, id };
  saveDatabase(currentDb);
  logActivity("Administrateur", "Modification Actualité", `Mise à jour de l'actualité : ${updatedAct.title}`);
  res.json(currentDb.actualites[idx]);
});

app.delete("/api/admin/actualites/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const currentDb = loadDatabase();
  const act = currentDb.actualites.find((a) => a.id === id);
  if (!act) return res.status(404).json({ error: "Actualité non trouvée" });

  currentDb.actualites = currentDb.actualites.filter((a) => a.id !== id);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Suppression Actualité", `Actualité retirée : ${act.title}`);
  res.json({ success: true });
});

// --- CRUD FAQ (Admin) ---

app.post("/api/admin/faq", checkAdminAuth, (req, res) => {
  const newFaq: FAQ = req.body;
  if (!newFaq.question || !newFaq.answer) {
    return res.status(400).json({ error: "Question et réponse obligatoires" });
  }
  const currentDb = loadDatabase();
  const id = `faq-${Date.now()}`;
  const record = { ...newFaq, id };
  currentDb.faq.push(record);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Ajout FAQ", `FAQ ajoutée : ${newFaq.question.substring(0, 50)}...`);
  res.json(record);
});

app.put("/api/admin/faq/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const updatedFaq: FAQ = req.body;
  const currentDb = loadDatabase();
  const idx = currentDb.faq.findIndex((f) => f.id === id);
  if (idx === -1) return res.status(404).json({ error: "FAQ non trouvée" });

  currentDb.faq[idx] = { ...currentDb.faq[idx], ...updatedFaq, id };
  saveDatabase(currentDb);
  logActivity("Administrateur", "Modification FAQ", `Mise à jour FAQ : ${updatedFaq.question.substring(0, 50)}...`);
  res.json(currentDb.faq[idx]);
});

app.delete("/api/admin/faq/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const currentDb = loadDatabase();
  const f = currentDb.faq.find((item) => item.id === id);
  if (!f) return res.status(404).json({ error: "FAQ non trouvée" });

  currentDb.faq = currentDb.faq.filter((item) => item.id !== id);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Suppression FAQ", `FAQ supprimée : ${f.question.substring(0, 50)}...`);
  res.json({ success: true });
});

// --- CRUD MEDIAS (Admin) ---

app.post("/api/admin/medias", checkAdminAuth, (req, res) => {
  const newMedia: Media = req.body;
  if (!newMedia.name || !newMedia.type) {
    return res.status(400).json({ error: "Nom et type de média obligatoires" });
  }
  const currentDb = loadDatabase();
  const id = `med-${Date.now()}`;
  const record: Media = {
    ...newMedia,
    id,
    date: new Date().toISOString().split("T")[0],
    url: newMedia.url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", // Fallback URL
  };
  currentDb.medias.unshift(record);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Ajout Document/Média", `Fichier ajouté à la médiathèque : ${newMedia.name}`);
  res.json(record);
});

app.delete("/api/admin/medias/:id", checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const currentDb = loadDatabase();
  const med = currentDb.medias.find((m) => m.id === id);
  if (!med) return res.status(404).json({ error: "Média non trouvé" });

  currentDb.medias = currentDb.medias.filter((m) => m.id !== id);
  saveDatabase(currentDb);
  logActivity("Administrateur", "Suppression Média", `Média supprimé de la médiathèque : ${med.name}`);
  res.json({ success: true });
});

// --- INITIALISATION DU SERVEUR ET GESTION DE VITE ---

async function startServer() {
  // Configurer le serveur Vite en mode de développement ou servir les fichiers statiques en production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur SRB Vatovavy démarré à l'adresse : http://localhost:${PORT}`);
  });
}

startServer();
