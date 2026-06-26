"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

interface Option {
    label: string;
    value: string;
}

interface DropdownProps {
    paramKey: string;
    mode: "filter" | "sort";
    options: Option[];
    placeholder: string;
    icon?: React.ReactNode;
}

export default function Dropdown({ paramKey, mode, options, placeholder, icon }: DropdownProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentValue = searchParams.get(paramKey) || "";
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = currentValue
        ? options.find((o) => o.value === currentValue)?.label || currentValue
        : null;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setIsOpen(false);

        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set(paramKey, value);
        } else {
            params.delete(paramKey);
        }

        if (mode === "filter" || mode === "sort") {
            params.delete("page");
        }

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-full flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-left transition-all shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                    selectedLabel ? 'text-slate-700' : 'text-slate-400'
                }`}
            >
                {icon && (
                    <span className="shrink-0 text-slate-400">{icon}</span>
                )}
                <span className="flex-1 truncate">{selectedLabel || placeholder}</span>
                <svg className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-400 rounded-xl shadow-lg overflow-hidden">
                    <button
                        onClick={() => handleSelect("")}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 cursor-pointer ${
                            !currentValue ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-500'
                        }`}
                    >
                        {placeholder}
                    </button>
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 cursor-pointer ${
                                currentValue === opt.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
