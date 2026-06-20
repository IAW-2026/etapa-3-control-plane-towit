import PaymentsClient from "./PaymentsClient"; // Importamos el Client Wrapper
import PaginationControls from "@/component/PaginationControls";
import mockPayments from "./mockData.json"

export const dynamic = 'force-dynamic';

interface PageProps {
 	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentsPage(props: PageProps) {
	const searchParams = await props.searchParams;
	
	const page = Number(searchParams.page) || 1;
	const limit = Number(searchParams.limit) || 25; 
	const offset = (page - 1) * limit;	
    const searchQuery = (searchParams.search as string) || undefined;
    const statusFilter = (searchParams.status as string) || undefined;
    const sortOption = (searchParams.sort as string) || undefined;


	const [paginatedPayments, [{ totalCount }]] = await Promise.all([
		//Get all elements for the current page
        Promise.resolve(mockPayments.slice(offset, offset + limit)),
    
        // Simula la Promesa 2: db.select({ totalCount: sql<number>`count(*)` })
        Promise.resolve([{ totalCount: mockPayments.length }])
 	]);

	const totalPages = Math.ceil(Number(totalCount) / limit);


	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
				<p className="text-gray-500 text-sm mt-1">Selecciona un pago para aplicar operaciones.</p>
			</div>

			<PaymentsClient data={paginatedPayments} />

			{totalPages > 0 && (
        		<PaginationControls totalPages={totalPages} currentPage={page} />
     		)}
		</div>
	);
}