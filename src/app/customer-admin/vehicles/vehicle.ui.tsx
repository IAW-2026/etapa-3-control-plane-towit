import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { VehicleRecord } from "./vehicle.types";

export const VEHICLE_SORT_OPTIONS: ControlOption[] = [
	{ label: "Vehículo A-Z", value: "name-asc" },
	{ label: "Vehículo Z-A", value: "name-desc" },
	{ label: "Año ascendente", value: "year-asc" },
	{ label: "Año descendente", value: "year-desc" },
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
