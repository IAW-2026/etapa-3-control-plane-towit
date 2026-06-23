'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { DisbursementRecord } from "./disbursement.types";
import { DISBURSEMENT_SORT_OPTIONS, DISBURSEMENT_FILTER_OPTIONS, getDisbursementFields } from "./disbursement.ui";
import { DISBURSEMENT_FORM_CONFIGS, getDisbursementViewActions } from "./disbursement.actions";

interface DisbursementsClientProps {
	data: DisbursementRecord[];
}

export default function DisbursementsClient({ data }: DisbursementsClientProps) {
	const {
		isModalOpen,
		modalConfig,
		openFormAction,
		closeModal,
		handleFormSubmit,
		messageState,
		showMessage,
		closeMessage,
		refresh
	} = useResourceActions(DISBURSEMENT_FORM_CONFIGS);

	const fields = getDisbursementFields();
	const actions = getDisbursementViewActions({ openFormAction, refresh, showMessage });

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de transacción o viaje..."
				sortOptions={DISBURSEMENT_SORT_OPTIONS}
				filterOptions={DISBURSEMENT_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Historial de Liquidaciones Activas"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => row.transaction_id}
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