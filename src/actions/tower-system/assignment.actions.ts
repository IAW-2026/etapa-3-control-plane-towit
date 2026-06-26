"use server"

import { revalidatePath } from "next/cache";

export type ActionErrorCode = string;

export interface ActionResponse {
    success: boolean;
    code?: ActionErrorCode;
    data?: any;
}

export async function getAssignmentsAction(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    status?: string,
    sort?: string
): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/tower/assignments`, {
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

        let allAssignments = (await response.json()).data;

        if (!Array.isArray(allAssignments)) {
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
            allAssignments = allAssignments.map((a: any) => ({
                ...a,
                clerk_id: clerkMap[a.tower_id] || 'N/A'
            }));
        }

        // Apply filters
        if (status === 'ACTIVE') {
            allAssignments = allAssignments.filter((a: any) => !a.deactivated);
        } else if (status === 'DEACTIVATED') {
            allAssignments = allAssignments.filter((a: any) => a.deactivated);
        } else if (status === 'COMPLETED') {
            allAssignments = allAssignments.filter((a: any) => a.status && a.status.toLowerCase() === 'completed');
        } else if (status === 'ACCEPTED') {
            allAssignments = allAssignments.filter((a: any) => a.status && a.status.toLowerCase() === 'accepted');
        }

        if (search) {
            const searchLower = search.toLowerCase();
            allAssignments = allAssignments.filter((a: any) => 
                (a.assignment_id && a.assignment_id.toLowerCase().includes(searchLower)) ||
                (a.trip_id && a.trip_id.toLowerCase().includes(searchLower)) ||
                (a.tower_id && a.tower_id.toLowerCase().includes(searchLower)) ||
                (a.clerk_id && a.clerk_id.toLowerCase().includes(searchLower))
            );
        }

        // Apply sorting
        if (sort) {
            allAssignments.sort((a: any, b: any) => {
                switch (sort) {
                    case 'created_asc':
                        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                    case 'created_desc':
                        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                    default:
                        return 0;
                }
            });
        }

        // Pagination
        const totalItems = allAssignments.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Ensure page is within bounds
        const currentPage = Math.max(1, Math.min(page, totalPages || 1));
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAssignments = allAssignments.slice(startIndex, endIndex);

        return {
            success: true,
            data: {
                assignments: paginatedAssignments,
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

export async function createAssignmentAction(formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const payload = {
            trip_id: formData.trip_id,
            tower_id: formData.tower_id,
            status: formData.status,
            location: {
                lat: formData.lat || "0",
                long: formData.long || "0"
            },
            origin: formData.origin,
            destination: formData.destination
        };

        const response = await fetch(`${baseUrl}/api/tower/assignments`, {
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

        revalidatePath('/tower-system/assignments');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function updateAssignmentAction(assignmentId: string, formData: Record<string, any>): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        const payload: Record<string, any> = {};
        if (formData.trip_id) payload.trip_id = formData.trip_id;
        if (formData.tower_id) payload.tower_id = formData.tower_id;
        if (formData.status) payload.status = formData.status;
        if (formData.origin) payload.origin = formData.origin;
        if (formData.destination) payload.destination = formData.destination;
        if (formData.lat || formData.long) {
            payload.location = {
                lat: formData.lat,
                long: formData.long
            };
        }
        if (formData.deactivated !== undefined) payload.deactivated = formData.deactivated;

        const response = await fetch(`${baseUrl}/api/tower/assignments/${assignmentId}`, {
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

        revalidatePath('/tower-system/assignments');
        return { success: true };

    } catch (error) {
        console.error("[Action Error]:", error);
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}

export async function deleteAssignmentAction(assignmentId: string): Promise<ActionResponse> {
    try {
        const baseUrl = process.env.TOWER_SYSTEM_URL || "http://localhost:3000";

        // Hacer un soft delete actualizando deactivated a true
        const res = await fetch(`${baseUrl}/api/tower/assignments/${assignmentId}`, {
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

        revalidatePath('/tower-system/assignments');
        return { success: true };
    } catch (error) {
        return { success: false, code: 'SERVER_ACTION_ERROR' };
    }
}
