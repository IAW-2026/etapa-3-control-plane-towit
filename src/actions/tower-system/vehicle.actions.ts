"use server"

import { revalidatePath } from "next/cache";

export type ActionErrorCode = string;

export interface ActionResponse {
    success: boolean;
    code?: ActionErrorCode;
    data?: any;
}

export async function getVehiclesAction(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    status?: string,
    sort?: string
): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/tower/vehicles`, {
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

        let allVehicles = (await response.json()).data;

        if (!Array.isArray(allVehicles)) {
            return { success: false, code: 'INVALID_DATA_FORMAT' };
        }

        const towersResponse = await fetch(`${baseUrl}/api/tower/towers`, {
            method: 'GET',
            headers: { 'x-api-key': process.env.INTERNAL_API_SECRET || '' },
            cache: 'no-store'
        });

        if (towersResponse.ok) {
            const towersData = await towersResponse.json();
            const clerkMap: Record<string, string> = {};
            if (towersData && Array.isArray(towersData.data)) {
                towersData.data.forEach((t: any) => {
                    if (t.tower_id && t.clerk_id) {
                        clerkMap[t.tower_id] = t.clerk_id;
                    }
                });
            }
            allVehicles = allVehicles.map((v: any) => ({
                ...v,
                clerk_id: clerkMap[v.tower_id] || 'N/A'
            }));
        }

        // Apply filters
        if (status === 'ACTIVE') {
            allVehicles = allVehicles.filter((v: any) => !v.deactivated);
        } else if (status === 'DEACTIVATED') {
            allVehicles = allVehicles.filter((v: any) => v.deactivated);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            allVehicles = allVehicles.filter((v: any) => 
                (v.brand && v.brand.toLowerCase().includes(searchLower)) ||
                (v.model && v.model.toLowerCase().includes(searchLower)) ||
                (v.vehicle_id && v.vehicle_id.toLowerCase().includes(searchLower)) ||
                (v.tower_id && v.tower_id.toLowerCase().includes(searchLower))
            );
        }

        // Apply sorting
        if (sort) {
            allVehicles.sort((a: any, b: any) => {
                switch (sort) {
                    case 'created_asc':
                        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                    case 'created_desc':
                        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                    case 'brand_asc':
                        return (a.brand || '').localeCompare(b.brand || '');
                    case 'brand_desc':
                        return (b.brand || '').localeCompare(a.brand || '');
                    case 'year_asc':
                        return (a.year || 0) - (b.year || 0);
                    case 'year_desc':
                        return (b.year || 0) - (a.year || 0);
                    default:
                        return 0;
                }
            });
        }

        // Pagination
        const totalItems = allVehicles.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Ensure page is within bounds
        const currentPage = Math.max(1, Math.min(page, totalPages || 1));
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedVehicles = allVehicles.slice(startIndex, endIndex);

        return {
            success: true,
            data: {
                vehicles: paginatedVehicles,
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

export async function createVehicleAction(formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const payload = {
            brand: formData.brand,
            model: formData.model,
            year: Number(formData.year),
            max_load: Number(formData.max_load),
            tower_id: formData.tower_id
        };

        const response = await fetch(`${baseUrl}/api/tower/vehicles`, {
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

        revalidatePath('/tower-system/vehicles');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function updateVehicleAction(vehicleId: string, formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const payload: Record<string, any> = {};
        if (formData.brand) payload.brand = formData.brand;
        if (formData.model) payload.model = formData.model;
        if (formData.year) payload.year = Number(formData.year);
        if (formData.max_load) payload.max_load = Number(formData.max_load);
        if (formData.tower_id) payload.tower_id = formData.tower_id;
        if (formData.deactivated !== undefined) payload.deactivated = formData.deactivated;

        const response = await fetch(`${baseUrl}/api/tower/vehicles/${vehicleId}`, {
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

        revalidatePath('/tower-system/vehicles');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function deleteVehicleAction(vehicleId: string): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        // Hacer un soft delete actualizando deactivated a true
        const res = await fetch(`${baseUrl}/api/tower/vehicles/${vehicleId}`, {
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

        revalidatePath('/tower-system/vehicles');
        return { success: true };
    } catch (error) {
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}
