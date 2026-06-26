import { ActionDef } from "@/component/CardDataView";
import { createAdminAction, updateAdminAction, deleteAdminAction } from "@/actions/tower-system/admin.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export function translateAdminError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'UNKNOWN_ERROR':
			return "Ocurrió un error desconocido. Intenta nuevamente.";
		case 'SERVER_ACTION_ERROR':
			return "Error de comunicación con el servidor.";
		default:
			return fallbackMessage || code || "Se rechazó la solicitud debido a un error.";
	}
}

export const ADMIN_FORM_CONFIGS = {
	CREATE_ADMIN: {
		title: "Crear Nuevo Administrador",
		description: "Ingresa los datos para registrar un nuevo administrador.",
		submitText: "Crear Administrador",
		fields: [
			{ name: "firstName", label: "Nombre", type: "text", required: true, placeholder: "Juan" },
			{ name: "lastName", label: "Apellido", type: "text", required: true, placeholder: "Pérez" },
			{ name: "emailAddress", label: "Email", type: "text", required: true, placeholder: "juan@example.com" },
			{ name: "password", label: "Contraseña", type: "text", required: true, placeholder: "Mínimo 8 caracteres" },
		],
		execute: async (formData) => {
			const result = await createAdminAction(formData);
			if (!result.success) {
				return { success: false, message: translateAdminError(result.code, result.code) };
			}
			return { success: true, message: "Administrador creado exitosamente." };
		}
	},
	EDIT_ADMIN: {
	    title: "Editar Administrador",
	    description: "Modifica los datos del administrador. Solo se actualizarán los campos que modifiques.",
	    submitText: "Guardar Cambios",
	    fields: [
	        { name: "full_name", label: "Nombre Completo", type: "text", required: false, placeholder: "Juan Pérez" },
	        { name: "email", label: "Email", type: "text", required: false, placeholder: "juan@example.com" },
	        { name: "deactivated", label: "Usuario Desactivado", type: "boolean", required: false },
	    ],
	    execute: async (formData, selectedIds) => {
	        if (!selectedIds || selectedIds.length === 0) return { success: false, message: "No hay administrador seleccionado." };
            if (selectedIds.length > 1) return { success: false, message: "Solo se puede editar un administrador a la vez." };

            const selectedId = selectedIds[0];
            const payload = { ...formData };
            if (payload.deactivated !== undefined) {
                payload.deactivated = payload.deactivated === 'true';
            }

	        const result = await updateAdminAction(selectedId, payload);
	        if (!result.success) {
	            return { success: false, message: translateAdminError(result.code, "No se pudo actualizar el administrador.") };
	        }
	        return { success: true, message: "Administrador actualizado exitosamente." };
	    }
	}
} satisfies Record<string, ActionStrategy>;

export type AdminFormAction = keyof typeof ADMIN_FORM_CONFIGS;

export interface AdminViewActionHandlers {
	openFormAction: (actionName: AdminFormAction, selectedIds?: string[]) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getAdminViewActions = (handlers: AdminViewActionHandlers): ActionDef[] => [
	{
		label: "Crear Nuevo Administrador",
		variant: "primary",
		requireSelection: false,
		onAction: () => handlers.openFormAction('CREATE_ADMIN')
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
            return handlers.openFormAction('EDIT_ADMIN', selectedIds);
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
				const result = await deleteAdminAction(id);
				if (result.success) {
					successCount++;
				} else {
					failCount++;
				}
			}

			handlers.refresh();

			if (failCount === 0) {
				handlers.showMessage("Administradores Eliminados", `Se eliminaron (desactivaron) ${successCount} administradores correctamente.`, "success");
			} else if (successCount === 0) {
				handlers.showMessage("Error al eliminar", `No se pudieron eliminar los ${failCount} administradores seleccionados.`, "error");
			} else {
				handlers.showMessage("Eliminación Parcial", `Se eliminaron ${successCount} administradores. No se pudieron eliminar ${failCount}.`, "error");
			}

			return null;
		}
	}
];
