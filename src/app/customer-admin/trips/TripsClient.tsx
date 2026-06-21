'use client'

import React from "react";
import CardDataView, { FieldDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";

const TRIP_SORT_OPTIONS: ControlOption[] = [
  { label: "Más recientes", value: "date_desc" },
  { label: "Más antiguos", value: "date_asc" },
];

const TRIP_FILTER_OPTIONS: ControlOption[] = [
  { label: "Todos los estados", value: "ALL" },
  { label: "Completado", value: "COMPLETED" },
  { label: "Pendiente", value: "PENDING" },
  { label: "Cancelado", value: "CANCELLED" },
];

export interface TripRecord {
  tripId: number;
  customerId: number;
  customerName: string;
  vehicleId: number;
  originChar: string;
  destinationChar: string;
  date: string;
  time: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | string;
}

interface TripsClientProps {
  data: TripRecord[];
}

export default function TripsClient({ data }: TripsClientProps) {
  const fields: FieldDef<TripRecord>[] = [
    {
      label: "ID Viaje",
      cell: (row) => <span className="font-mono text-sm text-slate-700">#{row.tripId}</span>,
      isPrimary: true,
    },
    {
      label: "Cliente",
      accessorKey: "customerName",
    },
    {
      label: "Origen",
      cell: (row) => (
        <span className="text-xs text-slate-500 truncate block max-w-[180px]" title={row.originChar}>
          {row.originChar}
        </span>
      ),
      fullWidth: true,
    },
    {
      label: "Destino",
      cell: (row) => (
        <span className="text-xs text-slate-500 truncate block max-w-[180px]" title={row.destinationChar}>
          {row.destinationChar}
        </span>
      ),
      fullWidth: true,
    },
    {
      label: "Estado",
      cell: (row) => {
        const statusStyles: Record<string, string> = {
          'COMPLETED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
          'PENDING': 'bg-amber-100 text-amber-800 border-amber-200',
          'CANCELLED': 'bg-rose-100 text-rose-800 border-rose-200',
        };
        const style = statusStyles[row.status] || 'bg-slate-100 text-slate-800 border-slate-200';

        return (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      label: "Fecha",
      cell: (row) => (
        <time suppressHydrationWarning className="text-slate-600 text-xs">
          {row.date} {row.time}
        </time>
      ),
    },
  ];

  return (
    <div>
      <ResourceControlBar
        searchPlaceholder="Buscar por ID, cliente, origen o destino..."
        sortOptions={TRIP_SORT_OPTIONS}
        filterOptions={TRIP_FILTER_OPTIONS}
        filterPlaceholder="Filtrar por estado"
        filterParamKey="status"
      />

      <CardDataView
        title="Viajes Solicitados"
        data={data}
        fields={fields}
        keyExtractor={(row) => String(row.tripId)}
      />
    </div>
  );
}
