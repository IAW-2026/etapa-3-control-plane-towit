import PaymentsClient from "./DisbursementsClient"; // Importamos el Client Wrapper
import PaginationControls from "@/component/PaginationControls";

export const dynamic = 'force-dynamic';

interface PageProps {
 	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchPaymentsData(params: { page: number; limit: number; search?: string; status?: string; sort?: string }) {
    const baseUrl = process.env.PAYMENTS_SYSTEM_URL;     
    if (!baseUrl) {
        throw new Error("CRITICAL: PAYMENTS_SYSTEM_URL no está definida.");
    }

    // 2. Construcción segura de la URL y los Query Params para aplicar los filtros
    const url = new URL(`${baseUrl}/api/disbursements`);
    url.searchParams.append("page", params.page.toString());
    url.searchParams.append("limit", params.limit.toString());
    
    if (params.search) url.searchParams.append("search", params.search);
    if (params.status && params.status !== "ALL") url.searchParams.append("status", params.status);
    if (params.sort) url.searchParams.append("sort", params.sort);

    // 3. Llamada Server-to-Server (S2S) con la API Key
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.INTERNAL_API_SECRET || '' 
        },
        // Al usar force-dynamic, Next.js por defecto no cacheará este fetch agresivamente,
        // pero podemos asegurarlo con 'no-store' si es información hiper-crítica.
        cache: 'no-store' 
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Fallo al obtener disbursements del sistema externo:", errorText);
        throw new Error("No se pudieron cargar los disbursements.");
    }

    // 4. Retornamos la estructura unificada que definimos en el endpoint { data, meta }
    return response.json(); 
}

export default async function DisbursementsPage(props: PageProps) {
	const searchParams = await props.searchParams;
	
	const page = Number(searchParams.page) || 1;
	const limit = Number(searchParams.limit) || 25; 
	const offset = (page - 1) * limit;	
    const searchQuery = (searchParams.search as string) || undefined;
    const statusFilter = (searchParams.status as string) || undefined;
    const sortOption = (searchParams.sort as string) || undefined;

	let paginatedPayments = [];
    let totalPages = 0;

	try {
        // Ejecutamos el fetch pasando todos los parámetros capturados
        const result = await fetchPaymentsData({ page, limit, search: searchQuery, status: statusFilter, sort: sortOption });
        
        paginatedPayments = result.data;
        totalPages = result.meta.totalPages;
        
    } catch (error) {
        // Manejo de errores amigable en el servidor
        console.error("[DisbursementsPage] Error:", error);
        // Podrías renderizar un componente de ErrorState aquí en un caso real
    }

	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Gestión de liquidaciones</h1>
				<p className="text-gray-500 text-sm mt-1">Selecciona una liquidación para aplicar operaciones.</p>
			</div>

			<PaymentsClient data={paginatedPayments} />

			{totalPages > 0 && (
        		<PaginationControls totalPages={totalPages} currentPage={page} />
     		)}
		</div>
	);
}