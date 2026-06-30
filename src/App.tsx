import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  CheckSquare,
  Clock,
  User,
  Building,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  Newspaper,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  ExternalLink,
  Lock,
  Eye,
  CheckCircle,
  FileCheck,
  Send,
  Download,
  X
} from "lucide-react";
import { PortalData, User as UserType, ChatMessage, Dossier, Actualite, Division } from "./types";
import { motion, AnimatePresence } from "motion/react";
import ThreeDCard from "./components/ThreeDCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("srb_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("srb_token");
  });

  // États du modal de connexion admin
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const fetchPortalData = async () => {
    try {
      const res = await fetch("/api/portal/data");
      if (res.ok) {
        const data = await res.json();
        setPortalData(data);
      }
    } catch (err) {
      console.error("Erreur de chargement du portail:", err);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem("srb_user", JSON.stringify(data.user));
        localStorage.setItem("srb_token", data.token);
        setIsLoginOpen(false);
        setLoginUsername("");
        setLoginPassword("");
      } else {
        setLoginError(data.message || "Identifiants invalides.");
      }
    } catch (err) {
      setLoginError("Erreur réseau de connexion.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem("srb_user");
    localStorage.removeItem("srb_token");
  };

  if (!portalData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col space-y-4">
        <div className="flex h-12 w-12 animate-spin rounded-full border-4 border-sky-900 border-t-transparent"></div>
        <p className="text-sm font-semibold text-sky-950 uppercase tracking-widest">
          Sampandraharaham-paritry ny Tetibola Vatovavy...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-50 text-gray-800 font-sans">
        <Navbar
          user={currentUser}
          onLogout={handleLogout}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home portalData={portalData} />} />
            <Route path="/a-propos" element={<About portalData={portalData} />} />
            <Route path="/divisions" element={<Divisions portalData={portalData} />} />
            <Route path="/dossiers" element={<Dossiers portalData={portalData} />} />
            <Route path="/actualites" element={<Actualites portalData={portalData} />} />
            <Route path="/contact" element={<ContactAndFAQ portalData={portalData} />} />
            <Route
              path="/admin"
              element={
                authToken ? (
                  <AdminDashboard
                    token={authToken}
                    portalData={portalData}
                    onRefreshPortal={fetchPortalData}
                  />
                ) : (
                  <AdminLoginRedirect onOpenLogin={() => setIsLoginOpen(true)} />
                )
              }
            />
          </Routes>
        </main>

        <Footer settings={portalData.settings} />
        <Chatbot />

        {/* --- MODAL DE CONNEXION ADMIN --- */}
        {isLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-sky-950 uppercase tracking-wider flex items-center">
                  <Lock className="h-4 w-4 mr-1.5 text-sky-900" />
                  Fidirana Mpitantana
                </h3>
                <button
                  onClick={() => {
                    setIsLoginOpen(false);
                    setLoginError("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {loginError && (
                <div className="mb-4 rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-800 border border-red-200">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Solonanarana
                  </label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-sky-800 focus:outline-none"
                    placeholder="Ex: admin"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Teny miafina
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-sky-800 focus:outline-none"
                    placeholder="Soraty ny teny miafina"
                    required
                  />
                </div>

                {/* <div className="bg-sky-50 rounded-lg p-2.5 text-[10px] text-sky-900 leading-relaxed">
                  <span className="font-bold">Kaonty fanandramana efa voafaritra :</span>
                  <br />- Mpitantana : <span className="font-mono">admin</span> / <span className="font-mono">srbadmin2026</span>
                  <br />- Mpanoratra : <span className="font-mono">editor</span> / <span className="font-mono">srbeditor2026</span>
                </div> */}
 
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-1.5 rounded-lg bg-sky-900 py-2.5 font-bold text-white shadow-xs hover:bg-sky-950 transition-all cursor-pointer"
                >
                  <span>Hiditra</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

// --- REDIRECTION LOGIN COMPONENT ---
function AdminLoginRedirect({ onOpenLogin }: { onOpenLogin: () => void }) {
  useEffect(() => {
    onOpenLogin();
  }, [onOpenLogin]);

  return (
    <div className="mx-auto max-w-[95%] px-4 py-24 text-center">
      <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-bold text-sky-950 mb-2">Fidirana Voafetra sy Azo Antoka</h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
        Tsy maintsy tafiditra ianao vao afaka miditra amin'ny fitantanana ny tetibola isam-paritra.
      </p>
      <button
        onClick={onOpenLogin}
        className="inline-flex items-center space-x-1.5 rounded-lg bg-sky-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-sky-950"
      >
        Hampiditra ny solonanarana sy teny miafina
      </button>
    </div>
  );
}

// ==========================================
// 3D PAGE WRAPPER HELPER
// ==========================================
function Page3D({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 4, y: 25 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      exit={{ opacity: 0, rotateX: -4, y: -25 }}
      transition={{ type: "spring", stiffness: 80, damping: 14, mass: 1 }}
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      className="w-full transform-gpu"
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// 1. PAGE D'ACCUEIL (Home)
// ==========================================
function Home({ portalData }: { portalData: PortalData }) {
  return (
    <Page3D>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 text-white border-b border-slate-800">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/bg-home.jpg" 
            alt="Canal des Pangalanes, Mananjary" 
            className="w-full h-full object-cover object-center scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Multi-stage high contrast overlay with gold and blue twilight tones */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />
          {/* Subtle animated overlay pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        {/* 3D Floating Decorative Shapes in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
          <motion.div
            animate={{
              rotate: 360,
              x: [0, 40, -40, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-12 -left-12 w-64 h-64 rounded-full border-[12px] border-blue-400/20 blur-xs"
          />
          <motion.div
            animate={{
              rotate: -360,
              x: [0, -30, 30, 0],
              y: [0, 40, -40, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-24 w-80 h-80 rounded-full border-[18px] border-amber-400/20 blur-xs"
          />
        </div>

        <div className="mx-auto max-w-[95%] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, x: -50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <span className="inline-block px-3 py-1.5 bg-blue-500/15 text-blue-300 text-[10px] font-extrabold rounded-full w-fit uppercase tracking-widest border border-blue-400/30 backdrop-blur-md shadow-lg">
              TRANONKALA OFISIALY NY FITANTANANA
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl leading-tight text-white uppercase drop-shadow-md">
              Manavao ny fitantanana <br />
              <span className="text-amber-400 relative inline-block mt-1">
                ny Volam-panjakana
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"></span>
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed italic pt-2 font-medium drop-shadow-sm">
              "Hiantoka ny fangaraharana, ny fahombiazana ary ny fahitsiana ny tetibola isam-paritra ho an'ny vahoakan'i Vatovavy."
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/dossiers"
                className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 hover:translate-y-[-2px] active:translate-y-0"
              >
                <span>Torolalana momba ny dingana</span>
                <ArrowRight className="h-4 w-4 animate-pulse" />
              </Link>
              <Link
                to="/a-propos"
                className="inline-flex items-center space-x-2 rounded-xl bg-white/10 border border-white/20 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:text-slate-100 hover:border-white/40 hover:bg-white/20 backdrop-blur-md transition-all hover:translate-y-[-2px] active:translate-y-0 shadow-lg"
              >
                <span>Hametraka fanontaniana</span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <ThreeDCard className="rounded-3xl" depth={35}>
              <div className="bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 border border-slate-700/60 space-y-5 shadow-2xl text-left">
                <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Tolotra ao Mananjary</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg px-2.5 py-0.5 font-bold uppercase tracking-wider animate-pulse">Misokatra ny birao</span>
                </div>
                <ul className="space-y-4 text-xs text-slate-200">
                  <li className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
                    <div className="h-7 w-7 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-black text-[11px] shadow-inner border border-slate-700/50">1</div>
                    <span className="font-bold tracking-wide">Famoahana dika mitovin'ny karama eo no ho eo</span>
                  </li>
                  <li className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
                    <div className="h-7 w-7 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-black text-[11px] shadow-inner border border-slate-700/50">2</div>
                    <span className="font-bold tracking-wide">Fikajiana sy fandoavana ny fisotroan-dronono sivily</span>
                  </li>
                  <li className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
                    <div className="h-7 w-7 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-black text-[11px] shadow-inner border border-slate-700/50">3</div>
                    <span className="font-bold tracking-wide">Visa fankatoavana ny fandaniana ara-panjakana isam-paritra</span>
                  </li>
                </ul>
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-[10px] text-slate-400 text-center italic font-bold uppercase tracking-widest">
                    Toerana: Eo ampitan'ny tobin-tsolika Total
                  </p>
                </div>
              </div>
            </ThreeDCard>
          </motion.div>
        </div>
      </section>

      {/* Access Rapide / Services / Stats */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-[95%] px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Bento Stats row with 3D cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThreeDCard className="rounded-2xl" depth={20}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full flex flex-col justify-between">
                <div className="text-[#059669] font-black text-4xl mb-1 drop-shadow-sm">14</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Sampandraharaha isam-paritra</div>
              </div>
            </ThreeDCard>
            <ThreeDCard className="rounded-2xl" depth={20}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full flex flex-col justify-between">
                <div className="text-blue-700 font-black text-4xl mb-1 drop-shadow-sm">+1.2k</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Dossiers Voakaraka / Volana</div>
              </div>
            </ThreeDCard>
            <ThreeDCard className="rounded-2xl" depth={20}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full flex flex-col justify-between">
                <div className="text-orange-500 font-black text-4xl mb-1 drop-shadow-sm">24ora</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Fe-potoana fikarakarana</div>
              </div>
            </ThreeDCard>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-2 pt-4">
            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Tolotra ara-panjakana</h2>
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl uppercase tracking-tight">Fidirana haingana amin'ireo paikady</h3>
            <p className="text-xs text-slate-500 font-medium">
              Jereo eto avokoa ny fepetra sy taratasy ilaina hoentina eo amin'ny SRB Vatovavy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portalData.dossiers.slice(0, 3).map((dos) => (
              <ThreeDCard key={dos.id} className="rounded-2xl" depth={25}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="bg-blue-50 h-10 w-10 rounded-xl flex items-center justify-center text-blue-700 shadow-inner">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{dos.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">{dos.description}</p>
                  </div>
                  <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Fe-potoana : {dos.delais}</span>
                    <Link
                      to="/dossiers"
                      className="inline-flex items-center space-x-1 text-xs text-blue-700 font-bold hover:underline uppercase tracking-wider"
                    >
                      <span>Hijery</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* Présentation du SRB Vatovavy */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-200 relative overflow-hidden">
        <div className="mx-auto max-w-[95%] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Tolotra ho an'ny vahoaka</h2>
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl uppercase tracking-tight">Ny andraikitray isam-paritra</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {portalData.settings.missionsText}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border-l-4 border-blue-700 pl-3">
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Azo atao amin'ny solosaina ao Mananjary</p>
              </div>
              <div className="border-l-4 border-[#059669] pl-3">
                <p className="text-2xl font-black text-slate-900">5 andro</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fe-potoana farany fankatoavana CDE</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <ThreeDCard className="rounded-3xl" depth={30}>
              <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">Ny Soatoavina ara-Tetibola</h4>
                <ul className="space-y-3.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  {portalData.settings.values.map((val, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 transition-transform duration-200 hover:translate-x-1">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </section>

      {/* Dernières Actualités */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[95%] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Vaovao</h2>
              <h3 className="text-2xl font-black text-slate-900 sm:text-3xl uppercase tracking-tight">Fampahafantarana & Serasera</h3>
            </div>
            <Link
              to="/actualites"
              className="text-xs text-blue-700 font-bold hover:underline flex items-center mt-2 sm:mt-0 uppercase tracking-widest"
            >
              <span>Ireo fampahafantarana rehetra</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portalData.actualites.slice(0, 3).map((act) => (
              <ThreeDCard key={act.id} className="rounded-2xl" depth={25}>
                <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      <img
                        src={act.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"}
                        alt={act.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {act.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{act.date}</span>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 uppercase tracking-tight">{act.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-semibold">{act.resume}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link
                      to="/actualites"
                      className="inline-flex items-center text-xs text-blue-700 font-bold hover:underline uppercase tracking-wider"
                    >
                      <span>Hijery ny tohiny</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </article>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>
    </Page3D>
  );
}

// ==========================================
// 2. PAGE À PROPOS (About)
// ==========================================
function About({ portalData }: { portalData: PortalData }) {
  return (
    <Page3D>
      <div className="mx-auto max-w-[95%] px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Introduction banner */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Mombamomba ny SRB</h2>
          <h3 className="text-3xl font-black text-slate-900 sm:text-4xl uppercase tracking-tight">Tantara, Vina ary Andraikitra</h3>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto font-medium">
            Hahafantatra ny tantaran'ny Sampandraharaham-paritry ny Tetibola Vatovavy ao Mananjary, Madagasikara.
          </p>
        </div>

        {/* History */}
        <ThreeDCard className="rounded-2xl" depth={15}>
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Info className="h-5 w-5 text-blue-700" />
              <h4 className="font-bold text-slate-900 text-base uppercase tracking-tight">Ny Lalantsika sy ny Tantaranay</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {portalData.settings.history}
            </p>
          </section>
        </ThreeDCard>

        {/* Vision, Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThreeDCard className="rounded-2xl" depth={20}>
            <section className="bg-white border border-slate-200 rounded-2xl p-6 h-full space-y-3">
              <h4 className="font-bold text-blue-700 text-xs uppercase tracking-widest">Vinan'ny Birao</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {portalData.settings.vision}
              </p>
            </section>
          </ThreeDCard>
          <ThreeDCard className="rounded-2xl" depth={20}>
            <section className="bg-slate-900 text-white rounded-2xl p-6 h-full space-y-3">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-widest">Andraikitra akaiky ny vahoaka</h4>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                Ny Sampandraharaham-paritry ny Tetibola dia miantoka isan'andro ny fankatoavana ny lalàna mifehy ny tetibolam-panjakana manerana ny rantsam-panjakana rehetra.
              </p>
            </section>
          </ThreeDCard>
        </div>

        {/* Direction & Organigramme */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 text-center">
            <h4 className="font-bold text-slate-900 text-base uppercase tracking-tight">Ny Rafitry ny Birao & ny Fitantanana</h4>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Rafitra ofisialy mifehy ny SRB Vatovavy</p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Chef de Service */}
            <ThreeDCard className="rounded-xl w-full max-w-sm" depth={25}>
              <div className="bg-slate-900 text-white p-5 rounded-xl text-center border border-slate-800 flex flex-col items-center">
                <img
                  src="/chef-service.jpg"
                  alt="Lehiben'ny Sampandraharaha"
                  className="h-20 w-20 rounded-full object-cover border-2 border-amber-400 mb-3 shadow-md"
                />
                <h5 className="font-bold text-xs text-amber-400 uppercase tracking-widest mb-1">Mpitantana ny Sampandraharaha</h5>
                <p className="font-black text-sm text-white uppercase tracking-tight">Lehiben'ny Sampandraharaham-paritry ny Tetibola</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vatovavy • Mananjary</p>
              </div>
            </ThreeDCard>

            <div className="h-6 w-0.5 bg-slate-200"></div>

            {/* Divisions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {portalData.divisions.map((div) => (
                <ThreeDCard key={div.id} className="rounded-xl" depth={15}>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center h-full flex flex-col justify-between items-center space-y-3">
                    <div className="flex flex-col items-center">
                      <img
                        src={div.chefImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"}
                        alt={div.chef}
                        className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 mb-2 shadow-xs"
                      />
                      <p className="font-bold text-slate-900 text-xs leading-snug uppercase tracking-tight line-clamp-2 min-h-[2rem] flex items-center justify-center">{div.name}</p>
                    </div>
                    <div className="text-[10px] bg-blue-50 text-blue-700 rounded py-1 px-3 font-bold w-full uppercase tracking-wider">
                      Lehibeny : {div.chef}
                    </div>
                  </div>
                </ThreeDCard>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Page3D>
  );
}

// ==========================================
// 3. PAGE DIVISIONS
// ==========================================
function Divisions({ portalData }: { portalData: PortalData }) {
  const [selectedDivId, setSelectedDivId] = useState<string>(portalData.divisions[0]?.id || "");

  const activeDiv = portalData.divisions.find((d) => d.id === selectedDivId) || portalData.divisions[0];

  return (
    <Page3D>
      <div className="mx-auto max-w-[95%] px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Rafitra Anaty</h2>
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Ireo sampandraharaha manokana</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            Hahafantatra ny andraikitry ny rantsana tsirairay ao amin'ny tetibola isam-paritra Vatovavy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Navigation Left Sidebar */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Mifidy sampandraharaha</p>
            {portalData.divisions.map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivId(div.id)}
                className={`w-full text-left px-3 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${
                  selectedDivId === div.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="line-clamp-1">{div.name}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            ))}
          </div>

          {/* Division Detail Panel wrapped in interactive 3D card */}
          <div className="md:col-span-8">
            {activeDiv && (
              <ThreeDCard className="rounded-2xl w-full" depth={15}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={activeDiv.chefImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"}
                      alt={activeDiv.chef}
                      className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                    />
                    <div className="space-y-1 text-center sm:text-left flex-grow">
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{activeDiv.name}</h4>
                      <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Mpiandraikitra : {activeDiv.chef}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Description */}
                    <div className="space-y-1">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Andraikitra Ankapobeny</h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">{activeDiv.description}</p>
                    </div>

                    {/* Precise missions */}
                    {activeDiv.missions && activeDiv.missions.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asa sy andraikitra voafaritra tsara</h5>
                        <ul className="space-y-2 text-xs text-slate-600">
                           {activeDiv.missions.map((m, idx) => (
                            <li key={idx} className="flex items-start space-x-2 font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-700 mt-1.5 shrink-0"></span>
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Documents Utiles */}
                    {activeDiv.documentsUtiles && activeDiv.documentsUtiles.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taratasy sy fitaovana ilaina</h5>
                        <div className="space-y-1.5">
                          {activeDiv.documentsUtiles.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{doc.name}</span>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-blue-700 font-bold hover:underline uppercase tracking-wider"
                              >
                                <Download className="h-3.5 w-3.5 mr-1" /> Hampiditra
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contacts de division */}
                    <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Contact division : </span>
                      <span className="font-bold text-slate-700">{activeDiv.contacts}</span>
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            )}
          </div>
        </div>
      </div>
    </Page3D>
  );
}

// ==========================================
// 4. PAGE DOSSIERS (Procedures Checklist)
// ==========================================
function Dossiers({ portalData }: { portalData: PortalData }) {
  const [search, setSearch] = useState("");
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);

  // État de la check-list interactive de pièces fournies (pour aider l'usager)
  const [checkedPieces, setCheckedPieces] = useState<{ [key: string]: boolean }>({});

  const filteredDossiers = portalData.dossiers.filter((dos) => {
    const searchLower = search.toLowerCase();
    return (
      dos.name.toLowerCase().includes(searchLower) ||
      dos.description.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectDossier = (dos: Dossier) => {
    setSelectedDossier(dos);
    setCheckedPieces({}); // Réinitialiser la check-list
  };

  const handleCheckPiece = (piece: string) => {
    setCheckedPieces((prev) => ({ ...prev, [piece]: !prev[piece] }));
  };

  return (
    <Page3D>
      <div className="mx-auto max-w-[95%] px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Dingana Ara-panjakana</h2>
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Fanamarinana ireo taratasy ilaina</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            Mitadiava dingana mifehy ny karama na fisotroan-dronono ary mariho ireo taratasy anananao alohan'ny hitondrana azy any Mananjary.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <input
            id="dossier-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mitady dingana (oh: retraite, solde, fankatoavana)..."
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pl-11 text-xs focus:outline-none focus:border-blue-700 transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List of Dossiers */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Vokatry ny fikarohana</p>
            {filteredDossiers.length === 0 ? (
              <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500 font-bold uppercase">
                Tsy misy dingana mifanaraka amin'ny fikarohanao.
              </div>
            ) : (
              filteredDossiers.map((dos) => (
                <button
                  key={dos.id}
                  onClick={() => handleSelectDossier(dos)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                    selectedDossier?.id === dos.id
                      ? "bg-slate-900 text-white border-slate-800 shadow-md animate-in fade-in duration-150"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs leading-snug line-clamp-2 uppercase tracking-tight">{dos.name}</h4>
                    <p className={`text-[11px] line-clamp-2 mt-1 font-medium ${
                      selectedDossier?.id === dos.id ? "text-slate-300" : "text-slate-500"
                    }`}>
                      {dos.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full pt-2 border-t border-slate-100/10 text-[10px] font-bold uppercase tracking-wider">
                    <span className={selectedDossier?.id === dos.id ? "text-amber-400" : "text-emerald-600"}>
                      Fe-potoana : {dos.delais}
                    </span>
                    <span className={selectedDossier?.id === dos.id ? "text-blue-200" : "text-blue-700"}>
                      Mariho ny taratasinao
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Interactive pieces check-list */}
          <div className="lg:col-span-7">
            {selectedDossier ? (
              <ThreeDCard className="rounded-2xl w-full" depth={15}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded uppercase tracking-wider">
                      Tabilao fanamarinana ho an'ny mpanjifa
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2 uppercase tracking-tight">{selectedDossier.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">{selectedDossier.description}</p>
                  </div>

                  {/* Conditions */}
                  {selectedDossier.conditions && selectedDossier.conditions.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fepetra takiana</h5>
                      <ul className="space-y-1 text-xs text-slate-600 font-semibold">
                        {selectedDossier.conditions.map((c, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <CheckSquare className="h-3.5 w-3.5 text-blue-700 mt-0.5 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* PIECES TO FURNISH WITH INTERACTIVE CHECKS */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Taratasy tsy maintsy ampiarahina
                      </h5>
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
                        {Object.values(checkedPieces).filter(Boolean).length} / {selectedDossier.piecesAFournir.length} vonona
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedDossier.piecesAFournir.map((piece, idx) => {
                        const isChecked = !!checkedPieces[piece];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleCheckPiece(piece)}
                            className={`w-full text-left p-3 rounded-xl border flex items-start space-x-3 transition-all cursor-pointer ${
                              isChecked
                                ? "bg-emerald-50 border-emerald-200 text-emerald-950 font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // Géré par le clic de bouton
                              className="h-4 w-4 mt-0.5 text-emerald-600 rounded-md focus:ring-emerald-500 border-slate-300 pointer-events-none"
                            />
                            <span className="text-xs leading-tight font-semibold">{piece}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instructions post check */}
                  <div className="p-5 bg-slate-900 text-white rounded-xl text-xs space-y-2 border border-slate-800">
                    <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Aiza no hametrahana ny taratasy ?</h5>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Raha voadio sy voamarina avokoa ireo taratasy rehetra ireo, dia ento mivantana any amin'ny biraon'ny SRB Vatovavy ao Mananjary.
                      <br /><strong className="text-white">Birao handraisana azy :</strong> {selectedDossier.responsable}
                      <br /><strong className="text-white">Fe-potoana tombanana :</strong> {selectedDossier.delais} aorian'ny fanamarinana ny taratasy.
                    </p>
                  </div>
                </div>
              </ThreeDCard>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
                <CheckSquare className="h-12 w-12 text-slate-300" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Hamarino ireo taratasy ilaina amin'ny dossier</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-semibold">
                  Mifidiana dingana ara-panjakana iray eo ankavia mba hanehoana ireo taratasy ilaina amin'izany.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Page3D>
  );
}

// ==========================================
// 5. PAGE ACTUALITES
// ==========================================
function Actualites({ portalData }: { portalData: PortalData }) {
  const [selectedActu, setSelectedActu] = useState<Actualite | null>(null);

  return (
    <Page3D>
      <div className="mx-auto max-w-[95%] px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Foibe fampahalalam-baovao</h2>
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Vaovao farany momba ny fitantanana</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            Araho eto ny vaovao momba ny fanavaozana ny tetibola sy ireo fampahafantarana ofisialy ao Vatovavy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portalData.actualites.map((act) => (
            <ThreeDCard key={act.id} className="rounded-2xl" depth={25}>
              <article
                onClick={() => setSelectedActu(act)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={act.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"}
                      alt={act.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      {act.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{act.date}</span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 uppercase tracking-tight">{act.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-semibold">{act.resume}</p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <span className="inline-flex items-center text-xs text-blue-700 font-bold hover:underline uppercase tracking-wider">
                    <span>Hijery ny tohiny</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </article>
            </ThreeDCard>
          ))}
        </div>

        {/* Actualité Full Modal View with 3D entry animation */}
        <AnimatePresence>
          {selectedActu && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay background */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedActu(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
              />

              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative z-10"
              >
                {/* Header image/title wrapper */}
                <div className="relative h-64 sm:h-80 bg-slate-100 overflow-hidden">
                  <img
                    src={selectedActu.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"}
                    alt={selectedActu.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                  <button
                    onClick={() => setSelectedActu(null)}
                    className="absolute top-4 right-4 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Hanidy"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {selectedActu.category}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-white leading-tight uppercase tracking-tight">{selectedActu.title}</h3>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                      <span>Tamin'ny {selectedActu.date}</span>
                      <span>•</span>
                      <span>Nataon'i {selectedActu.author}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 sm:p-8 space-y-4">
                  <p className="text-xs font-bold text-slate-900 leading-relaxed border-l-4 border-blue-700 pl-4 py-1 italic bg-slate-50">
                    {selectedActu.resume}
                  </p>
                  <div className="text-xs text-slate-600 leading-relaxed space-y-4 whitespace-pre-line font-medium">
                    {selectedActu.contenu}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
                  <button
                    onClick={() => setSelectedActu(null)}
                    className="bg-slate-900 text-white text-xs px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                  >
                    Hanidy ny tantara
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Page3D>
  );
}

// ==========================================
// 6. PAGE CONTACT ET FAQ
// ==========================================
function ContactAndFAQ({ portalData }: { portalData: PortalData }) {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // Formulaire de contact
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess("");
    setContactError("");
    setIsSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContactSuccess("Voaray soa aman-tsara ny hafatrao!");
        setContactName("");
        setContactEmail("");
        setContactSubject("");
        setContactMessage("");
      } else {
        setContactError(data.error || "Nisy olana teo amin'ny fandefasana ny hafatra.");
      }
    } catch (err) {
      setContactError("Olana ara-tambajotra. Tsy voalefa ny hafatra.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Page3D>
      <div className="mx-auto max-w-[95%] px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Introduction banner */}
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Fanampiana & Fifandraisana</h2>
          <h3 className="text-3xl font-black text-slate-900 sm:text-4xl uppercase tracking-tight">Fanontaniana matetika & Taratasy fifandraisana</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            Mitadiava valiny ara-dalàna haingana momba ny tetibola na mandefasa hafatra aty aminay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ Left column */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-2">
              <HelpCircle className="h-4 w-4 mr-1.5 text-blue-700" />
              Fanontaniana Matetika
            </h4>

            <div className="space-y-2.5">
              {portalData.faq.map((item, index) => {
                const isOpen = openFAQIndex === index;
                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-xs">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left p-4 flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-tight focus:outline-none hover:bg-slate-50"
                    >
                      <span>{item.question}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 ml-2" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 border-t border-slate-100 text-xs text-slate-500 leading-relaxed font-semibold">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Right column wrapped in 3D card */}
          <div className="lg:col-span-6">
            <ThreeDCard className="rounded-2xl w-full" depth={15}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Send className="h-4 w-4 mr-1.5 text-blue-700" />
                  Hifandray aminay
                </h4>

                {contactSuccess && (
                  <div className="rounded-lg bg-emerald-50 p-3 text-xs font-bold text-emerald-900 border border-emerald-200 uppercase tracking-wide">
                    {contactSuccess}
                  </div>
                )}

                {contactError && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs font-bold text-red-800 border border-red-200 uppercase tracking-wide">
                    {contactError}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1 tracking-wider text-[10px]">Anaranao feno</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 focus:outline-none font-semibold text-slate-900"
                        placeholder="Oh : Randria Rakoto"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1 tracking-wider text-[10px]">E-mail ofisialy</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 focus:outline-none font-semibold text-slate-900"
                        placeholder="nom@exemple.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 tracking-wider text-[10px]">Antom-pifandraisana</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 focus:outline-none font-semibold text-slate-900"
                      placeholder="Oh : Fanazavana momba ny taratasy..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 tracking-wider text-[10px]">Hafatrao</label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 focus:outline-none font-semibold text-slate-900"
                      placeholder="Soraty eto am-panajana ny hafatrao..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-black text-white uppercase tracking-wider shadow-sm hover:bg-slate-800 transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 w-full justify-center sm:w-auto"
                  >
                    <span>{isSending ? "Mandefa..." : "Handefa hafatra"}</span>
                  </button>
                </form>
              </div>
            </ThreeDCard>
          </div>
        </div>

        {/* Styled Location Map of Mananjary with 3D tilt */}
        <ThreeDCard className="rounded-2xl" depth={20}>
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <MapPin className="h-5 w-5 text-blue-700" />
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Ny toerana misy anay ao Mananjary</h4>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Ao amin'ny faritry ny ministera isam-paritra no misy ny birao, 200m miala ny Préfecture administrative ao Mananjary, Madagasikara.
            </p>

            {/* High contrast visual representation of a map */}
            <div className="h-64 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
              {/* Mock Map Streets and markers */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-white border-t border-b border-slate-200 -translate-y-1/2 rotate-12"></div>
              <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white border-l border-r border-slate-200 -rotate-45"></div>
              
              {/* Prefecture label */}
              <div className="absolute top-1/4 left-1/4 bg-white/90 border border-slate-200 text-[9px] font-bold p-1 px-2.5 rounded shadow-xs text-slate-600 uppercase tracking-wider">
                Préfecture Mananjary
              </div>

              {/* Tribunal label */}
              <div className="absolute bottom-1/4 right-1/4 bg-white/90 border border-slate-200 text-[9px] font-bold p-1 px-2.5 rounded shadow-xs text-slate-600 uppercase tracking-wider">
                Fitsarana Ambaratonga Voalohany
              </div>

              {/* SRB Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-1.5 z-10 animate-bounce">
                <div className="h-10 w-10 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-amber-400">
                  <Building className="h-5 w-5" />
                </div>
                <div className="bg-slate-900 text-white text-[9px] font-black py-1 px-3 rounded uppercase tracking-wider shadow-md border border-slate-800">
                  SRB Vatovavy (Mananjary)
                </div>
              </div>
            </div>
          </section>
        </ThreeDCard>
      </div>
    </Page3D>
  );
}
