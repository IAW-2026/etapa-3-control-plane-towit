"use server"

import { revalidatePath } from "next/cache";

export async function createDisbursementAction(formData: Record<string, any>) {
    try {
        const baseUrl = process.env.PAYMENTS_SYSTEM_URL;
        if (!baseUrl) throw new Error("Incomplete server configuration.");

        // Adaptamos los nombres de los campos del formulario al contrato de la API
        const payload = {
            tripId: formData.trip_id,
            clerkId: formData.id_user,
            feePercentage: Number(formData.platform_fee), // Mapeado desde el input del formulario
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
            return { 
                success: false, 
                message: errorData?.error || "The payment system rejected the request." 
            };
        }


        return { success: true, message: "Disbursement created successfully." };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, message: "Failed to communicate with the server." };
    }
}