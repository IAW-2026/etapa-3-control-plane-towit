import Link from "next/link";
import React from "react";

export default function HeaderLogo() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-3 group focus:outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    >
      {/* ÍCONO: Siempre visible. Mantiene un tamaño fijo para no deformarse */}
      <div className="w-10 h-10 min-w-[40px] rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
        CP
      </div>
      
      {/* TEXTO: hidden (oculto en móvil) y sm:block (visible desde tablets en adelante) */}
      <div className="hidden sm:block leading-tight">
        <div className="text-lg font-semibold text-slate-900 tracking-tight transition-colors group-hover:text-slate-700">
          TowIt <span className="text-slate-500 font-medium">Control Plane</span>
        </div>
      </div>
    </Link>
  );
}