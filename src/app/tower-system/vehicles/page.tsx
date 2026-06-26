import VehiclesClient from "./VehiclesClient";
import PaginationControls from "@/component/PaginationControls";
import { VehicleRecord } from "./vehicle.types";
import { getVehiclesAction } from "@/actions/tower-system/vehicle.actions";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchVehiclesData(params: { page: number; limit: number; search?: string; status?: string; sort?: string }) {
    const result = await getVehiclesAction(params.page, params.limit, params.search, params.status, params.sort);
    if (!result.success) {
        throw new Error(result.code || "Error fetching vehicles");
    }

    return {
        data: result.data.vehicles,
        meta: { totalPages: result.data.meta.totalPages }
    };
}

export default async function VehiclesPage(props: PageProps) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const search = (searchParams.search as string) || undefined;
    const status = (searchParams.status as string) || undefined;
    const sort = (searchParams.sort as string) || undefined;

    let paginatedVehicles: VehicleRecord[] = [];
    let totalPages = 0;

    try {
        const result = await fetchVehiclesData({ page, limit, search, status, sort });

        paginatedVehicles = result.data || [];
        totalPages = result.meta?.totalPages || 0;

    } catch (error) {
        console.error("[VehiclesPage] Error:", error);
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Vehículos</h1>
                <p className="text-gray-500 text-sm mt-1">Selecciona un vehículo para aplicar operaciones y gestionar sus datos.</p>
            </div>

            <VehiclesClient data={paginatedVehicles} />

            {totalPages > 0 && (
                <PaginationControls totalPages={totalPages} currentPage={page} />
            )}
        </div>
    );
}
