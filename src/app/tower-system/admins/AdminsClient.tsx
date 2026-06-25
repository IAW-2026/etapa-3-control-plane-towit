'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { AdminRecord } from "./admin.types";
import { ADMIN_SORT_OPTIONS, ADMIN_FILTER_OPTIONS, getAdminFields } from "./admin.ui";
import { ADMIN_FORM_CONFIGS, getAdminViewActions } from "./admin.actions";

interface AdminsClientProps {
	data: AdminRecord[];
}

export default function AdminsClient({ data }: AdminsClientProps) {
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
	} = useResourceActions(ADMIN_FORM_CONFIGS);

	const fields = getAdminFields();
	const actions = getAdminViewActions({ openFormAction, refresh, showMessage });

	let initialData: Record<string, string> | undefined = undefined;
	if (selectedIds && selectedIds.length === 1) {
		const targetAdmin = data.find((a) => a.admin_id === selectedIds[0]);
		if (targetAdmin) {
			initialData = {
				full_name: targetAdmin.full_name || '',
				email: targetAdmin.email || '',
				deactivated: targetAdmin.deactivated ? 'true' : 'false',
			};
		}
	}

	return (
		<div className="bg-white rounded-2xl overflow-hidden flex flex-col">
			<ResourceControlBar
				sortOptions={ADMIN_SORT_OPTIONS}
				filterOptions={ADMIN_FILTER_OPTIONS}
				searchPlaceholder="Buscar por nombre o email..."
			/>

			<div className="flex-1 overflow-auto">
				<CardDataView<AdminRecord>
					data={data}
					fields={fields}
					keyExtractor={(row) => row.admin_id}
					actions={actions}
				/>
			</div>

			{isModalOpen && modalConfig && (
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

			<MessageModal
				isOpen={messageState.isOpen}
				title={messageState.title}
				message={messageState.message}
				type={messageState.type}
				onClose={closeMessage}
			/>
		</div>
	);
}
