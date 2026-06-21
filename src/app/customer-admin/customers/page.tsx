import CustomersClient from "./CustomersClient";
import PaginationControls from "@/component/PaginationControls";
import { getCustomers } from "@/lib/customer-api";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 25;
  const searchQuery = (searchParams.search as string) || undefined;
  const statusFilter = (searchParams.status as string) || undefined;

  const { data: paginated, total: totalCount } = await getCustomers({ page, limit, search: searchQuery, status: statusFilter });

  const totalPages = Math.ceil(Number(totalCount) / limit);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-500 text-sm mt-1">Administra los clientes registrados en TowIt Customer App.</p>
      </div>

      <CustomersClient data={paginated} />

      {totalPages > 0 && (
        <PaginationControls totalPages={totalPages} currentPage={page} />
      )}
    </div>
  );
}
