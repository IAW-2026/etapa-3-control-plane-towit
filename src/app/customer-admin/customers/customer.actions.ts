import { ActionDef } from "@/component/CardDataView";
import { toggleCustomerStatusAction } from "@/actions/customer-admin/customer.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";
import { CustomerRecord } from "./customer.types";

export const CUSTOMER_FORM_CONFIGS = {} satisfies Record<string, ActionStrategy>;

export type CustomerFormAction = keyof typeof CUSTOMER_FORM_CONFIGS;

export function translateToggleError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case "PATCH_FAILED":
			return "El servidor rechazó la actualización del estado. Intente nuevamente.";
		case "SERVER_ACTION_ERROR":
			return "El servidor no pudo completar la acción. Verifique su conexión.";
		default:
			return fallbackMessage || "Ocurrió un error desconocido al comunicarse con el servidor.";
	}
}

export interface CustomerViewActionHandlers {
	openFormAction: (actionName: CustomerFormAction) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getCustomerViewActions = (
	handlers: CustomerViewActionHandlers,
	currentUserId: string | undefined,
	recordMap: Map<string, CustomerRecord>
): ActionDef[] => [
	{
		label: "Activar / Desactivar cliente",
		variant: "warning",
		requireSelection: true,
		onAction: async (selectedIds: string[]) => {
			if (selectedIds.length === 0) return null;

			let successCount = 0;
			let errorCount = 0;
			let skippedCount = 0;
			let lastError = "";

			for (const id of selectedIds) {
				const record = recordMap.get(id);
				if (!record) {
					errorCount++;
					lastError = "Cliente no encontrado en la lista.";
					continue;
				}

				if (currentUserId && record.clerkId === currentUserId) {
					skippedCount++;
					continue;
				}

				const targetStatus = !record.isActive;
				const result = await toggleCustomerStatusAction(record.customerId, targetStatus);

				if (result.ok) {
					successCount++;
				} else {
					errorCount++;
					lastError = result.data?.error || "Error desconocido";
				}
			}

			const skippedMsg = skippedCount > 0
				? ` ${skippedCount} omitido(s) (no puedes modificar tu propio usuario).`
				: "";

			if (successCount > 0 && errorCount === 0) {
				const msg = successCount === 1
					? `El cliente fue actualizado correctamente.${skippedMsg}`
					: `${successCount} clientes actualizados correctamente.${skippedMsg}`;
				handlers.showMessage("Estado actualizado", msg, "success");
				handlers.refresh();
			} else if (successCount > 0 && errorCount > 0) {
				handlers.showMessage(
					"Operación parcial",
					`${successCount} cliente(s) actualizados, pero ${errorCount} no pudieron procesarse.${skippedMsg}`,
					"error"
				);
				handlers.refresh();
			} else if (skippedCount > 0 && successCount === 0 && errorCount === 0) {
				handlers.showMessage(
					"No se realizaron cambios",
					"No puedes modificar tu propio usuario.",
					"error"
				);
			} else {
				const errorMsg = translateToggleError(undefined, lastError);
				handlers.showMessage("Error al cambiar estado", errorMsg, "error");
			}

			return null;
		}
	}
];
