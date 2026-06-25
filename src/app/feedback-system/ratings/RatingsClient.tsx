'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import { useResourceActions } from "@/hooks/useResourceActions";
import { RatingRecord } from "./rating.types";
import { RATING_SORT_OPTIONS, RATING_FILTER_OPTIONS, getRatingFields } from "./rating.ui";

interface RatingsClientProps {
	data: RatingRecord[];
}

export default function RatingsClient({ data }: RatingsClientProps) {
	const {
		messageState,
	} = useResourceActions({});

	const fields = getRatingFields();

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de viaje o clerk..."
				sortOptions={RATING_SORT_OPTIONS}
				filterOptions={RATING_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por tipo"
			/>

			<CardDataView
				title="Historial de Calificaciones"
				data={data}
				fields={fields}
				actions={[]}
				keyExtractor={(row) => String(row.id)}
			/>

			{messageState.isOpen && (
				<div className="fixed bottom-4 right-4 z-50">
					<div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
						messageState.type === 'success'
							? 'bg-emerald-600 text-white'
							: 'bg-rose-600 text-white'
					}`}>
						{messageState.message}
					</div>
				</div>
			)}
		</div>
	);
}
