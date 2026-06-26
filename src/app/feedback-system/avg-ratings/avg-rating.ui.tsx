import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { AvgRatingRecord } from "./avg-rating.types";

function RatingStars({ value }: { value: number }) {
	const full = Math.floor(value);
	const fraction = value - full;

	return (
		<span className="text-amber-500 tracking-tight" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
			{Array.from({ length: 5 }, (_, i) => {
				if (i < full) return <span key={i} className="opacity-100">★</span>;
				if (i === full && fraction > 0) return <span key={i} className="opacity-60">★</span>;
				return <span key={i} className="opacity-25">★</span>;
			})}
			<span className="ml-1.5 text-xs text-slate-500 font-medium">{value.toFixed(1)}</span>
		</span>
	);
}

export const getAvgRatingFields = (): FieldDef<AvgRatingRecord>[] => [
	{
		label: "Nombre",
		cell: (row) => {
			const fullName = [row.firstName, row.lastName].filter(Boolean).join(" ");
			return (
				<span className="font-semibold text-slate-900">{fullName || row.displayName}</span>
			);
		},
		isPrimary: true,
	},
	{
		label: "Clerk ID",
		cell: (row) => (
			<span className="font-mono text-xs text-slate-500" title={row.clerkId}>
				{row.clerkId.length}
			</span>
		),
		fullWidth: true,
	},
	{
		label: "Calificación Promedio",
		cell: (row) => <RatingStars value={row.avgRating} />,
	},
	{
		label: "Total Calificaciones",
		cell: (row) => (
			<span className="px-2.5 py-1 text-xs font-bold rounded-md border bg-slate-100 text-slate-700 border-slate-200">
				{row.totalRatings}
			</span>
		),
	},
	{
		label: "Última Actualización",
		cell: (row) => (
			<time suppressHydrationWarning className="text-slate-600">
				{new Date(row.updatedAt).toLocaleString("es-AR", {
					day: "2-digit",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				})}
			</time>
		),
	},
];
