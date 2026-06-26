export interface AvgRatingRecord {
	clerkId: string;
	avgRating: number;
	totalRatings: number;
	updatedAt: string;
	displayName: string;
	firstName?: string | null;
	lastName?: string | null;
}
