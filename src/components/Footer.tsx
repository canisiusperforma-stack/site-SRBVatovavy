import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { Settings } from "../types";

interface FooterProps {
  settings: Settings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500">
      {/* Upper footer with full details but matching Sleek theme */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 border-b border-slate-100 pb-10">
          {/* Column 1: Ministry Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo-mef.jpg"
                alt="Logo MEF"
                referrerPolicy="no-referrer"
                className="h-10 w-10 object-contain rounded-full bg-white shadow-xs border border-slate-200 p-0.5"
              />
              <div>
                <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase">
                  SRB Vatovavy
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sampandraharaham-paritry ny Tetibola • DGB
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Sampana mitsinjara latsaka amin'ny Fitantanana ankapobeny ny Tetibola (DGB), eo ambany fiahian'ny Ministeran'ny Fitantanam-bola sy ny Tokarena (MEF). Mitantana amin'ny fomba madio, hentitra ary mangarahara ny volam-panjakana ao Vatovavy.
            </p>
            <div className="pt-1">
              <a
                href="https://www.mef.gov.mg"
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs font-bold text-blue-700 hover:underline"
              >
                <span>mef.gov.mg (Tranonkala MEF)</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Fikarohana haingana
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <ul className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <li>
                    <Link to="/" className="hover:text-blue-700 transition-colors">Fandraisana</Link>
                  </li>
                  <li>
                    <Link to="/a-propos" className="hover:text-blue-700 transition-colors">Mombamomba ny SRB</Link>
                  </li>
                  <li>
                    <Link to="/divisions" className="hover:text-blue-700 transition-colors">Sampandraharaha</Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <li>
                    <Link to="/dossiers" className="hover:text-blue-700 transition-colors">Paikady</Link>
                  </li>
                  <li>
                    <Link to="/actualites" className="hover:text-blue-700 transition-colors">Vaovao</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-blue-700 transition-colors">Fanontaniana & Fifandraisana</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-4 text-xs text-slate-500 font-medium">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Fifandraisana Ofisialy
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <span>{settings.contactAddress}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-700 shrink-0" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-700 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:underline hover:text-blue-700">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <span>{settings.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower footer with exact Sleek layout design */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] font-medium text-slate-500 gap-4">
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
            <span>&copy; {currentYear} SRB VATOVAVY — Fitantanana ankapobeny ny Tetibola</span>
            <a href="https://www.mef.gov.mg" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 uppercase font-semibold">Fepetra ara-dalàna</a>
          </div>
          <div className="flex items-center gap-4">
            <span>Mananjary, Madagascar</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span>Tél : {settings.contactPhone}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
