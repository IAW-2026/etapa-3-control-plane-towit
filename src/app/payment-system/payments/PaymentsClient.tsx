'use client'

import React from "react";
// Importamos el nuevo componente de tarjetas y sus tipos
import CardDataView, { FieldDef, ActionDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";


// Definimos nuestras "tuplas" de opciones en el componente padre
const PAYMENT_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes primero", value: "created_desc" },
	{ label: "Más antiguos primero", value: "created_asc" },
	{ label: "Mayor precio", value: "amount_desc" },
	{ label: "Menor precio", value: "amount_asc" },
];

const PAYMENT_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos los estados", value: "ALL" },
	{ label: "Pendiente", value: "PENDING" },
	{ label: "Completado", value: "COMPLETED" },
	{ label: "Reembolsado", value: "REFUNDED" },
];

// Tipamos estrictamente los datos según tu esquema de base de datos
export interface PaymentRecord {
	transaction_id: string;
	trip_id: string;
	id_user: number;
	amount: string | number;
	external_id: string | null;
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | string;
	created_at: string | Date;
	updated_at: string | Date;
	deleted_at: string | Date | null;
}

interface PaymentsClientProps {
	data: PaymentRecord[];
}

export default function PaymentsClient({ data }: PaymentsClientProps) {

	// 1. Definimos los Campos (Fields) utilizando el nuevo formato de tarjetas
	const fields: FieldDef<PaymentRecord>[] = [
		{
			label: "Monto",
			cell: (row) => <span className="text-emerald-700">${Number(row.amount).toFixed(2)}</span>,
			isPrimary: true // El monto es el dato financiero central, lo destacamos como título
		},
		{
			label: "ID Transacción",
			// Usamos el atributo title para que al pasar el mouse se vea el UUID completo
			cell: (row) => <span className="font-mono text-xs text-slate-500" title={row.transaction_id}>{row.transaction_id.split('-')[0]}...</span>
		},
		{
			label: "Estado",
			cell: (row) => {
				// Diccionario de estilos dinámicos para mayor legibilidad visual
				const statusStyles: Record<string, string> = {
					'COMPLETED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
					'PENDING': 'bg-amber-100 text-amber-800 border-amber-200',
					'CANCELLED': 'bg-rose-100 text-rose-800 border-rose-200',
					'REFUNDED': 'bg-purple-100 text-purple-800 border-purple-200',
				};
				const style = statusStyles[row.status] || 'bg-slate-100 text-slate-800 border-slate-200';

				return (
					<span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>
						{row.status}
					</span>
				);
			}
		},
		{
			label: "Viaje (Trip ID)",
			accessorKey: "trip_id",
			fullWidth: true, // Obligamos a que ocupe todo el ancho para que no se corte visualmente
			hrefTemplate: "/payment-system/payments?search={trip_id}" // Al hacer click, nos lleva a la página del viaje correspondiente
		},
		{
			label: "Usuario ID",
			accessorKey: "id_user",
		},
		{
			label: "ID Externo (MercadoPago)",
			cell: (row) => (
				<span className="font-mono text-xs text-slate-400">
					{row.external_id ? row.external_id : 'N/A'}
				</span>
			),
			fullWidth: true // Los IDs de MP suelen ser largos
		},
		{
			label: "Fecha",
			cell: (row) => (
				<time suppressHydrationWarning className="text-slate-600">
					{new Date(row.created_at).toLocaleString('es-AR', {
						day: '2-digit',
						month: 'short',
						hour: '2-digit',
						minute: '2-digit'
					})}
				</time>
			)
		},
		{
			label: "Borrado en",
			cell: (row) => (
				row.deleted_at ? (
					<time suppressHydrationWarning className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
						{new Date(row.deleted_at).toLocaleString('es-AR', { day: '2-digit', month: 'short' })}
					</time>
				) : <span className="text-slate-300">-</span>
			),
		},
	];

	// 2. Definimos las acciones disponibles en la Toolbar
	const actions: ActionDef[] = [
		{
			label: "Generar nuevo pago",
			variant: "primary",
			requireSelection: false, // No requiere selección previa para generar un nuevo pago
			onAction: async () => {
				return { success: true, message: "Pago generado exitosamente (simulado)." };
			}
		}
	];

	// 3. Renderizamos pasando properties adaptadas a CardDataView
	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de transacción o viaje..."
				sortOptions={PAYMENT_SORT_OPTIONS}
				filterOptions={PAYMENT_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			// Si tuvieras un backend que espera otro parámetro en la URL, se lo pasas así:
			// filterParamKey="payment_status" 
			/>

			<CardDataView
				title="Historial de Pagos Activos"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => row.transaction_id}
			/>
		</div>
	);
}