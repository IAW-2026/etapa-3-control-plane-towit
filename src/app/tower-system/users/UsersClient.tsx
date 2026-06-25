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
		refresh
	} = useResourceActions(USER_FORM_CONFIGS);

	const fields = getUserFields();
	const actions = getUserViewActions({ openFormAction, refresh, showMessage });

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
