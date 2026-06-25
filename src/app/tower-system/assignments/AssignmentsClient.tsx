'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { AssignmentRecord } from "./assignment.types";
import { ASSIGNMENT_SORT_OPTIONS, ASSIGNMENT_FILTER_OPTIONS, getAssignmentFields } from "./assignment.ui";
import { ASSIGNMENT_FORM_CONFIGS, getAssignmentViewActions } from "./assignment.actions";

interface AssignmentsClientProps {
	data: AssignmentRecord[];
}

export default function AssignmentsClient({ data }: AssignmentsClientProps) {
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
	} = useResourceActions(ASSIGNMENT_FORM_CONFIGS);

	const fields = getAssignmentFields();
	const actions = getAssignmentViewActions({ openFormAction, refresh, showMessage });

	let initialData: Record<string, string> | undefined = undefined;
	if (selectedIds && selectedIds.length === 1) {
		const targetAssignment = data.find((a) => a.assignment_id === selectedIds[0]);
		if (targetAssignment) {
			initialData = {
				trip_id: targetAssignment.trip_id || '',
				tower_id: targetAssignment.tower_id || '',
				status: targetAssignment.status || '',
				origin: targetAssignment.origin || '',
				destination: targetAssignment.destination || '',
				lat: targetAssignment.location?.lat || '',
				long: targetAssignment.location?.long || '',
				deactivated: targetAssignment.deactivated ? 'true' : 'false',
			};
		}
	}

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de asignación, viaje o tower..."
				sortOptions={ASSIGNMENT_SORT_OPTIONS}
				filterOptions={ASSIGNMENT_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Directorio de Asignaciones"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => row.assignment_id}
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
