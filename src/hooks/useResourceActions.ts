import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormFieldDef } from "@/component/FormModal";

export interface ActionStrategy {
	title: string;
	description: string;
	submitText: string;
	fields: FormFieldDef[];
	execute: (formData: Record<string, any>) => Promise<{ success: boolean; message: string }>;
}

export function useResourceActions<TAction extends string>(
	strategies: Record<Exclude<TAction, null>, ActionStrategy>
) {
	const router = useRouter();
	const [activeForm, setActiveForm] = useState<TAction | null>(null);
	const promiseResolver = useRef<((value: { success: boolean; message: string } | null) => void) | null>(null);

	const [messageState, setMessageState] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		type: 'success' | 'error';
	}>({ isOpen: false, title: '', message: '', type: 'success' });

	const showMessage = (title: string, message: string, type: 'success' | 'error') => {
		setMessageState({ isOpen: true, title, message, type });
	};

	const closeMessage = () => setMessageState(prev => ({ ...prev, isOpen: false }));

	const openFormAction = (actionName: TAction) => {
		setActiveForm(actionName);
		return new Promise<{ success: boolean; message: string } | null>((resolve) => {
			promiseResolver.current = resolve;
		});
	};

	const closeModal = () => {
		setActiveForm(null);
		if (promiseResolver.current) {
			promiseResolver.current(null); // Cancelación silenciosa
			promiseResolver.current = null;
		}
	};

	const handleFormSubmit = async (formData: Record<string, any>) => {
		if (!activeForm) return { success: false, message: "Acción inválida" };

		// Ejecutamos la lógica específica de la acción seleccionada
		const result = await strategies[activeForm as Exclude<TAction, null>].execute(formData);

		if (result.success && promiseResolver.current) {
			promiseResolver.current({ success: true, message: result.message });
			promiseResolver.current = null;
		}
		return result;
	};

	// Construimos la configuración visual que el modal necesita ahora mismo
	const currentModalConfig = activeForm ? strategies[activeForm as Exclude<TAction, null>] : null;

	return {
		isModalOpen: activeForm !== null,
		modalConfig: currentModalConfig,
		messageState,
		showMessage,
		closeMessage,
		refresh: router.refresh,
		openFormAction,
		closeModal,
		handleFormSubmit
	};
}
