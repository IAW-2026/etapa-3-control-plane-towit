"use server"

import { revalidatePath } from "next/cache";

const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL || "https://towit-customerview.vercel.app";
const API_SECRET = process.env.INTERNAL_API_SECRET || "";

export async function toggleCustomerStatusAction(customerId: number, isActive: boolean, clerkId?: string) {
	try {
		const patchRes = await fetch(`${CUSTOMER_APP_URL}/api/admin/customers/${customerId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': API_SECRET,
			},
			body: JSON.stringify({ isActive }),
		});

		const patchData = await patchRes.json().catch(() => null);

		if (!patchRes.ok) {
			return {
				ok: false,
				data: { code: "PATCH_FAILED", error: patchData?.error || "Error al actualizar el estado del cliente." }
			};
		}

		if (clerkId) {
			const paymentsUrl = process.env.PAYMENTS_SYSTEM_URL;
			if (paymentsUrl) {
				fetch(`${paymentsUrl}/api/users`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${API_SECRET}`
					},
					body: JSON.stringify({ clerkId, isBanned: !isActive })
				}).catch(e => console.error("[toggleCustomerStatusAction] Error notifying payments system:", e));
			}
		}

		revalidatePath('/customer-admin/customers');

		return {
			ok: true,
			data: { isActive }
		};

	} catch (error) {
		console.error("[toggleCustomerStatusAction] Error:", error);
		return {
			ok: false,
			data: { code: "SERVER_ACTION_ERROR", error: "Fallo en la ejecución del servidor." }
		};
	}
}
