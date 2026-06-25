import { ActionDef } from "@/component/CardDataView";
import { deleteRatingAction } from "@/actions/feedback/ratings.actions";

export function translateRatingError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'INVALID_ID':
			return "El ID de la calificación no es válido.";
		case 'NOT_AUTHORIZED':
			return "Error de autenticación interna con el sistema de feedback.";
		case 'NOT_FOUND':
			return "La calificación especificada no existe o ya fue eliminada.";
		case 'SERVER_ERROR':
			return "Error interno del servidor de feedback.";
		case 'SERVER_ACTION_ERROR':
			return "Error en el servidor al procesar la solicitud.";
		default:
			return fallbackMessage || "Ocurrió un error desconocido al comunicarse con el servidor.";
	}
}

export interface RatingViewActionHandlers {
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getRatingViewActions = (handlers: RatingViewActionHandlers): ActionDef[] => [
	{
		label: "Eliminar calificación seleccionada",
		variant: "danger",
		requireSelection: true,
		onAction: async (selectedIds: string[]) => {
			if (selectedIds.length === 0) return null;

			const result = await deleteRatingAction(selectedIds[0]);

			if (result.success) {
				handlers.showMessage("Calificación Eliminada", "La calificación se eliminó correctamente.", "success");
				handlers.refresh();
			} else {
				const errorMsg = translateRatingError(result.code, "No se pudo eliminar la calificación.");
				handlers.showMessage("Error al eliminar", errorMsg, "error");
			}

			return null;
		}
	}
];
