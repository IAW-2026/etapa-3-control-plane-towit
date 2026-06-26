"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  label: string;
  href: string;
  colorClass?: string;
}

interface DropdownProps {
  icon?: React.ReactNode;
  title?: string;
  items: DropdownItem[];
}

export default function Dropdown({ icon, title, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 p-2 rounded-xl transition-colors focus:outline-none"
        title={title}
      >
        {icon && <span className="flex items-center justify-center w-5 h-5">{icon}</span>}
        {title && <span className="hidden xl:block">{title}</span>}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`absolute top-full left-1/2 -translate-x-[66%] pt-2 w-48 z-50 transition-all duration-200 origin-top ${isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"}`}>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col p-1.5">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2.5"
            >
              {item.colorClass && (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.colorClass}`}></span>
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}