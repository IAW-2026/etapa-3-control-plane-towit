"use server"

import { revalidatePath } from "next/cache";

type FeedbackActionResponse =
	| { success: true }
	| { success: false; code: 'INVALID_STATUS' | 'NOT_AUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR' | 'SERVER_ACTION_ERROR' };

const VALID_STATUSES = ['unresolved', 'dismissed', 'considered'] as const;
type ReportStatus = typeof VALID_STATUSES[number];

export async function updateReportStatusAction(id: string, newStatus: ReportStatus): Promise<FeedbackActionResponse> {
	try {
		if (!VALID_STATUSES.includes(newStatus)) {
			return { success: false, code: 'INVALID_STATUS' };
		}

		const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_APP_URL;
		if (!baseUrl) {
			console.error("[updateReportStatusAction] NEXT_PUBLIC_FEEDBACK_APP_URL is not defined");
			return { success: false, code: 'SERVER_ERROR' };
		}

		const res = await fetch(`${baseUrl}/api/feedback/reports/${id}/status`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': process.env.INTERNAL_API_SECRET || '',
			},
			body: JSON.stringify({ status: newStatus }),
		});

		if (!res.ok) {
			switch (res.status) {
				case 400:
					return { success: false, code: 'INVALID_STATUS' };
				case 401:
					return { success: false, code: 'NOT_AUTHORIZED' };
				case 404:
					return { success: false, code: 'NOT_FOUND' };
				default:
					return { success: false, code: 'SERVER_ERROR' };
			}
		}

		revalidatePath('/feedback-system/reports');
		return { success: true };

	} catch (error) {
		console.error("[updateReportStatusAction] Error:", error);
		return { success: false, code: 'SERVER_ACTION_ERROR' };
	}
}
