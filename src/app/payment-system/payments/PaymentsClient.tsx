'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { PaymentRecord } from "./payment.types";
import { PAYMENT_SORT_OPTIONS, PAYMENT_FILTER_OPTIONS, getPaymentFields } from "./payment.ui";
import { PAYMENT_FORM_CONFIGS, getPaymentViewActions } from "./payment.actions";

interface PaymentsClientProps {
	data: PaymentRecord[];
}

export default function PaymentsClient({ data }: PaymentsClientProps) {
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
	} = useResourceActions(PAYMENT_FORM_CONFIGS);

	const fields = getPaymentFields();
	const actions = getPaymentViewActions({ openFormAction, refresh, showMessage });

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de transacción o viaje..."
				sortOptions={PAYMENT_SORT_OPTIONS}
				filterOptions={PAYMENT_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Historial de Pagos Activos"
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