'use client'

import React from "react";
import CardDataView from "@/component/CardDataView";
import ResourceControlBar from "@/component/ResourceControlBar";
import { ReportRecord } from "./report.types";
import { REPORT_SORT_OPTIONS, REPORT_FILTER_OPTIONS, getReportFields } from "./report.ui";

interface ReportsClientProps {
	data: ReportRecord[];
}

export default function ReportsClient({ data }: ReportsClientProps) {
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
				keyExtractor={(row) => String(row.id)}
			/>
		</div>
	);
}
