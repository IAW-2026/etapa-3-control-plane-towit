import TripsClient from "./TripsClient";
import PaginationControls from "@/component/PaginationControls";
import { getTrips, TripRecord } from "@/lib/customer-api";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function sortData(data: TripRecord[], sort: string | undefined): TripRecord[] {
  if (!sort) return data;

  const sorted = [...data];

  switch (sort) {
    case "date-desc":
      sorted.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateB - dateA;
      });
      break;
    case "date-asc":
      sorted.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateA - dateB;
      });
      break;
  }

  return sorted;
}

export default async function TripsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 25;
  const searchQuery = (searchParams.search as string) || undefined;
  const rawStatus = (searchParams.status as string) || undefined;
  const statusFilter = rawStatus === 'all' ? undefined : rawStatus;
  const sort = (searchParams.sort as string) || undefined;

  const { data: paginated, total: totalCount } = await getTrips({ page, limit, search: searchQuery, status: statusFilter });

  const totalPages = Math.ceil(Number(totalCount) / limit);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Viajes</h1>
        <p className="text-gray-500 text-sm mt-1">Visualiza y administra los viajes solicitados por los clientes.</p>
      </div>

      <TripsClient data={sortData(paginated, sort)} />

      {totalPages > 0 && (
        <PaginationControls totalPages={totalPages} currentPage={page} />
      )}
    </div>
  );
}
