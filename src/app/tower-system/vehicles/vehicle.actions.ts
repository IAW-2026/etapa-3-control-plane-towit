import { ActionDef } from "@/component/CardDataView";
import { createVehicleAction, updateVehicleAction, deleteVehicleAction } from "@/actions/tower-system/vehicle.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export function translateVehicleError(code?: string, fallbackMessage?: string): string {
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

export const VEHICLE_FORM_CONFIGS = {
	CREATE_VEHICLE: {
		title: "Crear Nuevo Vehículo",
		description: "Ingresa los datos para registrar un nuevo vehículo y asignarlo a un tower.",
		submitText: "Crear Vehículo",
		fields: [
			{ name: "tower_id", label: "ID de la Tower", type: "text", required: true, placeholder: "Ingrese el ID de la Tower" },
			{ name: "brand", label: "Marca", type: "text", required: true, placeholder: "Ej. Ford" },
			{ name: "model", label: "Modelo", type: "text", required: true, placeholder: "Ej. F-150" },
			{ name: "year", label: "Año", type: "number", required: true, placeholder: "Ej. 2022" },
			{ name: "max_load", label: "Carga Máxima (kg)", type: "number", required: true, placeholder: "Ej. 1500" },
		],
		execute: async (formData) => {
			const result = await createVehicleAction(formData);
			if (!result.success) {
				return { success: false, message: translateVehicleError(result.code, result.code) };
			}
			return { success: true, message: "Vehículo creado exitosamente." };
		}
	},
	EDIT_VEHICLE: {
	    title: "Editar Vehículo",
	    description: "Modifica los datos del vehículo. Solo se actualizarán los campos que modifiques.",
	    submitText: "Guardar Cambios",
	    fields: [
	        { name: "tower_id", label: "ID de la Tower", type: "text", required: false },
	        { name: "brand", label: "Marca", type: "text", required: false },
	        { name: "model", label: "Modelo", type: "text", required: false },
	        { name: "year", label: "Año", type: "number", required: false },
	        { name: "max_load", label: "Carga Máxima (kg)", type: "number", required: false },
	        { name: "deactivated", label: "Desactivado", type: "boolean", required: false },
	    ],
	    execute: async (formData, selectedIds) => {
	        if (!selectedIds || selectedIds.length === 0) return { success: false, message: "No hay vehículo seleccionado." };
            if (selectedIds.length > 1) return { success: false, message: "Solo se puede editar un vehículo a la vez." };

            const selectedId = selectedIds[0];
            const payload = { ...formData };
            if (payload.deactivated !== undefined) {
                payload.deactivated = payload.deactivated === 'true';
            }

	        const result = await updateVehicleAction(selectedId, payload);
	        if (!result.success) {
	            return { success: false, message: translateVehicleError(result.code, "No se pudo actualizar el vehículo.") };
	        }
	        return { success: true, message: "Vehículo actualizado exitosamente." };
	    }
	}
} satisfies Record<string, ActionStrategy>;

export type VehicleFormAction = keyof typeof VEHICLE_FORM_CONFIGS;

export interface VehicleViewActionHandlers {
	openFormAction: (actionName: VehicleFormAction, selectedIds?: string[]) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getVehicleViewActions = (handlers: VehicleViewActionHandlers): ActionDef[] => [
	{
		label: "Crear Nuevo Vehículo",
		variant: "primary",
		requireSelection: false,
		onAction: () => handlers.openFormAction('CREATE_VEHICLE')
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
            return handlers.openFormAction('EDIT_VEHICLE', selectedIds);
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
				const result = await deleteVehicleAction(id);
				if (result.success) {
					successCount++;
				} else {
					failCount++;
				}
			}

			handlers.refresh();

			if (failCount === 0) {
				handlers.showMessage("Vehículos Eliminados", `Se eliminaron (desactivaron) ${successCount} registros correctamente.`, "success");
			} else if (successCount === 0) {
				handlers.showMessage("Error al eliminar", `No se pudieron eliminar los ${failCount} registros seleccionados.`, "error");
			} else {
				handlers.showMessage("Eliminación Parcial", `Se eliminaron ${successCount} registros. No se pudieron eliminar ${failCount}.`, "error");
			}

			return null;
		}
	}
];
