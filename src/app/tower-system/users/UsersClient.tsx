'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import FormModal from "@/component/FormModal";
import MessageModal from "@/component/MessageModal";
import { useResourceActions } from "@/hooks/useResourceActions";
import { TowerRecord } from "./user.types";
import { USER_SORT_OPTIONS, USER_FILTER_OPTIONS, getUserFields } from "./user.ui";
import { USER_FORM_CONFIGS, getUserViewActions } from "./user.actions";

interface UsersClientProps {
	data: TowerRecord[];
}

export default function UsersClient({ data }: UsersClientProps) {
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
	} = useResourceActions(USER_FORM_CONFIGS);

	const fields = getUserFields();
	const actions = getUserViewActions({ openFormAction, refresh, showMessage });

	let initialData: Record<string, string> | undefined = undefined;
	if (selectedIds && selectedIds.length === 1) {
		const targetUser = data.find((u) => u.tower_id === selectedIds[0]);
		if (targetUser) {
			initialData = {
				full_name: targetUser.full_name || '',
				email: targetUser.email || '',
				payments_alias: targetUser.payments_alias || '',
				deactivated: targetUser.deactivated ? 'true' : 'false',
			};
		}
	}

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por nombre o email..."
				sortOptions={USER_SORT_OPTIONS}
				filterOptions={USER_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
			/>

			<CardDataView
				title="Directorio de Gruistas"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => row.tower_id}
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
