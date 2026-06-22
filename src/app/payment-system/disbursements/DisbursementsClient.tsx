'use client'

import React, { useRef, useState } from "react";
import CardDataView, { FieldDef, ActionDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";
import FormModal, { FormFieldDef } from "@/component/FormModal";
import { createDisbursementAction } from "@/actions/payment-system/disbursement.actions";

// -----------------------------------------------------------------------------
// 1. TIPOS Y CONSTANTES ESTÁTICAS
// -----------------------------------------------------------------------------

const DISBURSEMENT_SORT_OPTIONS: ControlOption[] = [
	{ label: "Más recientes primero", value: "created_desc" },
	{ label: "Más antiguos primero", value: "created_asc" },
	{ label: "Mayor monto", value: "amount_desc" },
	{ label: "Menor monto", value: "amount_asc" },
];

const DISBURSEMENT_FILTER_OPTIONS: ControlOption[] = [
	{ label: "Todos los estados", value: "ALL" },
	{ label: "Pendiente", value: "PENDING" },
	{ label: "Completado", value: "COMPLETED" },
	{ label: "Cancelado", value: "CANCELLED" },
    { label: "Reembolsado", value: "REFUNDED" },
];

export interface DisbursementRecord {
	transaction_id: string;
	trip_id: string;
	id_user: number; // El conductor que recibe el dinero
	amount: string | number;
	platform_fee: string | number; // Exclusivo de Disbursements
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | string;
	created_at: string | Date;
	deleted_at: string | Date | null;
}

interface DisbursementsClientProps {
	data: DisbursementRecord[];
}

type ActiveFormAction = 'CREATE_DISBURSEMENT' | null;

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
	CREATE_DISBURSEMENT: {
		title: "Generar Nueva Liquidación",
		description: "Ingresa los datos para registrar manualmente una liquidación a favor de un conductor.",
		submitText: "Crear Liquidación",
		fields: [
			{ name: "trip_id", label: "ID del Viaje", type: "text", required: true, placeholder: "TRIP-12345" },
			{ name: "id_user", label: "ID de clerk del Conductor", type: "text", required: true, placeholder: "Ej: user_2Q..." },
			{ name: "platform_fee", label: "Comisión de Plataforma", type: "number", required: true, placeholder: "0.00" },
		],
		execute: async (formData) => {
			return await createDisbursementAction(formData);
		}
	},
};

// -----------------------------------------------------------------------------
// 3. EL CONTROLADOR LÓGICO (Custom Hook)
// -----------------------------------------------------------------------------

function useDisbursementActions() {
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

export default function DisbursementsClient({ data }: DisbursementsClientProps) {
	const { isModalOpen, modalConfig, triggerAction, closeModal, handleFormSubmit } = useDisbursementActions();

	const fields: FieldDef<DisbursementRecord>[] = [
		{
			label: "Monto Neto",
			cell: (row) => <span className="text-emerald-700 font-semibold">${Number(row.amount).toFixed(2)}</span>,
			isPrimary: true
		},
		{
			label: "Comisión (Fee)",
			cell: (row) => <span className="text-slate-500">${Number(row.platform_fee).toFixed(2)}</span>,
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
					'REFUNDED': 'bg-purple-100 text-purple-800 border-purple-200',
				};
				const style = statusStyles[row.status] || 'bg-slate-100 text-slate-800 border-slate-200';
				return <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${style}`}>{row.status}</span>;
			}
		},
		{
			label: "Viaje (Trip ID)",
			accessorKey: "trip_id",
			fullWidth: true,
			hrefTemplate: "/payment-system/disbursements?search={trip_id}"
		},
		{ label: "Conductor ID", accessorKey: "id_user" },
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
			label: "Generar nueva liquidación",
			variant: "primary",
			requireSelection: false,
			onAction: () => triggerAction('CREATE_DISBURSEMENT') 
		}
	];

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de transacción o viaje..."
				sortOptions={DISBURSEMENT_SORT_OPTIONS}
				filterOptions={DISBURSEMENT_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Historial de Liquidaciones Activas"
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