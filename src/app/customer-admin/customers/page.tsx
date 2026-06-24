import CustomersClient from "./CustomersClient";
import PaginationControls from "@/component/PaginationControls";
import { getCustomers, CustomerRecord } from "@/lib/customer-api";
import { clerkClient } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function sortData(data: CustomerRecord[], sort: string | undefined): CustomerRecord[] {
  if (!sort) return data;

  const sorted = [...data];

  switch (sort) {
    case "name_asc":
      sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
      break;
    case "name_desc":
      sorted.sort((a, b) => b.fullName.localeCompare(a.fullName));
      break;
    case "created_desc":
      sorted.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    case "created_asc":
      sorted.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      break;
  }

  return sorted;
}

export default async function CustomersPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 25;
  const searchQuery = (searchParams.search as string) || undefined;
  const statusFilter = (searchParams.status as string) || undefined;
  const sort = (searchParams.sort as string) || undefined;

  const { data: paginated, total: totalCount } = await getCustomers({ page, limit, search: searchQuery, status: statusFilter, sort });

  const totalPages = Math.ceil(Number(totalCount) / limit);

  const client = await clerkClient();
  const enriched = await Promise.all(
    paginated.map(async (customer) => {
      try {
        const clerkUser = await client.users.getUser(customer.clerkId);
        return { ...customer, createdAt: new Date(clerkUser.createdAt).toISOString() };
      } catch {
        return customer;
      }
    })
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-500 text-sm mt-1">Administra los clientes registrados en TowIt Customer App.</p>
      </div>

      <CustomersClient data={sortData(enriched, sort)} />

      {totalPages > 0 && (
        <PaginationControls totalPages={totalPages} currentPage={page} />
      )}
    </div>
  );
}
