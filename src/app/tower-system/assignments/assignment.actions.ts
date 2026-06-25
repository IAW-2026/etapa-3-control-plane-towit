import { ActionDef } from "@/component/CardDataView";
import { createAssignmentAction, updateAssignmentAction, deleteAssignmentAction } from "@/actions/tower-system/assignment.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export function translateAssignmentError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'UNKNOWN_ERROR':
			return "Ocurrió un error desconocido. Intenta nuevamente.";
		case 'SERVER_ACTION_ERROR':
			return "Error de comunicación con el servidor.";
		case 'INVALID_DATA_FORMAT':
			return "El formato de los datos es inválido.";
		default:
			return fallbackMessage || code || "Se rechazó la solicitud debido a un error.";
	}
}

export const ASSIGNMENT_FORM_CONFIGS = {
	CREATE_ASSIGNMENT: {
		title: "Crear Nueva Asignación",
		description: "Ingresa los datos para registrar una nueva asignación de viaje a una torre.",
		submitText: "Crear Asignación",
		fields: [
			{ name: "trip_id", label: "ID del Viaje", type: "text", required: true, placeholder: "Ingrese el ID del Viaje" },
			{ name: "tower_id", label: "ID de la Tower", type: "text", required: true, placeholder: "Ingrese el ID de la Tower" },
			{ name: "status", label: "Estado", type: "text", required: true, placeholder: "Ej. PENDING, ASSIGNED" },
			{ name: "origin", label: "Origen", type: "text", required: true, placeholder: "Ubicación de origen" },
			{ name: "destination", label: "Destino", type: "text", required: true, placeholder: "Ubicación de destino" },
			{ name: "lat", label: "Latitud actual", type: "text", required: true, placeholder: "Ej. -34.6037" },
			{ name: "long", label: "Longitud actual", type: "text", required: true, placeholder: "Ej. -58.3816" },
		],
		execute: async (formData) => {
			const result = await createAssignmentAction(formData);
			if (!result.success) {
				return { success: false, message: translateAssignmentError(result.code, result.code) };
			}
			return { success: true, message: "Asignación creada exitosamente." };
		}
	},
	EDIT_ASSIGNMENT: {
	    title: "Editar Asignación",
	    description: "Modifica los datos de la asignación. Solo se actualizarán los campos que modifiques.",
	    submitText: "Guardar Cambios",
	    fields: [
	        { name: "trip_id", label: "ID del Viaje", type: "text", required: false },
	        { name: "tower_id", label: "ID de la Tower", type: "text", required: false },
	        { name: "status", label: "Estado", type: "text", required: false },
	        { name: "origin", label: "Origen", type: "text", required: false },
	        { name: "destination", label: "Destino", type: "text", required: false },
	        { name: "lat", label: "Latitud actual", type: "text", required: false },
	        { name: "long", label: "Longitud actual", type: "text", required: false },
	        { name: "deactivated", label: "Desactivada", type: "boolean", required: false },
	    ],
	    execute: async (formData, selectedIds) => {
	        if (!selectedIds || selectedIds.length === 0) return { success: false, message: "No hay asignación seleccionada." };
            if (selectedIds.length > 1) return { success: false, message: "Solo se puede editar una asignación a la vez." };

            const selectedId = selectedIds[0];
            const payload = { ...formData };
            if (payload.deactivated !== undefined) {
                payload.deactivated = payload.deactivated === 'true';
            }

	        const result = await updateAssignmentAction(selectedId, payload);
	        if (!result.success) {
	            return { success: false, message: translateAssignmentError(result.code, "No se pudo actualizar la asignación.") };
	        }
	        return { success: true, message: "Asignación actualizada exitosamente." };
	    }
	}
} satisfies Record<string, ActionStrategy>;

export type AssignmentFormAction = keyof typeof ASSIGNMENT_FORM_CONFIGS;

export interface AssignmentViewActionHandlers {
	openFormAction: (actionName: AssignmentFormAction, selectedIds?: string[]) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getAssignmentViewActions = (handlers: AssignmentViewActionHandlers): ActionDef[] => [
	{
		label: "Crear Nueva Asignación",
		variant: "primary",
		requireSelection: false,
		onAction: () => handlers.openFormAction('CREATE_ASSIGNMENT')
	},
	{
		label: "Editar Seleccionado",
		variant: "primary",
		requireSelection: true,
		onAction: (selectedIds: string[]) => {
            if (selectedIds.length > 1) {
                handlers.showMessage("Atención", "Solo puedes editar un registro a la vez.", "error");
                return Promise.resolve(null);
            }
            return handlers.openFormAction('EDIT_ASSIGNMENT', selectedIds);
        }
	},
	{
		label: "Eliminar Seleccionados",
		variant: "danger",
		requireSelection: true,
		onAction: async (selectedIds: string[]) => {
			if (!selectedIds || selectedIds.length === 0) return null;

			let successCount = 0;
			let failCount = 0;

			for (const id of selectedIds) {
				const result = await deleteAssignmentAction(id);
				if (result.success) {
					successCount++;
				} else {
					failCount++;
				}
			}

			handlers.refresh();

			if (failCount === 0) {
				handlers.showMessage("Asignaciones Eliminadas", `Se eliminaron (desactivaron) ${successCount} registros correctamente.`, "success");
			} else if (successCount === 0) {
				handlers.showMessage("Error al eliminar", `No se pudieron eliminar los ${failCount} registros seleccionados.`, "error");
			} else {
				handlers.showMessage("Eliminación Parcial", `Se eliminaron ${successCount} registros. No se pudieron eliminar ${failCount}.`, "error");
			}

			return null;
		}
	}
];
