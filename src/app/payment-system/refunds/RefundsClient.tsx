'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { RefundRecord } from "./refund.types";
import { REFUND_SORT_OPTIONS, REFUND_FILTER_OPTIONS, getRefundFields } from "./refund.ui";
import { REFUND_FORM_CONFIGS, getRefundViewActions } from "./refund.actions";

interface RefundsClientProps {
	data: RefundRecord[];
}

export default function RefundsClient({ data }: RefundsClientProps) {
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
	} = useResourceActions(REFUND_FORM_CONFIGS);

	const fields = getRefundFields();
	const actions = getRefundViewActions({ openFormAction, refresh, showMessage });

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de transacción o viaje..."
				sortOptions={REFUND_SORT_OPTIONS}
				filterOptions={REFUND_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Historial de Reembolsos"
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