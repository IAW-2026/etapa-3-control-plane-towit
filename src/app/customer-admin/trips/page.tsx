import TripsClient from "./TripsClient";
import PaginationControls from "@/component/PaginationControls";
import { getTrips } from "@/lib/customer-api";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TripsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 25;
  const searchQuery = (searchParams.search as string) || undefined;
  const statusFilter = (searchParams.status as string) || undefined;

  const { data: paginated, total: totalCount } = await getTrips({ page, limit, search: searchQuery, status: statusFilter });

  const totalPages = Math.ceil(Number(totalCount) / limit);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Viajes</h1>
        <p className="text-gray-500 text-sm mt-1">Visualiza y administra los viajes solicitados por los clientes.</p>
      </div>

      <TripsClient data={paginated} />

      {totalPages > 0 && (
        <PaginationControls totalPages={totalPages} currentPage={page} />
      )}
    </div>
  );
}
