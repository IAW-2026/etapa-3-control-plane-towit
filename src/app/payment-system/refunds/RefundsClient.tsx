'use client'

import React, { useRef, useState } from "react";
import CardDataView, { FieldDef, ActionDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";
import FormModal, { FormFieldDef } from "@/component/FormModal";
import { createRefundAction } from "@/actions/payment-system/refunds.actions";

// -----------------------------------------------------------------------------
// 1. TIPOS Y CONSTANTES ESTÁTICAS
// -----------------------------------------------------------------------------

const REFUND_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes primero", value: "created_desc" },
	{ label: "Más antiguos primero", value: "created_asc" },
	{ label: "Mayor monto", value: "amount_desc" },
	{ label: "Menor monto", value: "amount_asc" },
];

const REFUND_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos los estados", value: "ALL" },
	{ label: "Pendiente", value: "PENDING" },
	{ label: "Completado", value: "COMPLETED" },
	{ label: "Cancelado", value: "CANCELLED" },
];

export interface RefundRecord {
	transaction_id: string;
	trip_id: string;
	id_user: number;
	amount: string | number;
	refund_type: 'TOTAL' | 'PARTIAL'; // Exclusivo de Refunds
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | string;
	created_at: string | Date;
	deleted_at: string | Date | null;
}

interface RefundsClientProps {
	data: RefundRecord[];
}

type ActiveFormAction = 'CREATE_REFUND' | null;

interface ActionStrategy {
	title: string;
	description: string;
	submitText: string;
	fields: FormFieldDef[];
	execute: (formData: Record<string, any>) => Promise<{ success: boolean; message: string }>;
}

// -----------------------------------------------------------------------------
// 2. EL DICCIONARIO DE ESTRATEGIAS
// -----------------------------------------------------------------------------

const ACTION_STRATEGIES: Record<Exclude<ActiveFormAction, null>, ActionStrategy> = {
	CREATE_REFUND: {
		title: "Procesar Nuevo Reembolso",
		description: "Ingresa los datos para forzar la devolución de dinero de un viaje al pasajero.",
		submitText: "Procesar Reembolso",
		fields: [
			{ name: "trip_id", label: "ID del Viaje", type: "text", required: true, placeholder: "TRIP-12345" },
			{ name: "id_user", label: "ID de clerk del Pasajero", type: "text", required: true, placeholder: "Ej: user_2Q..." },
			{ name: "refund_type", label: "Tipo de Reembolso", type: "text", required: true, placeholder: "TOTAL o PARTIAL" },
		],
		execute: async (formData) => {
			return await createRefundAction(formData);
		}
	},
};

// -----------------------------------------------------------------------------
// 3. EL CONTROLADOR LÓGICO (Custom Hook)
// -----------------------------------------------------------------------------

function useRefundActions() {
	const [activeForm, setActiveForm] = useState<ActiveFormAction>(null);
	const promiseResolver = useRef<((value: { success: boolean; message: string } | null) => void) | null>(null);

	const triggerAction = (actionName: ActiveFormAction) => {
		setActiveForm(actionName);
		return new Promise<{ success: boolean; message: string } | null>((resolve) => { 
			promiseResolver.current = resolve; 
		});
	};

	const closeModal = () => {
		setActiveForm(null);
		if (promiseResolver.current) {
			promiseResolver.current(null);
			promiseResolver.current = null;
		}
	};

	const handleFormSubmit = async (formData: Record<string, any>) => {
		if (!activeForm) return { success: false, message: "Acción inválida" };
		
		const result = await ACTION_STRATEGIES[activeForm].execute(formData);
		
		if (result.success && promiseResolver.current) {
			promiseResolver.current({ success: true, message: result.message });
			promiseResolver.current = null;
		}
		return result;
	};

	const currentModalConfig = activeForm ? ACTION_STRATEGIES[activeForm] : null;

	return {
		isModalOpen: activeForm !== null,
		modalConfig: currentModalConfig,
		triggerAction,
		closeModal,
		handleFormSubmit
	};
}

// -----------------------------------------------------------------------------
// 4. LA VISTA
// -----------------------------------------------------------------------------

export default function RefundsClient({ data }: RefundsClientProps) {
	const { isModalOpen, modalConfig, triggerAction, closeModal, handleFormSubmit } = useRefundActions();

	const fields: FieldDef<RefundRecord>[] = [
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

	const actions: ActionDef[] = [
		{
			label: "Procesar Reembolso",
			variant: "primary",
			requireSelection: false,
			onAction: () => triggerAction('CREATE_REFUND') 
		}
	];

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de transacción o viaje..."
				sortOptions={REFUND_SORT_OPTIONS}
				filterOptions={REFUND_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Historial de Reembolsos"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => row.transaction_id}
			/>

			{modalConfig && (
				<FormModal
					isOpen={isModalOpen}
					title={modalConfig.title}
					description={modalConfig.description}
					fields={modalConfig.fields}
					submitText={modalConfig.submitText}
					onSubmit={handleFormSubmit}
					onClose={closeModal}
				/>
			)}
		</div>
	);
}