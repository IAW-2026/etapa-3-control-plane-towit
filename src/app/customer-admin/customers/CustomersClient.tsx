'use client'

import React, { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
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
	const { user } = useUser();
	const currentUserId = user?.id;

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

	const recordMap = useMemo(() => {
		const map = new Map<string, CustomerRecord>();
		for (const record of data) {
			map.set(String(record.customerId), record);
		}
		return map;
	}, [data]);

	const actions = getCustomerViewActions({ openFormAction, refresh, showMessage }, currentUserId, recordMap);

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
