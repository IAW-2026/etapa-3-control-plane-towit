'use client'

import React, { useState } from "react";
import MessageModal, { MessageModalType } from "@/component/MessageModal";
import DataCard from "./DataCard";


// --- TIPOS GENÉRICOS ---
export type FieldDef<T> = {
  label: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  isPrimary?: boolean;  // Destaca este campo como el título principal de la tarjeta
  fullWidth?: boolean;  // Obliga a que el campo ocupe todo el ancho (ideal para IDs largos o Fechas)
};

export type ActionDef = {
  label: string;
  variant?: "primary" | "danger" | "warning"; 
  requireSelection?: boolean;
  onAction: (selectedId: string | null) => Promise<{ success: boolean; message?: string }>;
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggleSelection = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <DataToolbar selectedId={selectedId} actions={actions} title={title} />

      <DataGrid 
        data={data} 
        fields={fields} 
        keyExtractor={keyExtractor} 
        selectedId={selectedId}
        onSelectRow={toggleSelection}
      />
    </div>
  );
}

// --- SUB-COMPONENTE: TOOLBAR (Misma lógica, reusabilidad pura) ---
function DataToolbar({ selectedId, actions, title }: { selectedId: string | null, actions: ActionDef[], title?: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 1. Tipamos el estado usando exactamente los tipos de tu MessageModal
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
    if (action.requireSelection && !selectedId) return;
    
    setIsProcessing(true);
    
    // 2. Ejecutamos la acción, que nos devuelve { success, message }
    const result = await action.onAction(selectedId);
    
    setIsProcessing(false);

    // 3. Mapeamos automáticamente el booleano 'success' al tipo visual del Modal
    setModalState({
      isOpen: true,
      type: result.success ? 'success' : 'error',
      title: result.success ? 'Operación Exitosa' : 'Atención',
      // Si el backend (o la acción) mandó un mensaje custom, lo usamos. Si no, usamos uno por defecto.
      message: result.message || (result.success ? 'La operación se procesó correctamente.' : 'No se pudo completar la operación.')
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:px-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title || "Registros"}</h2>
      
      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
        {actions.map((action, idx) => {
          const isDisabled = (action.requireSelection && !selectedId) || isProcessing;
          
          const baseStyles = "w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
          const colorStyles = action.variant === "danger" 
            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 focus:ring-rose-500"
            : action.variant === "warning"
            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 focus:ring-amber-500"
            : "bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent focus:ring-indigo-500";

          return (
            <button key={idx} onClick={() => handleActionClick(action)} disabled={isDisabled} className={`${baseStyles} ${colorStyles}`}>
              {isProcessing && selectedId ? "Procesando..." : action.label}
            </button>
          );
        })}
      </div>

      {/* 4. Renderizamos tu MessageModal usando la nueva prop showBlur */}
      <MessageModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        showBlur={true} // Agregado para aprovechar la nueva funcionalidad visual que hiciste
        onClose={closeModal}
      />
    </div>
  );
}

// --- SUB-COMPONENTE: GRID DE TARJETAS ---
function DataGrid<T>({ data, fields, keyExtractor, selectedId, onSelectRow }: 
  { data: T[], fields: FieldDef<T>[], keyExtractor: (row: T) => string, selectedId: string | null, onSelectRow: (id: string) => void }) {
  
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
          // 👇 Aquí está la magia de la refactorización
          <DataCard 
            key={rowId}
            item={row}
            fields={fields}
            isSelected={selectedId === rowId}
            onToggle={() => onSelectRow(rowId)}
          />
        );
      })}
    </div>
  );
}