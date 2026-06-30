import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldAlert, CheckCircle, UserCheck, LogOut } from "lucide-react";
import { User } from "../types";
import { motion } from "motion/react";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export default function Navbar({ user, onLogout, onOpenLogin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Fandraisana", path: "/" },
    { name: "Mombamomba ny SRB", path: "/a-propos" },
    { name: "Sampandraharaha", path: "/divisions" },
    { name: "Torolalana", path: "/dossiers" },
    { name: "Vaovao", path: "/actualites" },
    { name: "Fanontaniana sy Fifandraisana", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      {/* Madagascar flag accent bar from the Sleek Interface design */}
      <div className="h-1.5 w-full flex">
        <div className="bg-[#e11d48] w-1/3"></div>
        <div className="bg-white w-1/3"></div>
        <div className="bg-[#059669] w-1/3"></div>
      </div>

      {/* Top bar with government labels - enlarged and highly visible, with elegant 3D hover effects */}
     <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 border-b border-emerald-800 px-3 py-6 sm:py-9 md:py-11 text-xs sm:text-sm md:text-[15px] text-white shadow-xl relative z-10 overflow-hidden">
        {/* Subtle background animated gradient flare to enhance the 3D depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(52,211,153,0.08),transparent_50%)] animate-pulse pointer-events-none" />
        
        <div className="mx-auto flex max-w-[95%] flex-wrap items-center justify-between gap-6 relative z-10">
          {/* Image gauche - MEF */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.03, rotateY: 5, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            style={{ perspective: 1000 }}
          >
            <img
              src="/MEF_Madagascar_2024.png"
              alt="Logo MEF"
              className="h-16 sm:h-22 md:h-26 lg:h-30 w-auto object-contain drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]"
            />
          </motion.div>

          {/* Image centrale - Sceau République */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <img
              src="/sceau-republique.svg"
              alt="Sceau de la République"
              className="h-20 sm:h-26 md:h-30 lg:h-34 w-auto object-contain drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)]"
            />
          </motion.div>

          {/* Image droite - DGBF */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.03, rotateY: -5, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            style={{ perspective: 1000 }}
          >
            <img
              src="/dgbf.jpg"
              alt="Logo DGBF"
              referrerPolicy="no-referrer"
              className="h-16 sm:h-22 md:h-26 lg:h-30 w-auto object-contain drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="mx-auto max-w-[95%] px-2 sm:px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Branding */}
          <Link id="nav-brand" to="/" className="flex items-center space-x-3 py-2">
            <img
              src="/logo-mef.jpg"
              alt="Logo MEF / DGCF"
              referrerPolicy="no-referrer"
              className="h-12 w-12 object-contain rounded bg-white shadow-xs border border-slate-200 p-0.5"
            />
            <div>
              <h1 className="text-base font-extrabold leading-tight text-slate-900 sm:text-lg uppercase tracking-tight">
                Sampandraharaham-paritry ny Tetibola
              </h1>
              <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                <span>Faritra Vatovavy</span>
                <span className="text-slate-300">—</span>
                <span className="text-blue-700">Madagasikara</span>
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={link.name}
                to={link.path}
                className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  isActive(link.path)
                    ? "border-blue-700 text-blue-700"
                    : "border-transparent text-slate-600 hover:text-blue-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                    <UserCheck className="h-3 w-3 inline text-blue-700" />
                    <span>{user.fullName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">
                    {user.role}
                  </div>
                </div>
                <Link
                  id="nav-admin-dash"
                  to="/admin"
                  className="bg-blue-700 text-white hover:bg-blue-800 text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm"
                >
                  Sehatra fanaraha-maso
                </Link>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-md transition-colors"
                  title="Hivoaka"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer uppercase tracking-wider"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Sehatry ny Admin</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            {user && (
              <Link
                to="/admin"
                className="bg-emerald-700 text-white p-1.5 rounded-md text-xs font-semibold"
                title="Tabilao fanaraha-maso"
              >
                Sehatra fanaraha-maso
              </Link>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-sky-950 hover:bg-gray-100 transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white py-3 px-4 shadow-inner space-y-1">
          {navLinks.map((link) => (
            <Link
              id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-semibold transition-all ${
                isActive(link.path)
                  ? "bg-sky-50 text-sky-950 border-l-4 border-sky-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-sky-950"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {user ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                <p className="text-sm font-bold text-emerald-950">{user.fullName}</p>
                <p className="text-xs text-emerald-700 font-semibold mb-2">{user.role}</p>
                <div className="flex space-x-2">
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center bg-emerald-700 text-white text-xs py-2 rounded-md font-bold"
                  >
                    Tabilao fanaraha-maso
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded-md font-bold"
                  >
                    Hivoaka
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="mobile-login-btn"
                onClick={() => {
                  onOpenLogin();
                  setIsOpen(false);
                }}
                className="w-full inline-flex items-center justify-center space-x-1.5 rounded-lg bg-sky-900 py-3 text-sm font-bold text-white hover:bg-sky-950 transition-all"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Hiditra amin'ny Fitantanana</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
