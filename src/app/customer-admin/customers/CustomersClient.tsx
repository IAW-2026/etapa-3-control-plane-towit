'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { CustomerRecord } from "./customer.types";
import { CUSTOMER_SORT_OPTIONS, CUSTOMER_FILTER_OPTIONS, getCustomerFields } from "./customer.ui";
import { CUSTOMER_FORM_CONFIGS, getCustomerViewActions } from "./customer.actions";

interface CustomersClientProps {
	data: CustomerRecord[];
}

export default function CustomersClient({ data }: CustomersClientProps) {
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
	} = useResourceActions(CUSTOMER_FORM_CONFIGS);

	const fields = getCustomerFields();
	const actions = getCustomerViewActions({ openFormAction, refresh, showMessage });

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por nombre..."
				sortOptions={CUSTOMER_SORT_OPTIONS}
				filterOptions={CUSTOMER_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
				filterParamKey="status"
			/>

			<CardDataView
				title="Clientes Registrados"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => String(row.customerId)}
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
