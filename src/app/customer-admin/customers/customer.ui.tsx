import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { CustomerRecord } from "./customer.types";

export const CUSTOMER_SORT_OPTIONS: ControlOption[] = [
	{ label: "Nombre A-Z", value: "name_asc" },
	{ label: "Nombre Z-A", value: "name_desc" },
	{ label: "Más recientes", value: "created_desc" },
	{ label: "Más antiguos", value: "created_asc" },
];

export const CUSTOMER_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos", value: "ALL" },
	{ label: "Activos", value: "ACTIVE" },
	{ label: "Inactivos", value: "INACTIVE" },
];

export const getCustomerFields = (): FieldDef<CustomerRecord>[] => [
	{
		label: "Nombre",
		accessorKey: "fullName",
		isPrimary: true,
	},
	{
		label: "ID Clerk",
		cell: (row) => (
			<span className="font-mono text-xs text-slate-500 break-all" title={row.clerkId}>
				{row.clerkId}
			</span>
		),
		fullWidth: true,
	},
	
	{
		label: "Fecha registro",
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
];
