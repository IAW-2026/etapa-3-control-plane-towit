"use server"

import { revalidatePath } from "next/cache";
import { ActionResponse, ActionErrorCode } from "./types";

export async function createDisbursementAction(formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.PAYMENTS_SYSTEM_URL;
        if (!baseUrl) return { success: false, code: 'SERVER_ERROR' };

        const payload = {
            tripId: formData.trip_id,
            clerkId: formData.clerk_id,
            feePercentage: Number(formData.platform_fee), 
        };

        const response = await fetch(`${baseUrl}/api/disbursements/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET || ''}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const rawMessage = errorData?.error || "";
            let code: ActionErrorCode = 'UNKNOWN_ERROR';
            
            if (response.status === 400) {
                code = 'VALIDATION_ERROR';
            } else if (response.status === 401) {
                code = 'NOT_AUTHORIZED';
            } else if (response.status === 403) {
                if (rawMessage.startsWith("User is banned")) code = 'USER_BANNED';
                else code = 'NOT_AUTHORIZED';
            } else if (response.status === 404) {
                code = 'NOT_FOUND';
            } else if (response.status >= 500) {
                code = 'SERVER_ERROR';
            }
            
            return { success: false, code };
        }

        revalidatePath('/payment-system/disbursements');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function deleteDisbursementAction(transactionId: string): Promise<ActionResponse> {
    try {
        const secret = process.env.INTERNAL_API_SECRET;
        const baseUrl = process.env.PAYMENTS_SYSTEM_URL || '';

        const res = await fetch(`${baseUrl}/api/disbursements/${transactionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${secret}`
            }
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            let code: ActionErrorCode = data.code;
            
            if (!code) {
                if (res.status === 400) code = 'VALIDATION_ERROR';
                else if (res.status === 401 || res.status === 403) code = 'NOT_AUTHORIZED';
                else if (res.status === 404) code = 'DISBURSEMENT_NOT_FOUND';
                else if (res.status >= 500) code = 'SERVER_ERROR';
                else code = 'UNKNOWN_ERROR';
            }

            return { success: false, code };
        }
        
        return { success: true };
    } catch (error) {
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}