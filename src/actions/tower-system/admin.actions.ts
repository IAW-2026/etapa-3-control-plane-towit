"use server"

import { revalidatePath } from "next/cache";

export type ActionErrorCode = string;

export interface ActionResponse {
    success: boolean;
    code?: ActionErrorCode;
    data?: any;
}

export async function getAdminsAction(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    status?: string,
    sort?: string
): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/tower/admins`, {
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

        let allAdmins = (await response.json()).data;

        if (!Array.isArray(allAdmins)) {
            return { success: false, code: 'INVALID_DATA_FORMAT' };
        }

        // Apply filters
        if (status === 'ACTIVE') {
            allAdmins = allAdmins.filter((a: any) => !a.deactivated);
        } else if (status === 'DEACTIVATED') {
            allAdmins = allAdmins.filter((a: any) => a.deactivated);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            allAdmins = allAdmins.filter((a: any) => 
                (a.full_name && a.full_name.toLowerCase().includes(searchLower)) ||
                (a.email && a.email.toLowerCase().includes(searchLower)) ||
                (a.clerk_id && a.clerk_id.toLowerCase().includes(searchLower))
            );
        }

        // Apply sorting
        if (sort) {
            allAdmins.sort((a: any, b: any) => {
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
        const totalItems = allAdmins.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Ensure page is within bounds
        const currentPage = Math.max(1, Math.min(page, totalPages || 1));
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAdmins = allAdmins.slice(startIndex, endIndex);

        return {
            success: true,
            data: {
                admins: paginatedAdmins,
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

export async function createAdminAction(formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            emailAddress: formData.emailAddress,
            password: formData.password,
        };

        const response = await fetch(`${baseUrl}/api/tower/admins`, {
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

        revalidatePath('/tower-system/admins');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function updateAdminAction(adminId: string, formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const payload: Record<string, any> = {};
        if (formData.full_name) payload.full_name = formData.full_name;
        if (formData.email) payload.email = formData.email;
        if (formData.deactivated !== undefined) payload.deactivated = formData.deactivated;

        const response = await fetch(`${baseUrl}/api/tower/admins/${adminId}`, {
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

        revalidatePath('/tower-system/admins');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function deleteAdminAction(adminId: string): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        // Hacer un soft delete actualizando deactivated a true
        const res = await fetch(`${baseUrl}/api/tower/admins/${adminId}`, {
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

        revalidatePath('/tower-system/admins');
        return { success: true };
    } catch (error) {
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}
