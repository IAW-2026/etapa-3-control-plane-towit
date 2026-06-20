"use client";

import React from "react";
import SearchBar from "./SearchBar";
import Dropdown from "./Dropdown";

// 1. Definimos el contrato estándar para las opciones de los dropdowns
export interface ControlOption {
    label: string;
    value: string;
}

// 2. Hacemos las props completamente agnósticas
interface ResourceControlBarProps {
    // Buscador
    searchPlaceholder?: string;
    
    // Opciones de filtrado (Ej: estados, roles, categorías)
    filterOptions?: ControlOption[];
    filterParamKey?: string; // Por defecto 'status', pero permite sobreescribirse
    filterPlaceholder?: string;

    // Opciones de ordenamiento
    sortOptions?: ControlOption[];
    sortParamKey?: string; // Por defecto 'sort', pero permite sobreescribirse
    sortPlaceholder?: string;
}

export default function ResourceControlBar({
    searchPlaceholder = "Buscar...",
    filterOptions = [],
    filterParamKey = "status",
    filterPlaceholder = "Filtrar...",
    sortOptions = [],
    sortParamKey = "sort",
    sortPlaceholder = "Ordenar por..."
}: ResourceControlBarProps) {
    
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
            
            {/* 1. BUSCADOR (Se expande para ocupar el espacio disponible) */}
            <div className="w-full md:flex-1">
                <SearchBar placeholder={searchPlaceholder} />
            </div>

            {/* CONTROLES DE FILTRADO Y ORDENAMIENTO */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                
                {/* 2. FILTRADO (Renderizado condicional seguro) */}
                {filterOptions.length > 0 && (
                    <div className="w-full sm:w-48">
                        <Dropdown 
                            mode="filter"
                            paramKey={filterParamKey}
                            placeholder={filterPlaceholder}
                            options={filterOptions}
                            icon={
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            }
                        />
                    </div>
                )}

                {/* 3. ORDENAMIENTO (Renderizado condicional seguro) */}
                {sortOptions.length > 0 && (
                    <div className="w-full sm:w-56">
                        <Dropdown 
                            mode="sort"
                            paramKey={sortParamKey}
                            placeholder={sortPlaceholder}
                            options={sortOptions}
                            icon={
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}