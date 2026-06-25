import AvgRatingsClient from "./AvgRatingsClient";
import PaginationControls from "@/component/PaginationControls";
import { AvgRatingRecord } from "./avg-rating.types";
import { clerkClient } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

interface PageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchAvgRatingsData(params: { page: number; limit: number; search?: string }) {
	const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_APP_URL;

	if (!baseUrl) {
		throw new Error("CRITICAL: NEXT_PUBLIC_FEEDBACK_APP_URL no está definida.");
	}

	const url = new URL(`${baseUrl}/api/feedback/avg_ratings`);
	url.searchParams.append("page", params.page.toString());
	url.searchParams.append("pageSize", params.limit.toString());

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
		console.error("Fallo al obtener calificaciones promedio del sistema de feedback:", errorText);
		throw new Error("No se pudieron cargar las calificaciones promedio.");
	}

	return response.json();
}

export default async function AvgRatingsPage(props: PageProps) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const limit = Number(searchParams.limit) || 25;
	const search = (searchParams.search as string) || undefined;

	let paginatedAvgRatings: AvgRatingRecord[] = [];
	let totalPages = 0;

	try {
		const result = await fetchAvgRatingsData({ page, limit, search });

		paginatedAvgRatings = result.data;
		const total = result.total || 0;
		totalPages = Math.ceil(total / limit);

		const client = await clerkClient();
		paginatedAvgRatings = await Promise.all(
			paginatedAvgRatings.map(async (record) => {
				try {
					const clerkUser = await client.users.getUser(record.clerkId);
					return { ...record, firstName: clerkUser.firstName, lastName: clerkUser.lastName };
				} catch {
					return record;
				}
			})
		);

	} catch (error) {
		console.error("[AvgRatingsPage] Error:", error);
	}

	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Calificaciones Promedio</h1>
				<p className="text-gray-500 text-sm mt-1">Consulta el promedio de calificaciones de cada usuario en el sistema de feedback.</p>
			</div>

			<AvgRatingsClient data={paginatedAvgRatings} />

			{totalPages > 0 && (
				<PaginationControls totalPages={totalPages} currentPage={page} />
			)}
		</div>
	);
}
