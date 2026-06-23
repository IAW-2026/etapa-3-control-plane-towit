import { ActionDef } from "@/component/CardDataView";
import { createRefundAction, deleteRefundAction } from "@/actions/payment-system/refunds.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export const REFUND_FORM_CONFIGS = {
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
} satisfies Record<string, ActionStrategy>;

export type RefundFormAction = keyof typeof REFUND_FORM_CONFIGS;

export function translateDeleteError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case "REFUND_NOT_FOUND":
			return "El reembolso seleccionado no existe o ya ha sido cancelado previamente.";
		case "DATABASE_ERROR":
			return "Ocurrió un error interno en la base de datos al intentar procesar la cancelación.";
		case "SERVER_ACTION_ERROR":
			return "El servidor no pudo completar la acción. Verifique su conexión.";
		default:
			return fallbackMessage || "Ocurrió un error desconocido al comunicarse con el servidor.";
	}
}

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

			if (result.ok) {
				handlers.showMessage("Reembolso Eliminado", "El reembolso se eliminó correctamente.", "success");
				handlers.refresh();
			} else {
				const errorMsg = translateDeleteError(result.data?.code, result.data?.error);
				handlers.showMessage("Error al eliminar", errorMsg, "error");
			}

			return null;
		}
	}
];
