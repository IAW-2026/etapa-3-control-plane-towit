'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import { useResourceActions } from "@/hooks/useResourceActions";
import { AvgRatingRecord } from "./avg-rating.types";
import { getAvgRatingFields } from "./avg-rating.ui";

interface AvgRatingsClientProps {
	data: AvgRatingRecord[];
}

export default function AvgRatingsClient({ data }: AvgRatingsClientProps) {
	const {
		messageState,
	} = useResourceActions({});

	const fields = getAvgRatingFields();

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por nombre o Clerk ID..."
			/>

			<CardDataView
				title="Calificaciones Promedio por Usuario"
				data={data}
				fields={fields}
				actions={[]}
				keyExtractor={(row) => row.clerkId}
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
