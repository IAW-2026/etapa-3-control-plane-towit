import Link from "next/link";
import React from "react";

export default function HeaderLogo() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-3 group focus:outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    >
      {/* ÍCONO: Siempre visible. El SVG ya tiene su propio círculo */}
      <img src="/TowitLogo.svg" alt="TowIt" className="w-10 h-10 min-w-[40px] group-hover:scale-105 transition-all duration-200" />
      
      {/* TEXTO: hidden (oculto en móvil) y sm:block (visible desde tablets en adelante) */}
      <div className="hidden sm:block leading-tight">
        <div className="text-lg font-semibold text-slate-900 tracking-tight transition-colors group-hover:text-slate-700">
          TowIt <span className="text-slate-500 font-medium">Control Plane</span>
        </div>
      </div>
    </Link>
  );
}