export interface TripRecord {
	tripId: number;
	customer?: {
		customerId: number;
		clerkId: string;
		fullName: string;
		isActive: boolean;
	};
	vehicleId: number;
	vehicleBrand?: string;
	vehicleModel?: string;
	towerId?: string;
	driverName?: string;
	driverClerkId?: string;
	originChar: string;
	destinationChar: string;
	date: string;
	time: string;
	status: 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELETED' | string;
	isDeleted?: boolean;
}
