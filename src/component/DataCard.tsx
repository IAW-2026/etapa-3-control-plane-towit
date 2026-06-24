import React from 'react';
import Link from 'next/link';
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
      {/* Indicador visual de selección - checkbox */}
      <div className="absolute top-5 right-5">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
        }`}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-3 pr-8">
        {fields.map((field, idx) => {
          const isPrimary = field.isPrimary;
          const isFullWidth = field.fullWidth || isPrimary;
          
          let content = field.cell ? field.cell(item) : String(item[field.accessorKey as keyof T] ?? 'N/A');

          if (field.hrefTemplate) {
            const resolvedHref = field.hrefTemplate.replace(/{(\w+)}/g, (_, key) => {
              return String(item[key as keyof T] ?? '');
            });

            content = (
              <Link 
                href={resolvedHref}
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
