'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import { useResourceActions } from "@/hooks/useResourceActions";
import { ReportRecord } from "./report.types";
import { REPORT_SORT_OPTIONS, REPORT_FILTER_OPTIONS, getReportFields } from "./report.ui";
import { getReportViewActions, ReportViewActionHandlers } from "./report.actions";

interface ReportsClientProps {
	data: ReportRecord[];
}

export default function ReportsClient({ data }: ReportsClientProps) {
	const {
		messageState,
		showMessage,
		refresh,
	} = useResourceActions({});

	const handlers: ReportViewActionHandlers = { refresh, showMessage };
	const actions = getReportViewActions(handlers);

	const fields = getReportFields();

	return (
		<div>
			<ResourceControlBar
				searchPlaceholder="Buscar por ID de reporte, motivo o clerk..."
				sortOptions={REPORT_SORT_OPTIONS}
				filterOptions={REPORT_FILTER_OPTIONS}
				filterPlaceholder="Filtrar por estado"
				filterParamKey="status"
			/>

			<CardDataView
				title="Reportes de Feedback"
				data={data}
				fields={fields}
				actions={actions}
				keyExtractor={(row) => String(row.id)}
			/>

			{messageState.isOpen && (
				<div className="fixed bottom-4 right-4 z-50">
					<div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
						messageState.type === 'success'
							? 'bg-emerald-600 text-white'
							: 'bg-rose-600 text-white'
					}`}>
						{messageState.message}
					</div>
				</div>
			)}
		</div>
	);
}
