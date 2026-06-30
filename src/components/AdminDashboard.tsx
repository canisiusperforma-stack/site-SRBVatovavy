import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Building,
  FileText,
  Newspaper,
  HelpCircle,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Save,
  Clock,
  Eye,
  Check,
  X,
  AlertTriangle,
  UserCheck,
  PlusCircle,
  FileCheck,
  Download
} from "lucide-react";
import { PortalData, Division, Dossier, Actualite, FAQ, Media, Settings, LogEntry } from "../types";

interface AdminDashboardProps {
  token: string;
  onRefreshPortal: () => void;
  portalData: PortalData;
}

type TabType = "stats" | "divisions" | "dossiers" | "actualites" | "faq" | "medias" | "settings" | "logs";

export default function AdminDashboard({ token, onRefreshPortal, portalData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({
    totalDivisions: 0,
    totalDossiers: 0,
    totalActualites: 0,
    totalMedias: 0,
    totalFaqs: 0,
    totalLogs: 0
  });

  // États pour les formulaires de création / édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"division" | "dossier" | "actualite" | "faq" | "media" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Formulaire Division
  const [divForm, setDivForm] = useState<Partial<Division>>({
    name: "",
    description: "",
    chef: "",
    chefImageUrl: "",
    missions: [""],
    competences: [""],
    dossiersTraites: [""],
    contacts: ""
  });

  // Formulaire Dossier
  const [dosForm, setDosForm] = useState<Partial<Dossier>>({
    name: "",
    description: "",
    divisionId: "",
    piecesAFournir: [""],
    conditions: [""],
    delais: "",
    statut: "Actif",
    responsable: ""
  });

  // Formulaire Actualite
  const [actuForm, setActuForm] = useState<Partial<Actualite>>({
    title: "",
    resume: "",
    contenu: "",
    category: "Général",
    author: "Service Régional du Budget",
    imageUrl: ""
  });

  // Formulaire FAQ
  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    category: "Général"
  });

  // Formulaire Média
  const [mediaForm, setMediaForm] = useState<Partial<Media>>({
    name: "",
    type: "pdf",
    url: ""
  });

  // Formulaire Settings
  const [settingsForm, setSettingsForm] = useState<Settings>({ ...portalData.settings });

  // Notifications
  const [notify, setNotify] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const triggerNotification = (type: "success" | "error", text: string) => {
    setNotify({ type, text });
    setTimeout(() => setNotify(null), 4000);
  };

  const fetchLogsAndStats = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const logsRes = await fetch("/api/admin/logs", { headers });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }

      const statsRes = await fetch("/api/admin/stats", { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Erreur stats/logs:", err);
    }
  };

  useEffect(() => {
    fetchLogsAndStats();
  }, [activeTab, token]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        triggerNotification("success", "Voahorona soa aman-tsara ny parametran'ny SRB Vatovavy.");
        onRefreshPortal();
      } else {
        triggerNotification("error", "Nisy olana teo amin'ny fanovana ny parametra.");
      }
    } catch (err) {
      triggerNotification("error", "Tsy afaka mifandray amin'ny server fitantanana.");
    }
  };

  // --- ACTIONS DE SUPPRESSION ---
  const handleDelete = async (type: TabType, id: string) => {
    if (!window.confirm("Tena te hamafa an'io ve ianao ?")) return;

    try {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        triggerNotification("success", "Voafafa soa aman-tsara.");
        onRefreshPortal();
        fetchLogsAndStats();
      } else {
        triggerNotification("error", "Nisy olana teo amin'ny famafana.");
      }
    } catch (err) {
      triggerNotification("error", "Olana ara-tambajotra.");
    }
  };

  // --- ACTIONS DE MODAL / SUBMIT CRUD ---

  const openAddModal = (type: "division" | "dossier" | "actualite" | "faq" | "media") => {
    setModalType(type);
    setEditId(null);
    setIsModalOpen(true);

    if (type === "division") {
      setDivForm({ name: "", description: "", chef: "", chefImageUrl: "", missions: [""], competences: [""], dossiersTraites: [""], contacts: "" });
    } else if (type === "dossier") {
      setDosForm({ name: "", description: "", divisionId: portalData.divisions[0]?.id || "", piecesAFouruir: [""], conditions: [""], delais: "", statut: "Actif", responsable: "" } as any);
    } else if (type === "actualite") {
      setActuForm({ title: "", resume: "", contenu: "", category: "Vaovao", author: "SRB Vatovavy", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" });
    } else if (type === "faq") {
      setFaqForm({ question: "", answer: "", category: "Ankapobeny" });
    } else if (type === "media") {
      setMediaForm({ name: "", type: "pdf", url: "" });
    }
  };

  const openEditModal = (type: "division" | "dossier" | "actualite" | "faq", item: any) => {
    setModalType(type);
    setEditId(item.id);
    setIsModalOpen(true);

    if (type === "division") {
      setDivForm({ ...item });
    } else if (type === "dossier") {
      setDosForm({ ...item });
    } else if (type === "actualite") {
      setActuForm({ ...item });
    } else if (type === "faq") {
      setFaqForm({ ...item });
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let url = `/api/admin/${modalType}s`;
      let method = "POST";
      let body: any = {};

      if (editId) {
        url = `/api/admin/${modalType}s/${editId}`;
        method = "PUT";
      }

      if (modalType === "division") body = divForm;
      else if (modalType === "dossier") body = dosForm;
      else if (modalType === "actualite") body = actuForm;
      else if (modalType === "faq") body = faqForm;
      else if (modalType === "media") body = mediaForm;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        triggerNotification("success", "Tafiditra soa aman-tsara! Nohavaozina ihany koa ny robot mpanampy RAG.");
        setIsModalOpen(false);
        onRefreshPortal();
        fetchLogsAndStats();
      } else {
        const data = await res.json();
        triggerNotification("error", data.error || "Nisy olana teo amin'ny fitahirizana.");
      }
    } catch (err) {
      triggerNotification("error", "Olana ara-tambajotra fitantanana.");
    }
  };

  // Helper pour manipuler les champs de tableaux (missions, competences, etc.)
  const handleArrayFieldChange = (
    formType: "div" | "dos",
    field: string,
    index: number,
    value: string
  ) => {
    if (formType === "div") {
      const arr = [...((divForm as any)[field] || [])];
      arr[index] = value;
      setDivForm({ ...divForm, [field]: arr });
    } else {
      const arr = [...((dosForm as any)[field] || [])];
      arr[index] = value;
      setDosForm({ ...dosForm, [field]: arr });
    }
  };

  const addArrayFieldRow = (formType: "div" | "dos", field: string) => {
    if (formType === "div") {
      const arr = [...((divForm as any)[field] || []), ""];
      setDivForm({ ...divForm, [field]: arr });
    } else {
      const arr = [...((dosForm as any)[field] || []), ""];
      setDosForm({ ...dosForm, [field]: arr });
    }
  };

  const removeArrayFieldRow = (formType: "div" | "dos", field: string, index: number) => {
    if (formType === "div") {
      const arr = [...((divForm as any)[field] || [])];
      arr.splice(index, 1);
      setDivForm({ ...divForm, [field]: arr });
    } else {
      const arr = [...((dosForm as any)[field] || [])];
      arr.splice(index, 1);
      setDosForm({ ...dosForm, [field]: arr });
    }
  };

  return (
    <div className="mx-auto max-w-[95%] px-4 py-8 sm:px-6 lg:px-8">
      {/* Alert Notification */}
      {notify && (
        <div
          id="admin-notification"
          className={`fixed bottom-6 left-6 z-50 rounded-lg p-4 shadow-lg text-xs font-semibold flex items-center space-x-2 border animate-bounce ${
            notify.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          {notify.type === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{notify.text}</span>
        </div>
      )}

      {/* Header and Branding */}
      <div className="mb-8 border-b border-gray-200 pb-5 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-sky-950 sm:truncate sm:text-3xl">
            Sehatra fanaraha-maso ny fitantanana SRB
          </h2>
          <p className="mt-1 text-xs text-sky-700 font-semibold uppercase tracking-wider flex items-center">
            <UserCheck className="h-4 w-4 mr-1 inline" />
            Toerana fitantanana azo antoka • Sampandraharaham-paritry ny Tetibola Vatovavy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-xs h-fit space-y-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Tafatafa fitantanana
          </h3>
          <button
            id="tab-stats"
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "stats"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Tabilao fanaraha-maso</span>
          </button>
          <button
            id="tab-divisions"
            onClick={() => setActiveTab("divisions")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "divisions"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Fitantanana ny Sampandraharaha</span>
          </button>
          <button
            id="tab-dossiers"
            onClick={() => setActiveTab("dossiers")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "dossiers"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Fitantanana ny Paikady</span>
          </button>
          <button
            id="tab-actualites"
            onClick={() => setActiveTab("actualites")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "actualites"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>Fampahafantarana / Vaovao</span>
          </button>
          <button
            id="tab-faq"
            onClick={() => setActiveTab("faq")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "faq"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Fanontaniana matetika</span>
          </button>
          <button
            id="tab-medias"
            onClick={() => setActiveTab("medias")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "medias"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Tahirin-kevitra / PDF</span>
          </button>
          <button
            id="tab-settings"
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Parametran'ny Tranonkala</span>
          </button>
          <button
            id="tab-logs"
            onClick={() => setActiveTab("logs")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "logs"
                ? "bg-sky-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Rakitry ny Asa natao</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          {/* TAB 1: DASHBOARD STATS */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-sky-950">Tabilao fanaraha-maso</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl">
                  <Building className="h-6 w-6 text-sky-900 mb-2" />
                  <p className="text-2xl font-bold text-sky-950">{stats.totalDivisions}</p>
                  <p className="text-xs text-gray-500 font-semibold">Sampandraharaha</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <FileText className="h-6 w-6 text-emerald-700 mb-2" />
                  <p className="text-2xl font-bold text-emerald-950">{stats.totalDossiers}</p>
                  <p className="text-xs text-gray-500 font-semibold">Paikady mandeha</p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <Newspaper className="h-6 w-6 text-amber-700 mb-2" />
                  <p className="text-2xl font-bold text-amber-950">{stats.totalActualites}</p>
                  <p className="text-xs text-gray-500 font-semibold">Fampahafantarana</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <ImageIcon className="h-6 w-6 text-purple-700 mb-2" />
                  <p className="text-2xl font-bold text-purple-950">{stats.totalMedias}</p>
                  <p className="text-xs text-gray-500 font-semibold">Taratasy & Sary/Tahirin-kevitra</p>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <HelpCircle className="h-6 w-6 text-rose-700 mb-2" />
                  <p className="text-2xl font-bold text-rose-950">{stats.totalFaqs}</p>
                  <p className="text-xs text-gray-500 font-semibold">Fanontaniana matetika</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <Activity className="h-6 w-6 text-gray-700 mb-2" />
                  <p className="text-2xl font-bold text-gray-950">{stats.totalLogs}</p>
                  <p className="text-xs text-gray-500 font-semibold">Asa voasoratra ao amin'ny diary</p>
                </div>
              </div>

              {/* Quick instructions banner */}
              <div className="p-4 bg-sky-950 rounded-xl text-white">
                <h4 className="text-sm font-bold text-amber-400 mb-1 flex items-center">
                  <FileCheck className="h-4 w-4 mr-1.5" />
                  Fampivoarana ara-teknolojia an'i Vatovavy
                </h4>
                <p className="text-[11px] leading-relaxed text-sky-100">
                  Mampiasa rafitra fikarohana vectoriel (RAG) mandeha ho azy ny tranonkala. Isaky ny manova na manampy Sampandraharaha, Paikady, Fanontaniana, na Vaovao ianao, dia tonga dia azon'ilay robot mpanampy ampiasaina izany mba hanampiana ireo mpanjifa.
                </p>
              </div>

              {/* Recent Logs Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Asa farany natao
                </h4>
                <div className="border border-gray-100 rounded-lg divide-y divide-gray-50 overflow-hidden text-xs">
                  {logs.slice(0, 5).map((l) => (
                    <div key={l.id} className="p-3 hover:bg-gray-50 flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sky-950">{l.user}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sky-800 font-semibold">{l.action}</span>
                        </div>
                        <p className="text-gray-500 mt-0.5">{l.details}</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(l.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIVISIONS */}
          {activeTab === "divisions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-sky-950">Fitantanana ny Sampandraharaha</h3>
                <button
                  id="btn-add-division"
                  onClick={() => openAddModal("division")}
                  className="inline-flex items-center space-x-1 bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Sampandraharaha Vaovao</span>
                </button>
              </div>

              <div className="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-100">
                {portalData.divisions.map((div) => (
                  <div key={div.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sky-950">{div.name}</h4>
                      <p className="text-xs text-emerald-800 font-semibold">Lehibeny : {div.chef}</p>
                      <p className="text-xs text-gray-500 max-w-xl">{div.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => openEditModal("division", div)}
                        className="p-1.5 text-sky-800 hover:bg-sky-50 rounded-md transition-colors"
                        title="Hanova"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("divisions", div.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hamafa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOSSIERS / PROCEDURES */}
          {activeTab === "dossiers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-sky-950">Fitantanana ny Paikady</h3>
                <button
                  id="btn-add-dossier"
                  onClick={() => openAddModal("dossier")}
                  className="inline-flex items-center space-x-1 bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Paikady Vaovao</span>
                </button>
              </div>

              <div className="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-100">
                {portalData.dossiers.map((dos) => {
                  const div = portalData.divisions.find((d) => d.id === dos.divisionId);
                  return (
                    <div key={dos.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sky-950">{dos.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dos.statut === "Actif" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {dos.statut === "Actif" ? "Mandeha" : "Mijanona"}
                          </span>
                        </div>
                        <p className="text-[11px] text-sky-900 font-semibold">Sampandraharaha : {div ? div.name : "Tsy voatendry"}</p>
                        <p className="text-xs text-gray-500 max-w-xl">{dos.description}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Mpiandraikitra : {dos.responsable} | Fe-potoana : {dos.delais}</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => openEditModal("dossier", dos)}
                          className="p-1.5 text-sky-800 hover:bg-sky-50 rounded-md transition-colors"
                          title="Hanova"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete("dossiers", dos.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hamafa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ACTUALITES */}
          {activeTab === "actualites" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-sky-950">Fampahafantarana & Vaovao</h3>
                <button
                  id="btn-add-actualite"
                  onClick={() => openAddModal("actualite")}
                  className="inline-flex items-center space-x-1 bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Hamoaka vaovao</span>
                </button>
              </div>

              <div className="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-100">
                {portalData.actualites.map((act) => (
                  <div key={act.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md uppercase">
                          {act.category}
                        </span>
                        <span className="text-[10px] text-gray-400">{act.date}</span>
                      </div>
                      <h4 className="font-bold text-sky-950">{act.title}</h4>
                      <p className="text-xs text-gray-500 max-w-xl line-clamp-1">{act.resume}</p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => openEditModal("actualite", act)}
                        className="p-1.5 text-sky-800 hover:bg-sky-50 rounded-md transition-colors"
                        title="Hanova"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("actualites", act.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hamafa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === "faq" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-sky-950">Fanontaniana matetika</h3>
                <button
                  id="btn-add-faq"
                  onClick={() => openAddModal("faq")}
                  className="inline-flex items-center space-x-1 bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Fanontaniana vaovao</span>
                </button>
              </div>

              <div className="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-100">
                {portalData.faq.map((f) => (
                  <div key={f.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md uppercase">
                        {f.category}
                      </span>
                      <h4 className="font-bold text-sky-950 text-xs">F: {f.question}</h4>
                      <p className="text-xs text-gray-500 max-w-xl">V: {f.answer}</p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 mt-2 sm:mt-0">
                      <button
                        onClick={() => openEditModal("faq", f)}
                        className="p-1.5 text-sky-800 hover:bg-sky-50 rounded-md transition-colors"
                        title="Hanova"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("faq", f.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hamafa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MEDIAS */}
          {activeTab === "medias" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-sky-950">Tahirin-kevitra & Taratasy ofisialy</h3>
                <button
                  id="btn-add-media"
                  onClick={() => openAddModal("media")}
                  className="inline-flex items-center space-x-1 bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Hanampy taratasy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portalData.medias.map((med) => (
                  <div key={med.id} className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 flex items-start justify-between">
                    <div className="space-y-1 flex items-start space-x-2.5">
                      <div className="bg-sky-50 p-2 rounded-lg shrink-0 text-sky-900 font-bold text-xs uppercase">
                        {med.type}
                      </div>
                      <div>
                        <h4 className="font-bold text-sky-950 text-xs break-all">{med.name}</h4>
                        <p className="text-[10px] text-gray-400">Halehibeny : {med.size} | Daty : {med.date}</p>
                        <a
                          href={med.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[10px] text-sky-700 hover:underline pt-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>Hijery ny taratasy</span>
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete("medias", med.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Hamafa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <h3 className="text-lg font-bold text-sky-950">Parametran'ny Tranonkala</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Toerana misy ny birao (Mananjary)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Laharana fifandraisana
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    E-mail ofisialy
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Ora fisokafana
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Andraikitra sy Fampahafantarana Ankapobeny (Soratra fandraisana)
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.missionsText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, missionsText: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Tantaran'ny Sampandraharaha ofisialy
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.history}
                  onChange={(e) => setSettingsForm({ ...settingsForm, history: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:bg-white"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 bg-sky-900 text-white text-xs px-4 py-2.5 rounded-lg font-bold hover:bg-sky-950 transition-all cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Hahorona ny parametra</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 8: ACTIVITY LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-sky-950">Rakitry ny asa natao</h3>
                <button
                  onClick={fetchLogsAndStats}
                  className="text-xs text-sky-900 font-bold hover:underline"
                >
                  Hamelombelona
                </button>
              </div>

              <p className="text-[11px] text-gray-400">
                Fanaraha-maso ny asa rehetra natao tamin'ny fanovana sy ny fitantanana ny tranonkala SRB Vatovavy.
              </p>

              <div className="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-50 text-xs">
                {logs.map((log) => (
                  <div key={log.id} className="p-3.5 hover:bg-gray-50 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-sky-950">{log.user}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px]">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono text-right pl-2">
                      {new Date(log.date).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DIALOG COMPLET POUR CRUD --- */}
      {isModalOpen && modalType && (
        <div className="fixed inset-0 z-50 bg-sky-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-sky-950 p-4 text-white flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-sm uppercase tracking-wide">
                {editId ? "Hanova" : "Hanampy"} • {modalType}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sky-300 hover:text-white p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {/* DIVISION FORM fields */}
              {modalType === "division" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Anaran'ny Sampandraharaha</label>
                    <input
                      type="text"
                      value={divForm.name || ""}
                      onChange={(e) => setDivForm({ ...divForm, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Oh: Sampandraharahan'ny Karama sy ny Fisotroan-dronono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Lehiben'ny Sampandraharaha (Anarana feno)</label>
                      <input
                        type="text"
                        value={divForm.chef || ""}
                        onChange={(e) => setDivForm({ ...divForm, chef: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        placeholder="M. Jean Luc"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Fifandraisana mivantana</label>
                      <input
                        type="text"
                        value={divForm.contacts || ""}
                        onChange={(e) => setDivForm({ ...divForm, contacts: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        placeholder="Email / Tel"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Sarin'ny Lehiben'ny Sampandraharaha</label>
                    <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
                      {divForm.chefImageUrl ? (
                        <img
                          src={divForm.chefImageUrl}
                          alt="Chef preview"
                          className="h-12 w-12 rounded-full object-cover border border-gray-300 shadow-xs"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-300">
                          Sary
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setDivForm({ ...divForm, chefImageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="flex-1 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-sky-900 file:text-white file:cursor-pointer hover:file:bg-sky-950"
                      />
                      {divForm.chefImageUrl && (
                        <button
                          type="button"
                          onClick={() => setDivForm({ ...divForm, chefImageUrl: "" })}
                          className="text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          Fafao
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Famaritana fohy</label>
                    <textarea
                      rows={2}
                      value={divForm.description || ""}
                      onChange={(e) => setDivForm({ ...divForm, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Andraikitra lehiben'ny sampandraharaha..."
                      required
                    />
                  </div>

                  {/* Missions (Array field) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-gray-700 uppercase">Lisitry ny andraikitra rehetra</label>
                      <button
                        type="button"
                        onClick={() => addArrayFieldRow("div", "missions")}
                        className="text-[10px] text-sky-900 font-bold flex items-center"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1" /> Hanampy
                      </button>
                    </div>
                    {(divForm.missions || []).map((m, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={m}
                          onChange={(e) => handleArrayFieldChange("div", "missions", idx, e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg p-2"
                          placeholder="Andraikitra..."
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayFieldRow("div", "missions", idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DOSSIER FORM fields */}
              {modalType === "dossier" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Anaran'ny paikady</label>
                      <input
                        type="text"
                        value={dosForm.name || ""}
                        onChange={(e) => setDosForm({ ...dosForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        placeholder="Oh: Fitakiana fisotroan-dronono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Sampandraharaha mpiandraikitra</label>
                      <select
                        value={dosForm.divisionId || ""}
                        onChange={(e) => setDosForm({ ...dosForm, divisionId: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        required
                      >
                        <option value="">Mifidy sampandraharaha...</option>
                        {portalData.divisions.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Fe-potoana hikarakarana azy</label>
                      <input
                        type="text"
                        value={dosForm.delais || ""}
                        onChange={(e) => setDosForm({ ...dosForm, delais: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        placeholder="Oh: 30 andro"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Mpiasa mpiandraikitra / Birao</label>
                      <input
                        type="text"
                        value={dosForm.responsable || ""}
                        onChange={(e) => setDosForm({ ...dosForm, responsable: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        placeholder="Oh: Biraon'ny fisotroan-dronono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Fijoroana</label>
                    <select
                      value={dosForm.statut || "Actif"}
                      onChange={(e) => setDosForm({ ...dosForm, statut: e.target.value as "Actif" | "Inactif" })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      required
                    >
                      <option value="Actif">Mandeha (Hita amin'ny tranonkala)</option>
                      <option value="Inactif">Tsy mandeha (Afina)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Famaritana</label>
                    <textarea
                      rows={2}
                      value={dosForm.description || ""}
                      onChange={(e) => setDosForm({ ...dosForm, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Hazavao fohy ny paikady..."
                      required
                    />
                  </div>

                  {/* Pieces a fournir (Array field) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-gray-700 uppercase">Taratasy tsy maintsy ampiarahina</label>
                      <button
                        type="button"
                        onClick={() => addArrayFieldRow("dos", "piecesAFournir")}
                        className="text-[10px] text-sky-900 font-bold flex items-center"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1" /> Hanampy
                      </button>
                    </div>
                    {(dosForm.piecesAFournir || []).map((p, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={p}
                          onChange={(e) => handleArrayFieldChange("dos", "piecesAFournir", idx, e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg p-2"
                          placeholder="Oh: 1x Kopia nahitsy ny CIN"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayFieldRow("dos", "piecesAFournir", idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTUALITE FORM fields */}
              {modalType === "actualite" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Anaran'ny Fampahafantarana</label>
                    <input
                      type="text"
                      value={actuForm.title || ""}
                      onChange={(e) => setActuForm({ ...actuForm, title: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Oh: Fanombohana ny fampiasana solosaina..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Sokajy</label>
                      <input
                        type="text"
                        value={actuForm.category || "Vaovao"}
                        onChange={(e) => setActuForm({ ...actuForm, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        placeholder="Vaovao / Fampandrenesana"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Mpanoratra</label>
                      <input
                        type="text"
                        value={actuForm.author || "SRB Vatovavy"}
                        onChange={(e) => setActuForm({ ...actuForm, author: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Rohy sary dika (Unsplash/Rohy hafa)</label>
                    <input
                      type="text"
                      value={actuForm.imageUrl || ""}
                      onChange={(e) => setActuForm({ ...actuForm, imageUrl: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Fintina fohy</label>
                    <input
                      type="text"
                      value={actuForm.resume || ""}
                      onChange={(e) => setActuForm({ ...actuForm, resume: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Fintina fohy iray andalana..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Hafatra feno</label>
                    <textarea
                      rows={5}
                      value={actuForm.contenu || ""}
                      onChange={(e) => setActuForm({ ...actuForm, contenu: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Soraty eto ny hafatra manontolo..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* FAQ FORM fields */}
              {modalType === "faq" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Fanontanian'ny mpanjifa</label>
                    <input
                      type="text"
                      value={faqForm.question || ""}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Ahoana ny..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Sokajy</label>
                    <input
                      type="text"
                      value={faqForm.category || "Ankapobeny"}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Ankapobeny / Karama / Fisotroan-dronono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Valiny ofisialy</label>
                    <textarea
                      rows={3}
                      value={faqForm.answer || ""}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Ny valiny ara-dalàna na ara-panao..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* MEDIA FORM fields */}
              {modalType === "media" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Anaran'ny taratasy</label>
                    <input
                      type="text"
                      value={mediaForm.name || ""}
                      onChange={(e) => setMediaForm({ ...mediaForm, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="torolalana_pension.pdf"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Karazan'ny taratasy</label>
                      <select
                        value={mediaForm.type || "pdf"}
                        onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value as any })}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        required
                      >
                        <option value="pdf">PDF / Tatitra</option>
                        <option value="photo">Sary</option>
                        <option value="communique">Fampandrenesana Ofisialy</option>
                        <option value="rapport">Tatitry ny Tetibola</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Halehiben'ny rakitra</label>
                      <input
                        type="text"
                        value={(mediaForm as any).size || "1.2 MB"}
                        onChange={(e) => setMediaForm({ ...mediaForm, size: e.target.value } as any)}
                        className="w-full border border-gray-200 rounded-lg p-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Rohy fidirana</label>
                    <input
                      type="text"
                      value={mediaForm.url || ""}
                      onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                      placeholder="Oh : /files/circulaire.pdf"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="border-t border-gray-100 pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Hofoanana
                </button>
                <button
                  type="submit"
                  className="bg-sky-900 text-white hover:bg-sky-950 text-xs px-5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Save className="h-4 w-4" />
                  <span>Hahorona</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
