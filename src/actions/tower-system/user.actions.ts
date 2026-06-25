"use server"

import { revalidatePath } from "next/cache";

export type ActionErrorCode = string;

export interface ActionResponse {
    success: boolean;
    code?: ActionErrorCode;
    data?: any;
}

export async function getUsersAction(page: number = 1, limit: number = 10): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/tower/towers`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.INTERNAL_API_SECRET || ''
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return { success: false, code: errorData?.error || 'UNKNOWN_ERROR' };
        }

        const allUsers = (await response.json()).data;

        if (!Array.isArray(allUsers)) {
            return { success: false, code: 'INVALID_DATA_FORMAT' };
        }

        // Pagination
        const totalItems = allUsers.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Ensure page is within bounds
        const currentPage = Math.max(1, Math.min(page, totalPages || 1));
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedUsers = allUsers.slice(startIndex, endIndex);

        return {
            success: true,
            data: {
                users: paginatedUsers,
                meta: {
                    total: totalItems,
                    page: currentPage,
                    limit,
                    totalPages
                }
            }
        };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function createUserAction(formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000"; // Adjust to the actual internal base URL

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            emailAddress: formData.emailAddress,
            password: formData.password,
        };

        const response = await fetch(`${baseUrl}/api/tower/towers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.INTERNAL_API_SECRET || ''
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return { success: false, code: errorData?.error || 'UNKNOWN_ERROR' };
        }

        revalidatePath('/tower-system/users');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function updateUserAction(towerId: string, formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const payload: Record<string, any> = {};
        if (formData.full_name) payload.full_name = formData.full_name;
        if (formData.email) payload.email = formData.email;
        if (formData.payments_alias !== undefined) payload.payments_alias = formData.payments_alias;
        if (formData.deactivated !== undefined) payload.deactivated = formData.deactivated;

        const response = await fetch(`${baseUrl}/api/tower/towers/${towerId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.INTERNAL_API_SECRET || ''
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return { success: false, code: errorData?.error || 'UNKNOWN_ERROR' };
        }

        revalidatePath('/tower-system/users');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function deleteUserAction(towerId: string): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/tower/towers/${towerId}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': process.env.INTERNAL_API_SECRET || ''
            }
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            return { success: false, code: data?.error || 'UNKNOWN_ERROR' };
        }

        revalidatePath('/tower-system/users');
        return { success: true };
    } catch (error) {
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}
