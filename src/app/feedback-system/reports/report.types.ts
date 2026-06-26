export interface ReportRecord {
	id: number;
	tripId: number;
	reason: string;
	description: string;
	status: string;
	reporterClerkId: string;
	reportedClerkId: string;
	createdAt: string;
	trip?: {
		vehicle?: string;
		date?: string;
	};
}
