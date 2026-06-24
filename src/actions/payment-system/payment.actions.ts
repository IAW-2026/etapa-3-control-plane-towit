"use server"

import { revalidatePath } from "next/cache";

export async function createPaymentAction(formData: Record<string, any>) {
    try {
        const baseUrl = process.env.PAYMENTS_SYSTEM_URL;
        if (!baseUrl) throw new Error("Incomplete server configuration.");

        const payload = {
            tripId: formData.trip_id,
            clerkId: formData.clerk_id,
            amount: Number(formData.amount),
        };

        const response = await fetch(`${baseUrl}/api/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET || ''}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                success: false,
                message: errorData?.error || "The payment system rejected the request."
            };
        }

        revalidatePath('/payment-system/payments');
        return { success: true, message: "Payment created successfully." };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, message: "Failed to communicate with the server." };
    }
}

export async function deletePaymentAction(transactionId: string) {
    try {
        const secret = process.env.INTERNAL_API_SECRET;
        const baseUrl = process.env.PAYMENTS_SYSTEM_URL || '';

        const res = await fetch(`${baseUrl}/api/payments/${transactionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${secret}`
            }
        });

        const data = await res.json();

        // Devolvemos un objeto plano serializable para el Client Component
        return {
            ok: res.ok,
            data
        };
    } catch (error) {
        return {
            ok: false,
            data: { code: "SERVER_ACTION_ERROR", error: "Fallo en la ejecución del servidor." }
        };
    }
}