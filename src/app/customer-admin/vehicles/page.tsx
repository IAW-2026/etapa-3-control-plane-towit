import VehiclesClient from "./VehiclesClient";
import PaginationControls from "@/component/PaginationControls";
import { getVehicles, VehicleRecord } from "@/lib/customer-api";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function sortData(data: VehicleRecord[], sort: string | undefined): VehicleRecord[] {
  if (!sort) return data;

  const sorted = [...data];

  switch (sort) {
    case "name-asc":
      sorted.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
      break;
    case "name-desc":
      sorted.sort((a, b) => `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`));
      break;
    case "year-asc":
      sorted.sort((a, b) => a.year - b.year);
      break;
    case "year-desc":
      sorted.sort((a, b) => b.year - a.year);
      break;
  }

  return sorted;
}

export default async function VehiclesPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 25;
  const searchQuery = (searchParams.search as string) || undefined;
  const sort = (searchParams.sort as string) || undefined;

  const { data: paginated, total: totalCount } = await getVehicles({ page, limit, search: searchQuery });

  const totalPages = Math.ceil(Number(totalCount) / limit);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Vehículos</h1>
        <p className="text-gray-500 text-sm mt-1">Administra los vehículos registrados por los clientes.</p>
      </div>

      <VehiclesClient data={sortData(paginated, sort)} />

      {totalPages > 0 && (
        <PaginationControls totalPages={totalPages} currentPage={page} />
      )}
    </div>
  );
}
