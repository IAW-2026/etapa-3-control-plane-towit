'use client'

import React, { useRef, useState } from "react";
import CardDataView, { FieldDef, ActionDef } from "@/component/CardDataView";
import ResourceControlBar, { ControlOption } from "@/component/ResourceControlBar";
import FormModal, { FormFieldDef } from "@/component/FormModal";
import { createPaymentAction, deletePaymentAction } from "@/actions/payment-system/payment.actions";
import { useRouter } from "next/navigation";
import MessageModal from "@/component/MessageModal";

// TIPOS Y CONSTANTES ESTÁTICAS 

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
	const router = useRouter();
	const [activeForm, setActiveForm] = useState<ActiveFormAction>(null);
	const promiseResolver = useRef<((value: { success: boolean; message: string } | null) => void) | null>(null);

	const [messageState, setMessageState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
    }>({ isOpen: false, title: '', message: '', type: 'success' });

    const showMessage = (title: string, message: string, type: 'success' | 'error') => {
        setMessageState({ isOpen: true, title, message, type });
    };
    const closeMessage = () => setMessageState(prev => ({ ...prev, isOpen: false }));

	const openFormAction = (actionName: ActiveFormAction) => {
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
        messageState,    // Exportamos el estado
        showMessage,     // Exportamos el disparador
        closeMessage,    // Exportamos la función de cierre
        refresh: router.refresh, // Exportamos el refresh para actualizar la tabla
		openFormAction,
		closeModal,
		handleFormSubmit
	};
}

// -----------------------------------------------------------------------------
// 4. LA VISTA (El componente queda 100% enfocado en UI)
// -----------------------------------------------------------------------------

export default function PaymentsClient({ data }: PaymentsClientProps) {
    // Toda la fontanería asíncrona se resume en esta línea
	const { 
		isModalOpen, 
		modalConfig, 
		openFormAction, 
		closeModal, 
		handleFormSubmit,
		messageState,    
		showMessage,     
		closeMessage,    
		refresh          
	} = usePaymentActions();

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
			onAction: () => openFormAction('CREATE_PAYMENT') 
		},
		{
			label: "Eliminar pago seleccionado",
			variant: "danger",
			requireSelection: true,
			onAction: async (selectedId: string | null) => {
				if (!selectedId) return null;
				
				// Llamada directa a la Server Action
				const result = await deletePaymentAction(selectedId);
				
				if (result.ok) {
					showMessage("Pago Eliminado", "El pago se canceló correctamente.", "success");
					refresh(); // Refresca la tabla en background
				} else {
					const errorMsg = translateDeleteError(result.data?.code, result.data?.error);
					showMessage("Error al eliminar", errorMsg, "error");
				}
				
				return null; // Retornamos null para cumplir con la firma del tipo
			}
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

			{messageState.isOpen && (
                <MessageModal 
                    isOpen={messageState.isOpen}
                    title={messageState.title}
                    message={messageState.message}
                    type={messageState.type}
                    onClose={closeMessage}
                />
            )}
		</div>
	);
}

function translateDeleteError(code?: string, fallbackMessage?: string): string {
    switch (code) {
        case "PAYMENT_NOT_FOUND":
            return "El pago seleccionado no existe o ya ha sido cancelado previamente.";
        case "ACTIVE_DISBURSEMENT_EXISTS":
            return "Acción denegada: Existe un desembolso activo asociado. Debes revertir el desembolso primero.";
        case "ACTIVE_REFUND_EXISTS":
            return "Acción denegada: Ya existe un reembolso procesado para este viaje. Reviértelo primero.";
        case "DATABASE_ERROR":
            return "Ocurrió un error interno en la base de datos al intentar procesar la cancelación.";
        case "SERVER_ACTION_ERROR":
            return "El servidor no pudo completar la acción. Verifique su conexión.";
        default:
            return fallbackMessage || "Ocurrió un error desconocido al comunicarse con el servidor.";
    }
}