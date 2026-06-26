"use server"

import { revalidatePath } from "next/cache";

export type ActionErrorCode = string;

export interface ActionResponse {
    success: boolean;
    code?: ActionErrorCode;
    data?: any;
}

export async function getUsersAction(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    status?: string,
    sort?: string
): Promise<ActionResponse> {
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

        let allUsers = (await response.json()).data;

        if (!Array.isArray(allUsers)) {
            return { success: false, code: 'INVALID_DATA_FORMAT' };
        }

        // Apply filters
        if (status === 'ACTIVE') {
            allUsers = allUsers.filter((u: any) => !u.deactivated);
        } else if (status === 'DEACTIVATED') {
            allUsers = allUsers.filter((u: any) => u.deactivated);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            allUsers = allUsers.filter((u: any) => 
                (u.full_name && u.full_name.toLowerCase().includes(searchLower)) ||
                (u.email && u.email.toLowerCase().includes(searchLower)) ||
                (u.clerk_id && u.clerk_id.toLowerCase().includes(searchLower))
            );
        }

        // Apply sorting
        if (sort) {
            allUsers.sort((a: any, b: any) => {
                switch (sort) {
                    case 'created_asc':
                        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                    case 'created_desc':
                        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                    case 'name_asc':
                        return (a.full_name || '').localeCompare(b.full_name || '');
                    case 'name_desc':
                        return (b.full_name || '').localeCompare(a.full_name || '');
                    default:
                        return 0;
                }
            });
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
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

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

        if (payload.deactivated !== undefined) {
            const getRes = await fetch(`${baseUrl}/api/tower/towers/${towerId}`, { headers: { 'x-api-key': process.env.INTERNAL_API_SECRET || '' }});
            if (getRes.ok) {
                const data = await getRes.json();
                const clerkId = data?.data?.clerk_id;
                const paymentsUrl = process.env.PAYMENTS_SYSTEM_URL;
                if (clerkId && paymentsUrl) {
                    fetch(`${paymentsUrl}/api/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET || ''}`
                        },
                        body: JSON.stringify({ clerkId, isBanned: payload.deactivated })
                    }).catch(e => console.error("Error notifying payments system:", e));
                }
            }
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

        // Hacer un soft delete actualizando deactivated a true
        const res = await fetch(`${baseUrl}/api/tower/towers/${towerId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.INTERNAL_API_SECRET || ''
            },
            body: JSON.stringify({ deactivated: true })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            return { success: false, code: data?.error || 'UNKNOWN_ERROR' };
        }

        const getRes = await fetch(`${baseUrl}/api/tower/towers/${towerId}`, { headers: { 'x-api-key': process.env.INTERNAL_API_SECRET || '' }});
        if (getRes.ok) {
            const data = await getRes.json();
            const clerkId = data?.data?.clerk_id;
            const paymentsUrl = process.env.PAYMENTS_SYSTEM_URL;
            if (clerkId && paymentsUrl) {
                fetch(`${paymentsUrl}/api/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET || ''}`
                    },
                    body: JSON.stringify({ clerkId, isBanned: true })
                }).catch(e => console.error("Error notifying payments system:", e));
            }
        }

        revalidatePath('/tower-system/users');
        return { success: true };
    } catch (error) {
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}
