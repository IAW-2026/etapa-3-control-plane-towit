'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { VehicleRecord } from "./vehicle.types";
import { VEHICLE_SORT_OPTIONS, VEHICLE_FILTER_OPTIONS, getVehicleFields } from "./vehicle.ui";
import { VEHICLE_FORM_CONFIGS, getVehicleViewActions } from "./vehicle.actions";

interface VehiclesClientProps {
	data: VehicleRecord[];
}

export default function VehiclesClient({ data }: VehiclesClientProps) {
	const {
		isModalOpen,
		modalConfig,
		openFormAction,
		closeModal,
		handleFormSubmit,
		messageState,
		showMessage,
		closeMessage,
		refresh,
		selectedIds
	} = useResourceActions(VEHICLE_FORM_CONFIGS);

	const fields = getVehicleFields();
	const actions = getVehicleViewActions({ openFormAction, refresh, showMessage });

	let initialData: Record<string, string> | undefined = undefined;
	if (selectedIds && selectedIds.length === 1) {
		const targetVehicle = data.find((v) => v.vehicle_id === selectedIds[0]);
		if (targetVehicle) {
			initialData = {
				tower_id: targetVehicle.tower_id || '',
				brand: targetVehicle.brand || '',
				model: targetVehicle.model || '',
				year: targetVehicle.year?.toString() || '',
				max_load: targetVehicle.max_load?.toString() || '',
				deactivated: targetVehicle.deactivated ? 'true' : 'false',
			};
		}
	}

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por marca, modelo, vehículo ID o tower ID..."
				sortOptions={VEHICLE_SORT_OPTIONS}
				filterOptions={VEHICLE_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Directorio de Vehículos"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => row.vehicle_id}
			/>

			{modalConfig && (
				<FormModal
					isOpen={isModalOpen}
					title={modalConfig.title}
					description={modalConfig.description}
					fields={modalConfig.fields}
					submitText={modalConfig.submitText}
					onSubmit={handleFormSubmit}
					onClose={closeModal}
					initialData={initialData}
				/>
			)}

			{messageState.isOpen && (
				<MessageModal
					isOpen={messageState.isOpen}
					title={messageState.title}
					message={messageState.message}
					type={messageState.type}
					onClose={closeMessage}
				/>
			)}
		</div>
	);
}
