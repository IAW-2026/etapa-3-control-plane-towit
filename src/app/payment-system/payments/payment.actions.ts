import { ActionDef } from "@/component/CardDataView";
import { createPaymentAction, deletePaymentAction } from "@/actions/payment-system/payment.actions";
import { ActionStrategy } from "@/hooks/useResourceActions";

export function translatePaymentError(code?: string, fallbackMessage?: string): string {
	switch (code) {
		case 'USER_BANNED':
			return "Acción denegada: El usuario involucrado se encuentra baneado del sistema.";
		case 'NOT_AUTHORIZED':
			return "Error de autenticación interna con el sistema de pagos.";
		case 'VALIDATION_ERROR':
			return "Los datos de pago proporcionados no son válidos.";
		case 'NOT_FOUND':
		case 'PAYMENT_NOT_FOUND':
			return "El pago especificado no existe o ya ha sido procesado/cancelado.";
		case 'ACTIVE_DISBURSEMENT_EXISTS':
			return "Acción denegada: Existe un desembolso activo asociado a este pago. Debes revertir el desembolso primero.";
		case 'ACTIVE_REFUND_EXISTS':
			return "Acción denegada: Ya existe un reembolso procesado para este pago. Reviértelo primero.";
		case 'ACTIVE_PAYMENT_EXISTS':
			return "Acción denegada: Ya existe un pago registrado para este viaje.";
		case 'DATABASE_ERROR':
			return "Ocurrió un error interno en la base de datos de pagos.";
		case 'SERVER_ERROR':
		case 'SERVER_ACTION_ERROR':
			return "Error en el servidor al procesar la solicitud.";
		default:
			return fallbackMessage || "El sistema de pagos rechazó la solicitud debido a un error desconocido.";
	}
}

/**
 * PAYMENT_FORM_CONFIGS
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
export const PAYMENT_FORM_CONFIGS = {
	CREATE_PAYMENT: {
		title: "Generar Nuevo Pago",
		description: "Ingresa los datos para forzar la creación de un registro de pago.",
		submitText: "Crear Pago",
		// Definición declarativa de los campos que el formulario dinámico renderizará.
		fields: [
			{ name: "trip_id", label: "ID del Viaje", type: "text", required: true, placeholder: "TRIP-12345" },
			{ name: "clerk_id", label: "ID de clerk del Usuario", type: "text", required: true, placeholder: "Ej: user_2Q..." },
			{ name: "amount", label: "Monto", type: "number", required: true, placeholder: "0.00" },
		],
		// Función adaptadora que se encarga de mandar los datos recopilados al backend/Server Action.
		execute: async (formData) => {
			const result = await createPaymentAction(formData);
			if (!result.success) {
				return { success: false, message: translatePaymentError(result.code, "No se pudo crear el pago.") };
			}
			return { success: true, message: "Pago generado exitosamente." };
		}
	},
} satisfies Record<string, ActionStrategy>;

export type PaymentFormAction = keyof typeof PAYMENT_FORM_CONFIGS;

export interface PaymentViewActionHandlers {
	openFormAction: (actionName: PaymentFormAction) => Promise<any>;
	refresh: () => void;
	showMessage: (title: string, message: string, type: 'success' | 'error') => void;
}

/**
 * getPaymentViewActions
 * -----------------
 * Define los botones o disparadores que aparecerán de manera visual en la interfaz de usuario (UI), 
 * comúnmente en barras de herramientas o menús de acciones de filas (como en tu CardDataView).
 * 
 * Diferencia clave vs. PAYMENT_FORM_CONFIGS:
 * - `getPaymentViewActions` le dice a la vista **qué botones renderizar** y **qué ejecutar inicialmente al hacer clic**.
 * - `PAYMENT_FORM_CONFIGS` le dice al sistema **cómo construir un formulario de datos** en caso de que 
 *   uno de estos botones de la vista necesite abrir uno.
 * 
 * Tipos de acciones definidas aquí:
 * 1. Acciones Complejas (ej. Crear): El botón no ejecuta la mutación directamente. Simplemente llama 
 *    a `openFormAction('CREATE_PAYMENT')`, lo que puentea hacia las configuraciones para mostrar el formulario.
 * 2. Acciones Simples (ej. Eliminar): Como no necesitan datos adicionales, pueden ejecutar la Server 
 *    Action directamente (`deletePaymentAction`), gestionando localmente los Side Effects (alertas, refresh).
 *
 * @param handlers - Funciones provistas por el componente padre para controlar Side Effects (UI: Toasts, Modales, Refresh).
 * @returns {ActionDef[]} Arreglo de definiciones para el componente de UI encargado de mapear los botones.
 */
export const getPaymentViewActions = (handlers: PaymentViewActionHandlers): ActionDef[] => [
	{
		label: "Generar nuevo pago",
		variant: "primary",
		// No requiere que el usuario seleccione una fila/registro específico en la tabla.
		requireSelection: false,
		// Al hacer clic, delega a la configuración de formulario 'CREATE_PAYMENT' definida más arriba.
		onAction: () => handlers.openFormAction('CREATE_PAYMENT')
	},
	{
		label: "Eliminar pago seleccionado",
		variant: "danger",
		// Habilita el botón *solo* cuando el usuario haya seleccionado una o más entidades de la vista de tabla.
		requireSelection: true,
		// Al hacer clic, ejecuta la eliminación de forma directa porque no necesitamos pedirle más datos al usuario.
		onAction: async (selectedIds: string[]) => {
			if (selectedIds.length === 0) return null;

			const result = await deletePaymentAction(selectedIds[0]);

			// Manejo de Side Effects local del cliente.
			if (result.success) {
				handlers.showMessage("Pago Eliminado", "El pago se canceló correctamente.", "success");
				handlers.refresh(); // Refresca los datos en la tabla (invalida el query/estado local).
			} else {
				const errorMsg = translatePaymentError(result.code, "No se pudo eliminar el pago.");
				handlers.showMessage("Error al eliminar", errorMsg, "error");
			}

			return null;
		}
	}
];
