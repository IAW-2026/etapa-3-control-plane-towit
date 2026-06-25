import { ActionDef } from "@/component/CardDataView";
import { createUserAction, updateUserAction, deleteUserAction } from "@/actions/tower-system/user.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export function translateUserError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'UNKNOWN_ERROR':
			return "Ocurrió un error desconocido. Intenta nuevamente.";
		case 'SERVER_ACTION_ERROR':
			return "Error de comunicación con el servidor.";
		default:
			return fallbackMessage || code || "Se rechazó la solicitud debido a un error.";
	}
}

export const USER_FORM_CONFIGS = {
	CREATE_USER: {
		title: "Crear Nuevo Gruista",
		description: "Ingresa los datos para registrar un nuevo gruista (Tower).",
		submitText: "Crear Gruista",
		fields: [
			{ name: "firstName", label: "Nombre", type: "text", required: true, placeholder: "Juan" },
			{ name: "lastName", label: "Apellido", type: "text", required: true, placeholder: "Pérez" },
			{ name: "emailAddress", label: "Email", type: "text", required: true, placeholder: "juan@example.com" },
			{ name: "password", label: "Contraseña", type: "text", required: true, placeholder: "Mínimo 8 caracteres" },
		],
		execute: async (formData) => {
			const result = await createUserAction(formData);
			if (!result.success) {
				return { success: false, message: translateUserError(result.code, result.code) };
			}
			return { success: true, message: "Gruista creado exitosamente." };
		}
	},
	EDIT_USER: {
	    title: "Editar Gruista",
	    description: "Modifica los datos del gruista. Solo se actualizarán los campos que modifiques.",
	    submitText: "Guardar Cambios",
	    fields: [
	        { name: "full_name", label: "Nombre Completo", type: "text", required: false, placeholder: "Juan Pérez" },
	        { name: "email", label: "Email", type: "text", required: false, placeholder: "juan@example.com" },
	        { name: "payments_alias", label: "Alias de Pago", type: "text", required: false, placeholder: "alias.mp" },
	        { name: "deactivated", label: "Usuario Desactivado", type: "boolean", required: false },
	    ],
	    execute: async (formData, selectedIds) => {
	        if (!selectedIds || selectedIds.length === 0) return { success: false, message: "No hay gruista seleccionado." };
            if (selectedIds.length > 1) return { success: false, message: "Solo se puede editar un gruista a la vez." };

            const selectedId = selectedIds[0];
            const payload = { ...formData };
            if (payload.deactivated !== undefined) {
                payload.deactivated = payload.deactivated === 'true';
            }

	        const result = await updateUserAction(selectedId, payload);
	        if (!result.success) {
	            return { success: false, message: translateUserError(result.code, "No se pudo actualizar el gruista.") };
	        }
	        return { success: true, message: "Gruista actualizado exitosamente." };
	    }
	}
} satisfies Record<string, ActionStrategy>;

export type UserFormAction = keyof typeof USER_FORM_CONFIGS;

export interface UserViewActionHandlers {
	openFormAction: (actionName: UserFormAction, selectedIds?: string[]) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

export const getUserViewActions = (handlers: UserViewActionHandlers): ActionDef[] => [
	{
		label: "Crear Nuevo Gruista",
		variant: "primary",
		requireSelection: false,
		onAction: () => handlers.openFormAction('CREATE_USER')
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
            return handlers.openFormAction('EDIT_USER', selectedIds);
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
				const result = await deleteUserAction(id);
				if (result.success) {
					successCount++;
				} else {
					failCount++;
				}
			}

			handlers.refresh();

			if (failCount === 0) {
				handlers.showMessage("Gruistas Eliminados", `Se eliminaron (desactivaron) ${successCount} usuarios correctamente.`, "success");
			} else if (successCount === 0) {
				handlers.showMessage("Error al eliminar", `No se pudieron eliminar los ${failCount} usuarios seleccionados.`, "error");
			} else {
				handlers.showMessage("Eliminación Parcial", `Se eliminaron ${successCount} usuarios. No se pudieron eliminar ${failCount}.`, "error");
			}

			return null;
		}
	}
];
