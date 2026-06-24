import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { VehicleRecord } from "./vehicle.types";

export const VEHICLE_SORT_OPTIONS: ControlOption[] = [
	{ label: "Marca A-Z", value: "brand_asc" },
	{ label: "Marca Z-A", value: "brand_desc" },
	{ label: "Año descendente", value: "year_desc" },
	{ label: "Año ascendente", value: "year_asc" },
];

export const getVehicleFields = (): FieldDef<VehicleRecord>[] => [
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
		cell: (row) => <span className="text-slate-600 font-semibold">{row.weight} t</span>,
	},
	{
		label: "Cliente",
		accessorKey: "customerName",
		fullWidth: true,
	},
];
