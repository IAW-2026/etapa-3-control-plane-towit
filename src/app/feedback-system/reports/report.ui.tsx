import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { ReportRecord } from "./report.types";

export const REPORT_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes primero", value: "created_desc" },
	{ label: "Más antiguos primero", value: "created_asc" },
];

export const REPORT_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos los estados", value: "ALL" },
	{ label: "Sin resolver", value: "unresolved" },
	{ label: "Considerado", value: "considered" },
	{ label: "Descartado", value: "dismissed" },
];

const STATUS_LABELS: Record<string, string> = {
	unresolved: "Sin resolver",
	considered: "Considerado",
	dismissed: "Descartado",
};

const STATUS_STYLES: Record<string, string> = {
	unresolved: "bg-rose-100 text-rose-800 border-rose-200",
	considered: "bg-amber-100 text-amber-800 border-amber-200",
	dismissed: "bg-slate-100 text-slate-800 border-slate-200",
};

export const getReportFields = (): FieldDef<ReportRecord>[] => [
	{
		label: "Reporte",
		cell: (row) => {
			const statusKey = row.status?.toLowerCase() || 'unknown';
			const style = STATUS_STYLES[statusKey] || 'bg-slate-100 text-slate-800 border-slate-200';
			const label = STATUS_LABELS[statusKey] || row.status;
			return (
				<span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>
					{label}
				</span>
			);
		},
		isPrimary: true,
	},
	{
		label: "ID",
		accessorKey: "id",
	},
	{
		label: "Motivo",
		cell: (row) => (
			<span className="font-medium text-slate-800 break-words" title={row.reason}>{row.reason}</span>
		),
		fullWidth: true,
	},
	{
		label: "Descripción",
		cell: (row) => (
			<span className="text-xs text-slate-600 break-words" title={row.description}>{row.description}</span>
		),
		fullWidth: true,
	},
	{
		label: "Viaje (Trip ID)",
		cell: (row) => (
			<span className="font-mono text-xs text-slate-500">{row.tripId}</span>
		),
	},
	{
		label: "Reportado por",
		cell: (row) => (
			<span className="font-mono text-xs text-slate-500" title={row.reporterClerkId}>{row.reporterClerkId.length > 12 ? `${row.reporterClerkId.slice(0, 12)}...` : row.reporterClerkId}</span>
		),
	},
	{
		label: "Reportado a",
		cell: (row) => (
			<span className="font-mono text-xs text-slate-500" title={row.reportedClerkId}>{row.reportedClerkId.length > 12 ? `${row.reportedClerkId.slice(0, 12)}...` : row.reportedClerkId}</span>
		),
	},
	{
		label: "Fecha",
		cell: (row) => (
			<time suppressHydrationWarning className="text-slate-600">
				{new Date(row.createdAt).toLocaleString('es-AR', {
					day: '2-digit',
					month: 'short',
					hour: '2-digit',
					minute: '2-digit'
				})}
			</time>
		),
	},
	{
		label: "Vehículo",
		cell: (row) => (
			<span className="text-xs text-slate-500">{row.trip?.vehicle || '-'}</span>
		),
	},
	{
		label: "Fecha del viaje",
		cell: (row) => (
			<span className="text-xs text-slate-500">{row.trip?.date || '-'}</span>
		),
	},
];
