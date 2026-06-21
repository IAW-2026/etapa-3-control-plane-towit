'use client'

import React from "react";
import CardDataView, { FieldDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";

const VEHICLE_SORT_OPTIONS: ControlOption[] = [
  { label: "Marca A-Z", value: "brand_asc" },
  { label: "Marca Z-A", value: "brand_desc" },
  { label: "Año descendente", value: "year_desc" },
  { label: "Año ascendente", value: "year_asc" },
];

export interface VehicleRecord {
  vehicleId: number;
  customerId: number;
  customerName: string;
  brand: string;
  model: string;
  year: number;
  weight: number;
}

interface VehiclesClientProps {
  data: VehicleRecord[];
}

export default function VehiclesClient({ data }: VehiclesClientProps) {
  const fields: FieldDef<VehicleRecord>[] = [
    {
      label: "Vehículo",
      cell: (row) => (
        <span className="text-slate-800 font-medium">{row.brand} {row.model}</span>
      ),
      isPrimary: true,
    },
    {
      label: "Año",
      accessorKey: "year",
    },
    {
      label: "Peso (ton)",
      cell: (row) => <span className="text-slate-600">{row.weight} t</span>,
    },
    {
      label: "Cliente",
      accessorKey: "customerName",
      fullWidth: true,
    },
  ];

  return (
    <div>
      <ResourceControlBar
        searchPlaceholder="Buscar por marca, modelo, año o cliente..."
        sortOptions={VEHICLE_SORT_OPTIONS}
      />

      <CardDataView
        title="Vehículos Registrados"
        data={data}
        fields={fields}
        keyExtractor={(row) => String(row.vehicleId)}
      />
    </div>
  );
}
