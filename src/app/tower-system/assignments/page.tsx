import AssignmentsClient from "./AssignmentsClient";
import PaginationControls from "@/component/PaginationControls";
import { AssignmentRecord } from "./assignment.types";
import { getAssignmentsAction } from "@/actions/tower-system/assignment.actions";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchAssignmentsData(params: { page: number; limit: number; search?: string; status?: string; sort?: string }) {
    const result = await getAssignmentsAction(params.page, params.limit, params.search, params.status, params.sort);
    if (!result.success) {
        throw new Error(result.code || "Error fetching assignments");
    }

    return {
        data: result.data.assignments,
        meta: { totalPages: result.data.meta.totalPages }
    };
}

export default async function AssignmentsPage(props: PageProps) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const search = (searchParams.search as string) || undefined;
    const status = (searchParams.status as string) || undefined;
    const sort = (searchParams.sort as string) || undefined;

    let paginatedAssignments: AssignmentRecord[] = [];
    let totalPages = 0;

    try {
        const result = await fetchAssignmentsData({ page, limit, search, status, sort });

        paginatedAssignments = result.data || [];
        totalPages = result.meta?.totalPages || 0;

    } catch (error) {
        console.error("[AssignmentsPage] Error:", error);
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Asignaciones</h1>
                <p className="text-gray-500 text-sm mt-1">Selecciona una asignación para aplicar operaciones y gestionar sus datos.</p>
            </div>

            <AssignmentsClient data={paginatedAssignments} />

            {totalPages > 0 && (
                <PaginationControls totalPages={totalPages} currentPage={page} />
            )}
        </div>
    );
}
