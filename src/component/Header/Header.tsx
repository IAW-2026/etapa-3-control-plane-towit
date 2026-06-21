'use client'

import React from "react";
import HeaderLogo from "./HeaderLogo";
import HeaderUserSection from "./HeaderUserSection";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <HeaderLogo />
        <HeaderUserSection />
      </div>
    </header>
  );
}
