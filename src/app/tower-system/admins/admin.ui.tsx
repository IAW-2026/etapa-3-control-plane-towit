import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { AdminRecord } from "./admin.types";

export const ADMIN_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes primero", value: "created_desc" },
	{ label: "Más antiguos primero", value: "created_asc" },
	{ label: "Nombre (A-Z)", value: "name_asc" },
	{ label: "Nombre (Z-A)", value: "name_desc" },
];

export const ADMIN_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos", value: "ALL" },
	{ label: "Activos", value: "ACTIVE" },
	{ label: "Desactivados", value: "DEACTIVATED" },
];

export const getAdminFields = (): FieldDef<AdminRecord>[] => [
	{
		label: "Nombre Completo",
		cell: (row) => <span className="font-semibold text-slate-900">{row.full_name}</span>,
		isPrimary: true
	},
	{
		label: "Email",
		accessorKey: "email",
		fullWidth: true
	},
	{
		label: "Estado",
		cell: (row) => {
			const isActive = !row.deactivated;
			const style = isActive 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                : 'bg-rose-100 text-rose-800 border-rose-200';
			return <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>
                {isActive ? 'Activo' : 'Desactivado'}
            </span>;
		}
	},
	{
		label: "Clerk ID",
		cell: (row) => <span className="font-mono text-xs text-slate-500" title={row.clerk_id}>{row.clerk_id.substring(0, 12)}...</span>
	},
	{
		label: "Creado",
		cell: (row) => (
			<time suppressHydrationWarning className="text-slate-600">
				{new Date(row.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
			</time>
		)
	}
];
