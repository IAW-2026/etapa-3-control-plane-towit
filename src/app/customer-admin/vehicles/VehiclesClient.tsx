'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import { VehicleRecord } from "./vehicle.types";
import { VEHICLE_SORT_OPTIONS, getVehicleFields } from "./vehicle.ui";

interface VehiclesClientProps {
	data: VehicleRecord[];
}

export default function VehiclesClient({ data }: VehiclesClientProps) {
	const fields = getVehicleFields();

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por marca, modelo, año o cliente..."
				sortOptions={VEHICLE_SORT_OPTIONS}
			/>

			<CardDataView
				title="Vehículos Registrados"
				data={data}
				fields={fields}
				keyExtractor={(row) => String(row.vehicleId)}
			/>
		</div>
	);
}
