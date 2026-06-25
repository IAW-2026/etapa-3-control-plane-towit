"use server"

import { revalidatePath } from "next/cache";

type FeedbackActionResponse =
	| { success: true }
	| { success: false; code: 'INVALID_ID' | 'NOT_AUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR' | 'SERVER_ACTION_ERROR' };

export async function deleteRatingAction(id: string): Promise<FeedbackActionResponse> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_FEEDBACK_APP_URL;
		if (!baseUrl) {
			console.error("[deleteRatingAction] NEXT_PUBLIC_FEEDBACK_APP_URL is not defined");
			return { success: false, code: 'SERVER_ERROR' };
		}

		const res = await fetch(`${baseUrl}/api/feedback/ratings/${id}`, {
			method: 'DELETE',
			headers: {
				'x-api-key': process.env.INTERNAL_API_SECRET || '',
			},
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			console.log("status:", res.status, "errorData:", errorData);

			switch (res.status) {
				case 400:
					return { success: false, code: 'INVALID_ID' };
				case 401:
					return { success: false, code: 'NOT_AUTHORIZED' };
				case 404:
					return { success: false, code: 'NOT_FOUND' };
				default:
					return { success: false, code: 'SERVER_ERROR' };
			}
		}

		revalidatePath('/feedback-system/ratings');
		return { success: true };

	} catch (error) {
		console.error("[deleteRatingAction] Error:", error);
		return { success: false, code: 'SERVER_ACTION_ERROR' };
	}
}
