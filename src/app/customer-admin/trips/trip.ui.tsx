import { FieldDef } from "@/component/CardDataView";
import { TripRecord } from "./trip.types";

export interface SortOption {
	value: string;
	label: string;
}

export interface FilterOption {
	value: string;
	label: string;
}

export const STATUS_LABELS: Record<string, string> = {
	'pendiente pago': 'Pendiente de pago',
	'pago confirmado': 'Pago confirmado',
	'en proceso': 'En curso',
	finalizado: 'Finalizado',
	cancelado: 'Cancelado',
};

export const STATUS_STYLES: Record<string, string> = {
	'pendiente pago': 'bg-amber-50 text-amber-700 border-amber-200',
	'pago confirmado': 'bg-blue-50 text-blue-700 border-blue-200',
	'en proceso': 'bg-indigo-50 text-indigo-700 border-indigo-200',
	finalizado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	cancelado: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const TRIP_SORT_OPTIONS: SortOption[] = [
	{ value: 'date-desc', label: 'Más recientes' },
	{ value: 'date-asc', label: 'Más antiguos' },
];

export const TRIP_FILTER_OPTIONS: FilterOption[] = [
	{ value: 'all', label: 'Todos' },
	{ value: 'pendiente pago', label: 'Pendiente de pago' },
	{ value: 'pago confirmado', label: 'Pago confirmado' },
	{ value: 'en proceso', label: 'En curso' },
	{ value: 'finalizado', label: 'Finalizado' },
	{ value: 'cancelado', label: 'Cancelado' },
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
		hrefTemplate: "/customer-admin/customers?search={customerName}",
	},
	{
		label: "Vehículo",
		cell: (row) => <span className="text-sm text-slate-700">#{row.vehicleId}</span>,
		hrefTemplate: "/customer-admin/vehicles?search={customerName}",
	},
	{
		label: "Conductor",
		cell: (row) => {
			if (!row.driverName) return <span className="text-xs text-slate-400 italic">—</span>;
			return <span className="text-sm text-slate-700">{row.driverName}</span>;
		},
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
			const statusKey = row.status?.toLowerCase() || '';
			const style = STATUS_STYLES[statusKey] || 'bg-slate-100 text-slate-800 border-slate-200';
			const label = STATUS_LABELS[statusKey] || row.status;

			return (
				<span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>
					{label}
				</span>
			);
		},
	},
	{
		label: "Fecha y hora",
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
