'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import { TripRecord } from "./trip.types";
import { TRIP_SORT_OPTIONS, TRIP_FILTER_OPTIONS, getTripFields } from "./trip.ui";

interface TripsClientProps {
	data: TripRecord[];
}

export default function TripsClient({ data }: TripsClientProps) {
	const fields = getTripFields();

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID, cliente, origen o destino..."
				sortOptions={TRIP_SORT_OPTIONS}
				filterOptions={TRIP_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
				filterParamKey="status"
			/>

			<CardDataView
				title="Viajes Solicitados"
				data={data}
				fields={fields}
				keyExtractor={(row) => String(row.tripId)}
			/>
		</div>
	);
}
