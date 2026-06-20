import React from 'react';
import Link from 'next/link'; // Importante para Next.js
import { FieldDef } from './CardDataView';

interface DataCardProps<T> {
  item: T;
  fields: FieldDef<T>[];
  isSelected: boolean;
  onToggle: () => void;
}

export default function DataCard<T>({ item, fields, isSelected, onToggle }: DataCardProps<T>) {
  return (
    <div 
      onClick={onToggle}
      className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'bg-indigo-50/40 border-indigo-500 ring-1 ring-indigo-500 shadow-md' 
          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      {/* Indicador visual de selección en la esquina */}
      <div className="absolute top-5 right-5">
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-3 pr-8">
        {fields.map((field, idx) => {
          const isPrimary = field.isPrimary;
          const isFullWidth = field.fullWidth || isPrimary;
          
          // 1. Calculamos el contenido base (ya sea custom o el valor directo)
          let content = field.cell ? field.cell(item) : String(item[field.accessorKey as keyof T] ?? 'N/A');

          // 2. Si el campo definió un template, resolvemos la URL y envolvemos el contenido
          if (field.hrefTemplate) {
            // Busca cualquier texto entre llaves {key} y lo reemplaza por item[key]
            const resolvedHref = field.hrefTemplate.replace(/{(\w+)}/g, (_, key) => {
              return String(item[key as keyof T] ?? '');
            });

            content = (
              <Link 
                href={resolvedHref}
                // Evita que al hacer click en el link, se seleccione la tarjeta
                onClick={(e) => e.stopPropagation()} 
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors inline-block w-fit"
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={idx} className={`flex flex-col gap-1 ${isFullWidth ? 'col-span-2' : 'col-span-1'}`}>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {field.label}
              </span>
              <div className={`text-sm break-words ${isPrimary ? 'text-lg font-bold text-slate-900' : 'text-slate-700 font-medium'}`}>
                {content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}