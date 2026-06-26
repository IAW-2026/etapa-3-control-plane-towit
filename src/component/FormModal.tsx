"use client"

import React, { useEffect, useState } from 'react';

export type FormFieldType = 'text' | 'number' | 'email' | 'boolean';

export interface FormFieldDef {
	name: string;
	label: string;
	type: FormFieldType;
	required?: boolean;
	placeholder?: string;
}

interface DynamicFormModalProps {
	isOpen: boolean;
	title: string;
	description?: string;
	fields: FormFieldDef[];
	submitText?: string;
	onSubmit: (formData: Record<string, any>) => Promise<{ success: boolean; message: string }>;
	onClose: () => void;
	initialData?: Record<string, string>;
}

export default function DynamicFormModal({
	isOpen,
	title,
	description,
	fields,
	submitText = "Guardar",
	onSubmit,
	onClose,
	initialData
}: DynamicFormModalProps) {
	const [formData, setFormData] = useState<Record<string, string>>(initialData || {});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Bloquear scroll cuando está abierto
	useEffect(() => {
		if (isOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = 'unset';
		return () => { document.body.style.overflow = 'unset'; }
	}, [isOpen]);

	// Resetear el formulario al abrir/cerrar o si initialData cambia
	useEffect(() => {
		if (isOpen) {
			setFormData(initialData || {});
			setErrorMsg(null);
		}
	}, [isOpen, initialData]);

	if (!isOpen) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrorMsg(null);

		try {
			const result = await onSubmit(formData);
			if (result.success) {
				onClose();
			} else {
				setErrorMsg(result.message);
			}
		} catch (err) {
			setErrorMsg("Ocurrió un error inesperado al procesar la solicitud.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
			{/* Fondo oscuro con Blur (Reutilizando tu estilo) */}
			<div
				className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
				onClick={!isSubmitting ? onClose : undefined}
			></div>

			{/* Contenedor del Modal */}
			<div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

				<div className="mb-6">
					<h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
					{description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
				</div>

				{errorMsg && (
					<div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
						{errorMsg}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{fields.map((field) => (
						<div key={field.name} className="flex flex-col gap-1.5">
							{field.type === 'boolean' ? (
								<div className="flex items-center justify-between mt-2 mb-1">
									<label htmlFor={field.name} className="text-sm font-semibold text-slate-700">
										{field.label} {field.required && <span className="text-rose-500">*</span>}
									</label>
									<button
										type="button"
										role="switch"
										aria-checked={formData[field.name] === 'true'}
										disabled={isSubmitting}
										onClick={() => setFormData(prev => ({ ...prev, [field.name]: prev[field.name] === 'true' ? 'false' : 'true' }))}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${formData[field.name] === 'true' ? 'bg-indigo-600' : 'bg-slate-200'} disabled:opacity-50`}
									>
										<span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData[field.name] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
									</button>
								</div>
							) : (
								<>
									<label htmlFor={field.name} className="text-sm font-semibold text-slate-700">
										{field.label} {field.required && <span className="text-rose-500">*</span>}
									</label>
									<input
										id={field.name}
										name={field.name}
										type={field.type}
										required={field.required}
										placeholder={field.placeholder}
										value={formData[field.name] || ''}
										onChange={handleChange}
										disabled={isSubmitting}
										className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors disabled:opacity-50"
									/>
								</>
							)}
						</div>
					))}

					<div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all disabled:opacity-50"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center"
						>
							{isSubmitting ? "Procesando..." : submitText}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}