'use client'

import React, { useState } from "react";
import MessageModal, { MessageModalType } from "@/component/MessageModal";
import DataCard from "./DataCard";


// --- TIPOS GENÉRICOS ---
export type FieldDef<T> = {
  label: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  isPrimary?: boolean;  
  fullWidth?: boolean;  
  hrefTemplate?: string; 
};

export type ActionDef = {
  label: string;
  variant?: "primary" | "danger" | "warning"; 
  requireSelection?: boolean;
  onAction: (selectedIds: string[]) => Promise<{ success: boolean; message?: string } | null>;
};

interface CardDataViewProps<T> {
  data: T[];
  fields: FieldDef<T>[];
  actions?: ActionDef[];
  keyExtractor: (row: T) => string;
  title?: string;
}

// COMPONENTE PRINCIPAL 
export default function CardDataView<T>({ data, fields, actions = [], keyExtractor, title }: CardDataViewProps<T>) {
  const hasActions = actions.length > 0;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <DataToolbar selectedIds={selectedIds} actions={actions} title={title} />

      <DataGrid 
        data={data} 
        fields={fields} 
        keyExtractor={keyExtractor} 
        selectedIds={hasActions ? selectedIds : undefined}
        onSelectRow={hasActions ? toggleSelection : undefined}
      />
    </div>
  );
}

// --- SUB-COMPONENTE: TOOLBAR ---
function DataToolbar({ selectedIds, actions, title }: { selectedIds: Set<string>, actions: ActionDef[], title?: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [modalState, setModalState] = useState<{ 
    isOpen: boolean; 
    type: MessageModalType; 
    title: string; 
    message: string 
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  const handleActionClick = async (action: ActionDef) => {
    if (action.requireSelection && selectedIds.size === 0) return;
    
    setIsProcessing(true);
    
    const selectedArray = Array.from(selectedIds);
    const result = await action.onAction(selectedArray);
    
    setIsProcessing(false);

    if (!result) return;

    setModalState({
      isOpen: true,
      type: result.success ? 'success' : 'error',
      title: result.success ? 'Operación Exitosa' : 'Atención',
      message: result.message || (result.success ? 'La operación se procesó correctamente.' : 'No se pudo completar la operación.')
    });
  };

  const hasSelection = selectedIds.size > 0;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:px-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title || "Registros"}</h2>
        {hasSelection && (
          <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
            {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
        {actions.map((action, idx) => {
          const isDisabled = (action.requireSelection && !hasSelection) || isProcessing;
          
          const baseStyles = "w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
          const colorStyles = action.variant === "danger" 
            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 focus:ring-rose-500"
            : action.variant === "warning"
            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 focus:ring-amber-500"
            : "bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent focus:ring-indigo-500";

          return (
            <button key={idx} onClick={() => handleActionClick(action)} disabled={isDisabled} className={`${baseStyles} ${colorStyles}`}>
              {isProcessing && hasSelection ? `Procesando (${selectedIds.size})...` : action.label}
            </button>
          );
        })}
      </div>

      <MessageModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        showBlur={true}
        onClose={closeModal}
      />
    </div>
  );
}

// --- SUB-COMPONENTE: GRID DE TARJETAS ---
function DataGrid<T>({ data, fields, keyExtractor, selectedIds, onSelectRow }: 
  { data: T[], fields: FieldDef<T>[], keyExtractor: (row: T) => string, selectedIds?: Set<string>, onSelectRow?: (id: string) => void }) {
  
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <p className="text-slate-500 text-sm">No hay registros disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.map((row) => {
        const rowId = keyExtractor(row);
        
        return (
          <DataCard 
            key={rowId}
            item={row}
            fields={fields}
            isSelected={selectedIds?.has(rowId)}
            onToggle={onSelectRow ? () => onSelectRow(rowId) : undefined}
          />
        );
      })}
    </div>
  );
}
