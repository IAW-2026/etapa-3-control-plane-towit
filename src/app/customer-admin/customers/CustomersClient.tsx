'use client'

import React from "react";
import CardDataView, { FieldDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";

const CUSTOMER_SORT_OPTIONS: ControlOption[] = [
  { label: "Nombre A-Z", value: "name_asc" },
  { label: "Nombre Z-A", value: "name_desc" },
  { label: "Más recientes", value: "created_desc" },
  { label: "Más antiguos", value: "created_asc" },
];

const CUSTOMER_FILTER_OPTIONS: ControlOption[] = [
  { label: "Todos", value: "ALL" },
  { label: "Activos", value: "ACTIVE" },
  { label: "Inactivos", value: "INACTIVE" },
];

export interface CustomerRecord {
  customerId: number;
  clerkId: string;
  fullName: string;
  isActive: boolean;
  createdAt?: string;
}

interface CustomersClientProps {
  data: CustomerRecord[];
}

export default function CustomersClient({ data }: CustomersClientProps) {
  const fields: FieldDef<CustomerRecord>[] = [
    {
      label: "Nombre",
      accessorKey: "fullName",
      isPrimary: true,
    },
    {
      label: "ID Clerk",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-500" title={row.clerkId}>
          {row.clerkId.slice(0, 12)}...
        </span>
      ),
    },
    {
      label: "Estado",
      cell: (row) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
          row.isActive
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
            : 'bg-rose-100 text-rose-800 border-rose-200'
        }`}>
          {row.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      label: "Registrado",
      cell: (row) => (
        row.createdAt
          ? <time suppressHydrationWarning className="text-slate-600">
              {new Date(row.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit', month: 'short', year: 'numeric'
              })}
            </time>
          : <span className="text-slate-300">—</span>
      ),
    },
  ];

  return (
    <div>
      <ResourceControlBar
        searchPlaceholder="Buscar por nombre..."
        sortOptions={CUSTOMER_SORT_OPTIONS}
        filterOptions={CUSTOMER_FILTER_OPTIONS}
        filterPlaceholder="Filtrar por estado"
        filterParamKey="status"
      />

      <CardDataView
        title="Clientes Registrados"
        data={data}
        fields={fields}
        keyExtractor={(row) => String(row.customerId)}
      />
    </div>
  );
}
