import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { RefundRecord } from "./refund.types";

export const REFUND_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes primero", value: "created_desc" },
	{ label: "Más antiguos primero", value: "created_asc" },
	{ label: "Mayor monto", value: "amount_desc" },
	{ label: "Menor monto", value: "amount_asc" },
];

export const REFUND_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos los estados", value: "ALL" },
	{ label: "Pendiente", value: "PENDING" },
	{ label: "Completado", value: "COMPLETED" },
	{ label: "Cancelado", value: "CANCELLED" },
];

export const getRefundFields = (): FieldDef<RefundRecord>[] => [
	{
		label: "Monto",
		cell: (row) => <span className="text-emerald-700 font-semibold">${Number(row.amount).toFixed(2)}</span>,
		isPrimary: true
	},
	{
		label: "Tipo",
		cell: (row) => (
			<span className={`text-xs font-bold ${row.refund_type === 'TOTAL' ? 'text-indigo-600' : 'text-amber-600'}`}>
				{row.refund_type}
			</span>
		),
	},
	{
		label: "ID Transacción",
		cell: (row) => <span className="font-mono text-xs text-slate-500" title={row.transaction_id}>{row.transaction_id.split('-')[0]}...</span>
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
			return <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>{row.status}</span>;
		}
	},
	{
		label: "Viaje (Trip ID)",
		accessorKey: "trip_id",
		fullWidth: true,
		hrefTemplate: "/payment-system/refunds?search={trip_id}"
	},
	{ label: "Pasajero ID", accessorKey: "id_user" },
	{
		label: "Fecha",
		cell: (row) => (
			<time suppressHydrationWarning className="text-slate-600">
				{new Date(row.created_at).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
			</time>
		)
	},
	{
		label: "Borrado en",
		cell: (row) => (
			row.deleted_at 
				? <time suppressHydrationWarning className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md">{new Date(row.deleted_at).toLocaleString('es-AR', { day: '2-digit', month: 'short' })}</time> 
				: <span className="text-slate-300">-</span>
		),
	},
];
