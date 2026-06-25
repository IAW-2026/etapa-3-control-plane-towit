import { FieldDef } from "@/component/CardDataView";
import { AssignmentRecord } from "./assignment.types";

export const getAssignmentFields = (): FieldDef<AssignmentRecord>[] => [
	{
		label: "ID de Asignación",
		accessorKey: "assignment_id",
		isPrimary: true,
	},
	{
		label: "ID de Viaje",
		accessorKey: "trip_id",
	},
	{
		label: "ID de Tower",
		accessorKey: "tower_id",
	},
	{
		label: "Estado",
		accessorKey: "status",
	},
	{
		label: "Origen",
		accessorKey: "origin",
	},
	{
		label: "Destino",
		accessorKey: "destination",
	},
	{
		label: "Ubicación (Lat, Long)",
		cell: (row) => `${row.location?.lat || 'N/A'}, ${row.location?.long || 'N/A'}`,
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

export const ASSIGNMENT_SORT_OPTIONS = [
	{ value: "created_desc", label: "Más recientes primero" },
	{ value: "created_asc", label: "Más antiguos primero" }
];

export const ASSIGNMENT_FILTER_OPTIONS = [
	{ value: "ALL", label: "Todos los estados" },
	{ value: "ACTIVE", label: "Solo activos" },
	{ value: "DEACTIVATED", label: "Solo desactivados" },
	{ value: "COMPLETED", label: "Completados" },
	{ value: "ACCEPTED", label: "Aceptados" }
];
