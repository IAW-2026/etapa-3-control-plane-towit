import React from "react";
import AdminsClient from "./AdminsClient";
import PaginationControls from "@/component/PaginationControls";
import { getAdminsAction } from "@/actions/tower-system/admin.actions";
import { AdminRecord } from "./admin.types";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminsPage(props: PageProps) {
    const searchParams = await props.searchParams;
    // 1. Extraer los searchParams
    const page = Number(searchParams.page) || 1;
    const search = (searchParams.search as string) || '';
    const status = (searchParams.status as string) || 'ALL';
    const sort = (searchParams.sort as string) || 'created_desc';
    const limit = 10;

    let paginatedAdmins: AdminRecord[] = [];
    let totalPages = 0;

    try {
        const result = await getAdminsAction(page, limit, search, status, sort);
        
        if (!result.success) {
            console.error("[AdminsPage] Error from server action:", result.code);
        }

        paginatedAdmins = result.data?.admins || [];
        totalPages = result.data?.meta?.totalPages || 0;

    } catch (error) {
        console.error("[AdminsPage] Error:", error);
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Administradores</h1>
                <p className="text-gray-500 text-sm mt-1">Selecciona un administrador para aplicar operaciones y gestionar sus permisos.</p>
            </div>

            <AdminsClient data={paginatedAdmins} />

            {totalPages > 0 && (
                <PaginationControls totalPages={totalPages} currentPage={page} />
            )}
        </div>
    );
}
