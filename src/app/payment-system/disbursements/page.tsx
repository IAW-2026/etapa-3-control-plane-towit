import DisbursementsClient from "./DisbursementsClient"; 
import PaginationControls from "@/component/PaginationControls";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 1. Extraemos la lógica de fetch a una función limpia para mantener el componente ordenado
async function fetchDisbursementsData(params: { page: number; limit: number; search?: string; status?: string; sort?: string }) {
    const baseUrl = process.env.PAYMENTS_SYSTEM_URL; 
    
    if (!baseUrl) {
        throw new Error("CRITICAL: PAYMENTS_SYSTEM_URL no está definida.");
    }

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
            'x-api-key': process.env.INTERNAL_API_SECRET || '' // Nuestro pase de seguridad
        },
        // Al usar force-dynamic, Next.js por defecto no cacheará este fetch agresivamente,
        // pero podemos asegurarlo con 'no-store' si es información hiper-crítica.
        cache: 'no-store' 
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Fallo al obtener disposiciones del sistema externo:", errorText);
        throw new Error("No se pudieron cargar las disposiciones.");
    }

    // 4. Retornamos la estructura unificada que definimos en el endpoint { data, meta }
    return response.json(); 
}

export default async function DisbursementsPage(props: PageProps) {
    const searchParams = await props.searchParams;
    
    // Capturamos la intención del usuario desde la URL
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 25; 
    const search = (searchParams.search as string) || undefined;
    const status = (searchParams.status as string) || undefined;
    const sort = (searchParams.sort as string) || undefined;

    let paginatedDisbursements = [];
    let totalPages = 0;

    try {
        // Ejecutamos el fetch pasando todos los parámetros capturados
        const result = await fetchDisbursementsData({ page, limit, search, status, sort });
        
        paginatedDisbursements = result.data;
        totalPages = result.meta.totalPages;
        
    } catch (error) {
        // Manejo de errores a  migable en el servidor
        console.error("[DisbursementsPage] Error:", error);
        // Podrías renderizar un componente de ErrorState aquí en un caso real
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Disposiciones</h1>
                <p className="text-gray-500 text-sm mt-1">Selecciona una disposición para aplicar operaciones.</p>
            </div>

            <DisbursementsClient data={paginatedDisbursements} />

            {totalPages > 0 && (
                <PaginationControls totalPages={totalPages} currentPage={page} />
            )}
        </div>
    );
}