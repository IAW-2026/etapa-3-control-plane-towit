"use server"

import { revalidatePath } from "next/cache";
import { ActionResponse, ActionErrorCode } from "./types";

export async function createPaymentAction(formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.PAYMENTS_SYSTEM_URL;
        if (!baseUrl) return { success: false, code: 'SERVER_ERROR' };

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
            const code: ActionErrorCode = errorData?.code || 'UNKNOWN_ERROR';
            console.log("status:", response.status, " errorData:", errorData)

            return { success: false, code };
        }


        revalidatePath('/payment-system/payments');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function deletePaymentAction(transactionId: string): Promise<ActionResponse> {
    try {
        const secret = process.env.INTERNAL_API_SECRET;
        const baseUrl = process.env.PAYMENTS_SYSTEM_URL || '';

        const res = await fetch(`${baseUrl}/api/payments/${transactionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${secret}`
            }
        });



        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.log("status:", res.status, " data:", data)
            return { success: false, code: data?.code || 'UNKNOWN_ERROR' };
        }

        return { success: true };
    } catch (error) {
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}