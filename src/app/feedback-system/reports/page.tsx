import ReportsClient from "./ReportsClient";
import PaginationControls from "@/component/PaginationControls";

export const dynamic = 'force-dynamic';

interface PageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchReportsData(params: { page: number; limit: number; from?: string; to?: string; search?: string }) {
	const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_APP_URL;

	if (!baseUrl) {
		throw new Error("CRITICAL: NEXT_PUBLIC_FEEDBACK_APP_URL no está definida.");
	}

	const url = new URL(`${baseUrl}/api/feedback/reports`);
	url.searchParams.append("page", params.page.toString());
	url.searchParams.append("pageSize", params.limit.toString());

	if (params.from) url.searchParams.append("from", params.from);
	if (params.to) url.searchParams.append("to", params.to);
	if (params.search) url.searchParams.append("search", params.search);

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
		console.error("Fallo al obtener reportes del sistema de feedback:", errorText);
		throw new Error("No se pudieron cargar los reportes.");
	}

	return response.json();
}

export default async function ReportsPage(props: PageProps) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const limit = Number(searchParams.limit) || 25;
	const from = (searchParams.from as string) || undefined;
	const to = (searchParams.to as string) || undefined;
	const search = (searchParams.search as string) || undefined;

	let paginatedReports = [];
	let totalPages = 0;

	try {
		const result = await fetchReportsData({ page, limit, from, to, search });

		paginatedReports = result.data;
		const total = result.total || 0;
		totalPages = Math.ceil(total / limit);

	} catch (error) {
		console.error("[ReportsPage] Error:", error);
	}

	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h1>
				<p className="text-gray-500 text-sm mt-1">Consulta los reportes del sistema de feedback.</p>
			</div>

			<ReportsClient data={paginatedReports} />

			{totalPages > 0 && (
				<PaginationControls totalPages={totalPages} currentPage={page} />
			)}
		</div>
	);
}
