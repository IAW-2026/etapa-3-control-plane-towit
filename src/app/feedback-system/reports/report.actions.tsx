import { ActionDef, DropdownActionDef } from "@/component/CardDataView";
import { updateReportStatusAction } from "@/actions/feedback/reports.actions";

export function translateReportError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'INVALID_STATUS':
			return "El estado especificado no es válido.";
		case 'NOT_AUTHORIZED':
			return "Error de autenticación interna con el sistema de feedback.";
		case 'NOT_FOUND':
			return "El reporte especificado no existe o ya fue eliminado.";
		case 'SERVER_ERROR':
			return "Error interno del servidor de feedback.";
		case 'SERVER_ACTION_ERROR':
			return "Error en el servidor al procesar la solicitud.";
		default:
			return fallbackMessage || "Ocurrió un error desconocido al comunicarse con el servidor.";
	}
}

export interface ReportViewActionHandlers {
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getReportViewActions = (handlers: ReportViewActionHandlers): ActionDef[] => [
	{
		label: "Considerado",
		variant: "warning",
		requireSelection: true,
		onAction: async (selectedIds: string[]) => {
			if (selectedIds.length === 0) return null;

			for (const id of selectedIds) {
				const result = await updateReportStatusAction(id, "considered");
				if (!result.success) {
					const errorMsg = translateReportError(result.code, "No se pudo marcar como considerado.");
					handlers.showMessage("Error al actualizar", errorMsg, "error");
					return null;
				}
			}

			handlers.showMessage("Estado actualizado", `${selectedIds.length} reporte${selectedIds.length > 1 ? 's' : ''} marcado${selectedIds.length > 1 ? 's' : ''} como considerado.`, "success");
			handlers.refresh();
			return null;
		}
	},
	{
		label: "Descartar",
		variant: "danger",
		requireSelection: true,
		onAction: async (selectedIds: string[]) => {
			if (selectedIds.length === 0) return null;

			for (const id of selectedIds) {
				const result = await updateReportStatusAction(id, "dismissed");
				if (!result.success) {
					const errorMsg = translateReportError(result.code, "No se pudo descartar el reporte.");
					handlers.showMessage("Error al actualizar", errorMsg, "error");
					return null;
				}
			}

			handlers.showMessage("Estado actualizado", `${selectedIds.length} reporte${selectedIds.length > 1 ? 's' : ''} descartado${selectedIds.length > 1 ? 's' : ''}.`, "success");
			handlers.refresh();
			return null;
		}
	},
	{
		label: "Reabrir",
		variant: "primary",
		requireSelection: true,
		onAction: async (selectedIds: string[]) => {
			if (selectedIds.length === 0) return null;

			for (const id of selectedIds) {
				const result = await updateReportStatusAction(id, "unresolved");
				if (!result.success) {
					const errorMsg = translateReportError(result.code, "No se pudo reabrir el reporte.");
					handlers.showMessage("Error al actualizar", errorMsg, "error");
					return null;
				}
			}

			handlers.showMessage("Estado actualizado", `${selectedIds.length} reporte${selectedIds.length > 1 ? 's' : ''} reabierto${selectedIds.length > 1 ? 's' : ''}.`, "success");
			handlers.refresh();
			return null;
		}
	},
];

export const getReportViewDropdowns = (handlers: ReportViewActionHandlers): DropdownActionDef[] => [
	{
		label: "Cambiar estado",
		requireSelection: true,
		options: [
			{
				label: "Considerado",
				onAction: async (selectedIds: string[]) => {
					if (selectedIds.length === 0) return null;

					for (const id of selectedIds) {
						const result = await updateReportStatusAction(id, "considered");
						if (!result.success) {
							const errorMsg = translateReportError(result.code, "No se pudo marcar como considerado.");
							handlers.showMessage("Error al actualizar", errorMsg, "error");
							return null;
						}
					}

					handlers.showMessage("Estado actualizado", `${selectedIds.length} reporte${selectedIds.length > 1 ? 's' : ''} marcado${selectedIds.length > 1 ? 's' : ''} como considerado.`, "success");
					handlers.refresh();
					return null;
				}
			},
			{
				label: "Descartar",
				onAction: async (selectedIds: string[]) => {
					if (selectedIds.length === 0) return null;

					for (const id of selectedIds) {
						const result = await updateReportStatusAction(id, "dismissed");
						if (!result.success) {
							const errorMsg = translateReportError(result.code, "No se pudo descartar el reporte.");
							handlers.showMessage("Error al actualizar", errorMsg, "error");
							return null;
						}
					}

					handlers.showMessage("Estado actualizado", `${selectedIds.length} reporte${selectedIds.length > 1 ? 's' : ''} descartado${selectedIds.length > 1 ? 's' : ''}.`, "success");
					handlers.refresh();
					return null;
				}
			},
			{
				label: "Reabrir",
				onAction: async (selectedIds: string[]) => {
					if (selectedIds.length === 0) return null;

					for (const id of selectedIds) {
						const result = await updateReportStatusAction(id, "unresolved");
						if (!result.success) {
							const errorMsg = translateReportError(result.code, "No se pudo reabrir el reporte.");
							handlers.showMessage("Error al actualizar", errorMsg, "error");
							return null;
						}
					}

					handlers.showMessage("Estado actualizado", `${selectedIds.length} reporte${selectedIds.length > 1 ? 's' : ''} reabierto${selectedIds.length > 1 ? 's' : ''}.`, "success");
					handlers.refresh();
					return null;
				}
			},
		],
	},
];
