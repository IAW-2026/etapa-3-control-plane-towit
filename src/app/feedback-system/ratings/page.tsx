import RatingsClient from "./RatingsClient";
import PaginationControls from "@/component/PaginationControls";

export const dynamic = 'force-dynamic';

interface PageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchRatingsData(params: { page: number; limit: number; from?: string; to?: string; type?: string; sort?: string }) {
	const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_APP_URL;

	if (!baseUrl) {
		throw new Error("CRITICAL: NEXT_PUBLIC_FEEDBACK_APP_URL no está definida.");
	}

	const url = new URL(`${baseUrl}/api/feedback/ratings`);
	url.searchParams.append("page", params.page.toString());
	url.searchParams.append("pageSize", params.limit.toString());

	if (params.from) url.searchParams.append("from", params.from);
	if (params.to) url.searchParams.append("to", params.to);

	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': process.env.INTERNAL_API_SECRET || '',
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("Fallo al obtener calificaciones del sistema de feedback:", errorText);
		throw new Error("No se pudieron cargar las calificaciones.");
	}

	return response.json();
}

export default async function RatingsPage(props: PageProps) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const limit = Number(searchParams.limit) || 25;
	const from = (searchParams.from as string) || undefined;
	const to = (searchParams.to as string) || undefined;
	const type = (searchParams.type as string) || undefined;
	const sort = (searchParams.sort as string) || undefined;

	let paginatedRatings = [];
	let totalPages = 0;

	try {
		const result = await fetchRatingsData({ page, limit, from, to, type, sort });

		paginatedRatings = result.data;
		const total = result.total || 0;
		totalPages = Math.ceil(total / limit);

	} catch (error) {
		console.error("[RatingsPage] Error:", error);
	}

	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Gestión de Calificaciones</h1>
				<p className="text-gray-500 text-sm mt-1">Consulta las calificaciones del sistema de feedback.</p>
			</div>

			<RatingsClient data={paginatedRatings} />

			{totalPages > 0 && (
				<PaginationControls totalPages={totalPages} currentPage={page} />
			)}
		</div>
	);
}
