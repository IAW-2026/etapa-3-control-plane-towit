'use client'

import React, { useRef, useState } from "react";
import CardDataView, { FieldDef, ActionDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";
import FormModal, { FormFieldDef } from "@/component/FormModal";
import { createPaymentAction } from "@/actions/payment-system/payment.actions";

// -----------------------------------------------------------------------------
// 1. TIPOS Y CONSTANTES ESTÁTICAS (Fuera del componente para evitar re-creaciones)
// -----------------------------------------------------------------------------

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

type ActiveFormAction = 'CREATE_PAYMENT' | null; // Add actions here when they need the form modal

// Estructura estricta que toda acción debe respetar
interface ActionStrategy {
	title: string;
	description: string;
	submitText: string;
	fields: FormFieldDef[];
	execute: (formData: Record<string, any>) => Promise<{ success: boolean; message: string }>;
}

// -----------------------------------------------------------------------------
// 2. EL DICCIONARIO DE ESTRATEGIAS (La lógica de negocio aislada)
// -----------------------------------------------------------------------------

const ACTION_STRATEGIES: Record<Exclude<ActiveFormAction, null>, ActionStrategy> = {
	CREATE_PAYMENT: {
		title: "Generar Nuevo Pago",
		description: "Ingresa los datos para forzar la creación de un registro de pago.",
		submitText: "Crear Pago",
		fields: [
			{ name: "trip_id", label: "ID del Viaje", type: "text", required: true, placeholder: "TRIP-12345" },
			{ name: "id_user", label: "ID de clerk del Usuario", type: "text", required: true, placeholder: "Ej: user_2Q..." },
			{ name: "amount", label: "Monto", type: "number", required: true, placeholder: "0.00" },
		],
		execute: async (formData) => {
			return await createPaymentAction(formData);
		}
	},
    // Cuando quieras agregar Refund, solo creas el bloque REFUND_PAYMENT aquí y listo.
};

// -----------------------------------------------------------------------------
// 3. EL CONTROLADOR LOGICO (Custom Hook)
// -----------------------------------------------------------------------------

function usePaymentActions() {
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
			promiseResolver.current(null); // Cancelación silenciosa
			promiseResolver.current = null;
		}
	};

	const handleFormSubmit = async (formData: Record<string, any>) => {
		if (!activeForm) return { success: false, message: "Acción inválida" };
		
        // Ejecutamos la lógica específica de la acción seleccionada
		const result = await ACTION_STRATEGIES[activeForm].execute(formData);
		
		if (result.success && promiseResolver.current) {
			promiseResolver.current({ success: true, message: result.message });
			promiseResolver.current = null;
		}
		return result;
	};

    // Construimos la configuración visual que el modal necesita ahora mismo
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
// 4. LA VISTA (El componente queda 100% enfocado en UI)
// -----------------------------------------------------------------------------

export default function PaymentsClient({ data }: PaymentsClientProps) {
    // Toda la fontanería asíncrona se resume en esta línea
	const { isModalOpen, modalConfig, triggerAction, closeModal, handleFormSubmit } = usePaymentActions();

	const fields: FieldDef<PaymentRecord>[] = [
		{
			label: "Monto",
			cell: (row) => <span className="text-emerald-700">${Number(row.amount).toFixed(2)}</span>,
			isPrimary: true
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
			hrefTemplate: "/payment-system/payments?search={trip_id}"
		},
		{ label: "Usuario ID", accessorKey: "id_user" },
		{
			label: "ID Externo (MP)",
			cell: (row) => <span className="font-mono text-xs text-slate-400">{row.external_id || 'N/A'}</span>,
			fullWidth: true
		},
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
			label: "Generar nuevo pago",
			variant: "primary",
			requireSelection: false,
			onAction: () => triggerAction('CREATE_PAYMENT') 
		}
	];

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de transacción o viaje..."
				sortOptions={PAYMENT_SORT_OPTIONS}
				filterOptions={PAYMENT_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Historial de Pagos Activos"
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