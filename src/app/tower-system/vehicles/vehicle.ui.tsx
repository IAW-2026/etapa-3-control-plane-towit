import { FieldDef } from "@/component/CardDataView";
import { VehicleRecord } from "./vehicle.types";

export const getVehicleFields = (): FieldDef<VehicleRecord>[] => [
	{
		label: "ID de Vehículo",
		accessorKey: "vehicle_id",
		isPrimary: true,
	},
	{
		label: "ID de Tower",
		accessorKey: "tower_id",
	},
	{
		label: "Clerk ID (Tower)",
		cell: (row) => <span className="font-mono text-xs text-slate-500" title={row.clerk_id}>{row.clerk_id ? row.clerk_id.substring(0, 12) + '...' : 'N/A'}</span>
	},
	{
		label: "Marca",
		accessorKey: "brand",
	},
	{
		label: "Modelo",
		accessorKey: "model",
	},
	{
		label: "Año",
		accessorKey: "year",
	},
	{
		label: "Carga Máxima (kg)",
		accessorKey: "max_load",
	},
	{
		label: "Estado Activo",
		cell: (row) => (
			<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.deactivated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
				{row.deactivated ? 'Desactivado' : 'Activo'}
			</span>
		)
	},
];

export const VEHICLE_SORT_OPTIONS = [
	{ value: "created_desc", label: "Más recientes primero" },
	{ value: "created_asc", label: "Más antiguos primero" },
	{ value: "brand_asc", label: "Marca (A-Z)" },
	{ value: "brand_desc", label: "Marca (Z-A)" },
	{ value: "year_desc", label: "Más nuevos (año)" },
	{ value: "year_asc", label: "Más antiguos (año)" }
];

export const VEHICLE_FILTER_OPTIONS = [
	{ value: "ALL", label: "Todos los estados" },
	{ value: "ACTIVE", label: "Solo activos" },
	{ value: "DEACTIVATED", label: "Solo desactivados" }
];
