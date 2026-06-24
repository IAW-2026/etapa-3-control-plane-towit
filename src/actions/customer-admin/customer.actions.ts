"use server"

import { revalidatePath } from "next/cache";

const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL || "https://towit-customerview.vercel.app";
const API_SECRET = process.env.INTERNAL_API_SECRET || "";

export async function toggleCustomerStatusAction(customerId: number) {
	try {
		// 1. GET current customer status
		const getRes = await fetch(`${CUSTOMER_APP_URL}/api/admin/customers?search=id:${customerId}`, {
			headers: { 'x-api-key': API_SECRET },
			cache: 'no-store',
		});

		if (!getRes.ok) {
			const errorData = await getRes.json().catch(() => null);
			return {
				ok: false,
				data: { code: "CUSTOMER_NOT_FOUND", error: errorData?.error || "No se pudo obtener el cliente." }
			};
		}

		const { data: customers } = await getRes.json();
		const current = customers?.[0];

		if (!current) {
			return {
				ok: false,
				data: { code: "CUSTOMER_NOT_FOUND", error: "El cliente seleccionado no existe." }
			};
		}

		// 2. PATCH with the opposite status
		const newStatus = !current.isActive;

		const patchRes = await fetch(`${CUSTOMER_APP_URL}/api/admin/customers/${customerId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': API_SECRET,
			},
			body: JSON.stringify({ isActive: newStatus }),
		});

		const patchData = await patchRes.json().catch(() => null);

		if (!patchRes.ok) {
			return {
				ok: false,
				data: { code: "PATCH_FAILED", error: patchData?.error || "Error al actualizar el estado del cliente." }
			};
		}

		revalidatePath('/customer-admin/customers');

		return {
			ok: true,
			data: { isActive: newStatus }
		};

	} catch (error) {
		console.error("[toggleCustomerStatusAction] Error:", error);
		return {
			ok: false,
			data: { code: "SERVER_ACTION_ERROR", error: "Fallo en la ejecución del servidor." }
		};
	}
}
