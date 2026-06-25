import React from "react";
import { FieldDef } from "@/component/CardDataView";
import { ControlOption } from "@/component/ResourceControlBar";
import { RatingRecord , CustomerPresetTagSlug} from "./rating.types";

export const RATING_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes primero", value: "created_desc" },
	{ label: "Más antiguos primero", value: "created_asc" },
	{ label: "Mayor calificación", value: "rating_desc" },
	{ label: "Menor calificación", value: "rating_asc" },
];

export const RATING_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos los tipos", value: "ALL" },
	{ label: "Tower a Customer", value: "tower_to_customer" },
	{ label: "Customer a Tower", value: "customer_to_tower" },
];

const TYPE_LABELS: Record<string, string> = {
	"tower_to_customer": "Tower a Customer",
	"customer_to_tower": "Customer a Tower",
};

const CUSTOMER_PRESET_TAGS_LABELS: Record<string, string> = {
	"polite": "Amable",
	"punctual": "Puntual",
	"took_care_of_vehicle": "Cuidadoso con el vehículo",
	"good_communication": "Buena comunicación",
	"professional": "Profesional",
};

function RatingStars({ value }: { value: number }) {
	return (
		<span className="text-amber-500 tracking-tight" aria-label={`${value} de 5 estrellas`}>
			{Array.from({ length: 5 }, (_, i) => (
				<span key={i} className={i < value ? "opacity-100" : "opacity-25"}>
					★
				</span>
			))}
		</span>
	);
}

export const getRatingFields = (): FieldDef<RatingRecord>[] => [
	{
		label: "Calificación",
		cell: (row) => <RatingStars value={row.rating} />,
		isPrimary: true,
	},
	{
		label: "ID",
		accessorKey: "id",
	},
	{
		label: "Tipo",
		cell: (row) => {
			const style = row.type === "tower_to_customer"
				? "bg-blue-100 text-blue-800 border-blue-200"
				: "bg-purple-100 text-purple-800 border-purple-200";
			return (
				<span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>
					{TYPE_LABELS[row.type] || row.type}
				</span>
			);
		},
	},
	{
		label: "Etiqueta",
		cell: (row) => (
			<span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
				{CUSTOMER_PRESET_TAGS_LABELS[row.tags as CustomerPresetTagSlug] || row.tags || "Sin etiqueta"}
			</span>
		),
	},
	{
		label: "Comentario",
		cell: (row) => (
			<span className="text-slate-600 text-sm truncate max-w-[200px] block" title={row.comment}>
				{row.comment || "—"}
			</span>
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
		label: "Fecha",
		cell: (row) => (
			<time suppressHydrationWarning className="text-slate-600">
				{new Date(row.createdAt).toLocaleString("es-AR", {
					day: "2-digit",
					month: "short",
					hour: "2-digit",
					minute: "2-digit",
				})}
			</time>
		),
	},
	{
		label: "Calificador",
		cell: (row) => (
			<span className="font-mono text-xs text-slate-500" title={row.raterClerkId}>
				{row.raterClerkId.length > 12 ? `${row.raterClerkId.slice(0, 12)}...` : row.raterClerkId}
			</span>
		),
	},
	{
		label: "Calificado",
		cell: (row) => (
			<span className="font-mono text-xs text-slate-500" title={row.ratedClerkId}>
				{row.ratedClerkId.length > 12 ? `${row.ratedClerkId.slice(0, 12)}...` : row.ratedClerkId}
			</span>
		),
	},
	
];

