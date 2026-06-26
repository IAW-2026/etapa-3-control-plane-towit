import UsersClient from "./UsersClient";
import UsersCrossTable from "./UsersCrossTable";
import PaginationControls from "@/component/PaginationControls";
import { TowerRecord } from "./user.types";
import { getUsersAction } from "@/actions/tower-system/user.actions";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchUsersData(params: { page: number; limit: number; search?: string; status?: string; sort?: string }) {
    const result = await getUsersAction(params.page, params.limit, params.search, params.status, params.sort);
    if (!result.success) {
        throw new Error(result.code || "Error fetching users");
    }

    return {
        data: result.data.users,
        meta: { totalPages: result.data.meta.totalPages }
    };
}


export default async function UsersPage(props: PageProps) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Towers</h1>
                <p className="text-gray-500 text-sm mt-1">Selecciona un usuario para aplicar operaciones y gestionar sus permisos.</p>
            </div>

            <UsersCrossTable />

            <div id="management-section" className="scroll-mt-8">
                <UsersClient data={paginatedUsers} />
            </div>

            {totalPages > 0 && (
                <PaginationControls totalPages={totalPages} currentPage={page} />
            )}
        </div>
    );
}
