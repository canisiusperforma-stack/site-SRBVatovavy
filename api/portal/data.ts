import { loadDatabase } from "../../src/server/db";

export default function handler(_req: any, res: any) {
  const currentDb = loadDatabase();

  res.status(200).json({
    divisions: currentDb.divisions,
    dossiers: currentDb.dossiers.filter((d) => d.statut === "Actif"),
    actualites: currentDb.actualites,
    faq: currentDb.faq,
    medias: currentDb.medias,
    settings: currentDb.settings,
  });
}