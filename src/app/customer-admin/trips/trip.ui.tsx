import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { TripRecord } from "./trip.types";

export const TRIP_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes", value: "date_desc" },
	{ label: "Más antiguos", value: "date_asc" },
];

export const TRIP_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos los estados", value: "ALL" },
	{ label: "Completado", value: "COMPLETED" },
	{ label: "Pendiente", value: "PENDING" },
	{ label: "Cancelado", value: "CANCELLED" },
];

export const getTripFields = (): FieldDef<TripRecord>[] => [
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
			<span className="text-xs text-slate-500 break-words" title={row.originChar}>
				{row.originChar}
			</span>
		),
		fullWidth: true,
	},
	{
		label: "Destino",
		cell: (row) => (
			<span className="text-xs text-slate-500 break-words" title={row.destinationChar}>
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
		cell: (row) => {
			const dateObj = new Date(`${row.date}T${row.time}`);
			return (
				<time suppressHydrationWarning className="text-slate-600">
					{dateObj.toLocaleString('es-AR', {
						day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
					})}
				</time>
			);
		},
	},
];
