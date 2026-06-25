import UsersClient from "./UsersClient";
import PaginationControls from "@/component/PaginationControls";
import { TowerRecord } from "./user.types";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchUsersData(params: { page: number; limit: number; search?: string; status?: string; sort?: string }) {
    // MOCK DATA: Generamos 20 registros falsos para probar la interfaz
    const mockData: TowerRecord[] = Array.from({ length: 20 }, (_, i) => ({
        tower_id: `tow_${1000 + i}`,
        clerk_id: `user_2Q${Math.random().toString(36).substring(2, 10)}`,
        email: `gruista${i + 1}@example.com`,
        full_name: `Gruista ${i + 1} de Prueba`,
        payments_alias: i % 3 === 0 ? `alias.gruista${i + 1}.mp` : null,
        deactivated: i % 5 === 0, // 1 de cada 5 estará desactivado
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updatedAt: new Date().toISOString(),
    }));

    // Simulamos un delay de red para que sea más realista
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        data: mockData,
        meta: { totalPages: 1 } // Simulamos que todo cabe en una página
    };
}

export default async function UsersPage(props: PageProps) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 25;
    const search = (searchParams.search as string) || undefined;
    const status = (searchParams.status as string) || undefined;
    const sort = (searchParams.sort as string) || undefined;

    let paginatedUsers: TowerRecord[] = [];
    let totalPages = 0;

    try {
        const result = await fetchUsersData({ page, limit, search, status, sort });

        paginatedUsers = result.data || [];
        totalPages = result.meta?.totalPages || 0;

    } catch (error) {
        console.error("[UsersPage] Error:", error);
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Gruistas (Towers)</h1>
                <p className="text-gray-500 text-sm mt-1">Selecciona un usuario para aplicar operaciones y gestionar sus permisos.</p>
            </div>

            <UsersClient data={paginatedUsers} />

            {totalPages > 0 && (
                <PaginationControls totalPages={totalPages} currentPage={page} />
            )}
        </div>
    );
}
