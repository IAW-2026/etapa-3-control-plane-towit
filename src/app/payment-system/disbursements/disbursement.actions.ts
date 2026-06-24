import { ActionDef } from "@/component/CardDataView";
import { createDisbursementAction, deleteDisbursementAction } from "@/actions/payment-system/disbursement.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export function translateDisbursementError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'USER_BANNED':
			return "Acción denegada: El conductor involucrado se encuentra baneado del sistema.";
		case 'NOT_AUTHORIZED':
			return "Error de autenticación interna con el sistema de pagos.";
		case 'VALIDATION_ERROR':
			return "Los datos de la liquidación proporcionados no son válidos.";
		case 'NOT_FOUND':
		case 'DISBURSEMENT_NOT_FOUND':
			return "La liquidación especificada no existe o ya ha sido cancelada previamente.";
		case 'ACTIVE_REFUND_EXISTS':
			return "Acción denegada: Existe un reembolso activo para este viaje. No se puede generar liquidación.";
		case 'ACTIVE_DISBURSEMENT_EXISTS':
			return "Acción denegada: Ya existe una liquidación activa para este viaje. No se puede generar otra liquidación.";
		case 'ACTIVE_PAYMENT_EXISTS':
			return "Acción denegada: Existe un pago activo que entra en conflicto con esta liquidación.";
		case 'DATABASE_ERROR':
			return "Ocurrió un error interno en la base de datos de liquidaciones.";
		case 'SERVER_ERROR':
		case 'SERVER_ACTION_ERROR':
			return "Error en el servidor al procesar la solicitud.";
		case 'PAYMENT_NOT_FOUND':
			return "Acción denegada: No se encontró un pago hecho asociado al viaje.";
		default:
			return fallbackMessage || "El sistema de pagos rechazó la solicitud debido a un error desconocido.";
	}
}

/**
 * DISBURSEMENT_FORM_CONFIGS
 * -------------------------
 * Define las "configuraciones" para aquellas acciones que requieren la entrada de datos del usuario
 * a través de un formulario dinámico (generalmente renderizado en un componente modal o drawer).
 * 
 * ¿Por qué usamos esto?
 * En una arquitectura limpia, en lugar de crear un formulario de React estático para cada posible acción 
 * (lo que no es escalable), definimos de forma declarativa un "esquema" de lo que necesita la acción.
 * Un hook genérico (como useResourceActions) leerá este esquema para auto-generar la interfaz (los inputs),
 * recoger el estado de esos campos y finalmente llamar a la función `execute` con esos datos (formData).
 * 
 * Flujo: Botón UI abre Modal -> Lee la configuración -> Renderiza los `fields` -> Usuario envía -> Llama a `execute()`.
 */
export const DISBURSEMENT_FORM_CONFIGS = {
	CREATE_DISBURSEMENT: {
		title: "Generar Nueva Liquidación",
		description: "Ingresa los datos para registrar manualmente una liquidación a favor de un conductor.",
		submitText: "Crear Liquidación",
		// Definición declarativa de los campos que el formulario dinámico renderizará.
		fields: [
			{ name: "trip_id", label: "ID del Viaje", type: "text", required: true, placeholder: "TRIP-12345" },
			{ name: "clerk_id", label: "ID de clerk del Conductor", type: "text", required: true, placeholder: "Ej: user_2Q..." },
			{ name: "platform_fee", label: "Comisión de Plataforma", type: "number", required: true, placeholder: "0.00" },
		],
		// Función adaptadora que se encarga de mandar los datos recopilados al backend/Server Action.
		execute: async (formData) => {
			const result = await createDisbursementAction(formData);
			if (!result.success) {
				return { success: false, message: translateDisbursementError(result.code, "No se pudo crear la liquidación.") };
			}
			return { success: true, message: "Liquidación generada exitosamente." };
		}
	},
} satisfies Record<string, ActionStrategy>;

export type DisbursementFormAction = keyof typeof DISBURSEMENT_FORM_CONFIGS;

export interface DisbursementViewActionHandlers {
	openFormAction: (actionName: DisbursementFormAction) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

/**
 * getDisbursementViewActions
 * -----------------
 * Define los botones o disparadores que aparecerán de manera visual en la interfaz de usuario (UI), 
 * comúnmente en barras de herramientas o menús de acciones de filas (como en tu CardDataView).
 * 
 * Diferencia clave vs. DISBURSEMENT_FORM_CONFIGS:
 * - `getDisbursementViewActions` le dice a la vista **qué botones renderizar** y **qué ejecutar inicialmente al hacer clic**.
 * - `DISBURSEMENT_FORM_CONFIGS` le dice al sistema **cómo construir un formulario de datos** en caso de que 
 *   uno de estos botones de la vista necesite abrir uno.
 * 
 * Tipos de acciones definidas aquí:
 * 1. Acciones Complejas (ej. Crear): El botón no ejecuta la mutación directamente. Simplemente llama 
 *    a `openFormAction('CREATE_DISBURSEMENT')`, lo que puentea hacia las configuraciones para mostrar el formulario.
 * 2. Acciones Simples (ej. Eliminar): Como no necesitan datos adicionales, pueden ejecutar la Server 
 *    Action directamente, gestionando localmente los Side Effects (alertas, refresh).
 *
 * @param handlers - Funciones provistas por el componente padre para controlar Side Effects (UI: Toasts, Modales, Refresh).
 * @returns {ActionDef[]} Arreglo de definiciones para el componente de UI encargado de mapear los botones.
 */
export const getDisbursementViewActions = (handlers: DisbursementViewActionHandlers): ActionDef[] => [
	{
		label: "Generar nueva liquidación",
		variant: "primary",
		// No requiere que el usuario seleccione una fila/registro específico en la tabla.
		requireSelection: false,
		// Al hacer clic, delega a la configuración de formulario 'CREATE_DISBURSEMENT' definida más arriba.
		onAction: () => handlers.openFormAction('CREATE_DISBURSEMENT')
	},

	{
		label: "Eliminar liquidación seleccionada",
		variant: "danger",
		requireSelection: true,
		onAction: async (selectedId: string | null) => {
			if (!selectedId) return null;

			const result = await deleteDisbursementAction(selectedId);

			// Manejo de Side Effects local del cliente.
			if (result.success) {
				handlers.showMessage("Liquidación Eliminada", "La liquidación se eliminó correctamente.", "success");
				handlers.refresh(); // Refresca los datos en la tabla (invalida el query/estado local).
			} else {
				const errorMsg = translateDisbursementError(result.code, "No se pudo eliminar la liquidación.");
				handlers.showMessage("Error al eliminar", errorMsg, "error");
			}

			return null;
		}
	}
];
