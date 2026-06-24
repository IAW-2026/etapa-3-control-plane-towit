import { ActionDef } from "@/component/CardDataView";
import { createRefundAction, deleteRefundAction } from "@/actions/payment-system/refunds.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export function translateRefundError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'USER_BANNED':
			return "Acción denegada: El pasajero involucrado se encuentra baneado del sistema.";
		case 'NOT_AUTHORIZED':
			return "Error de autenticación interna con el sistema de pagos.";
		case 'VALIDATION_ERROR':
			return "Los datos de reembolso proporcionados no son válidos.";
		case 'NOT_FOUND':
		case 'REFUND_NOT_FOUND':
			return "El reembolso especificado no existe o ya ha sido cancelado previamente.";
		case 'ACTIVE_DISBURSEMENT_EXISTS':
			return "Acción denegada: Existe un desembolso activo para el viaje. No se puede procesar el reembolso.";
		case 'ACTIVE_REFUND_EXISTS':
			return "Acción denegada: Existe un reembolso activo que entra en conflicto con este reembolso.";
		case 'DATABASE_ERROR':
			return "Ocurrió un error interno en la base de datos de reembolsos.";
		case 'SERVER_ERROR':
		case 'SERVER_ACTION_ERROR':
			return "Error en el servidor al procesar la solicitud.";
		default:
			return fallbackMessage || "El sistema de pagos rechazó la solicitud debido a un error desconocido.";
	}
}

export const REFUND_FORM_CONFIGS = {
	CREATE_REFUND: {
		title: "Procesar Nuevo Reembolso",
		description: "Ingresa los datos para forzar la devolución de dinero de un viaje al pasajero.",
		submitText: "Procesar Reembolso",
		fields: [
			{ name: "trip_id", label: "ID del Viaje", type: "text", required: true, placeholder: "TRIP-12345" },
			{ name: "clerk_id", label: "ID de clerk del Pasajero", type: "text", required: true, placeholder: "Ej: user_2Q..." },
			{ name: "refund_type", label: "Tipo de Reembolso", type: "text", required: true, placeholder: "TOTAL o PARTIAL" },
		],
		execute: async (formData) => {
			const result = await createRefundAction(formData);
			if (!result.success) {
				return { success: false, message: translateRefundError(result.code, "No se pudo crear el reembolso.") };
			}
			return { success: true, message: "Reembolso procesado exitosamente." };
		}
	},
} satisfies Record<string, ActionStrategy>;

export type RefundFormAction = keyof typeof REFUND_FORM_CONFIGS;

export interface RefundViewActionHandlers {
	openFormAction: (actionName: RefundFormAction) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getRefundViewActions = (handlers: RefundViewActionHandlers): ActionDef[] => [
	{
		label: "Procesar Reembolso",
		variant: "primary",
		requireSelection: false,
		onAction: () => handlers.openFormAction('CREATE_REFUND')
	},
	{
		label: "Eliminar reembolso seleccionado",
		variant: "danger",
		requireSelection: true,
		onAction: async (selectedId: string | null) => {
			if (!selectedId) return null;

			const result = await deleteRefundAction(selectedId);

			if (result.success) {
				handlers.showMessage("Reembolso Eliminado", "El reembolso se eliminó correctamente.", "success");
				handlers.refresh();
			} else {
				const errorMsg = translateRefundError(result.code, "No se pudo eliminar el reembolso.");
				handlers.showMessage("Error al eliminar", errorMsg, "error");
			}

			return null;
		}
	}
];
