export interface TripRecord {
	tripId: number;
	customerId: number;
	customerName: string;
	clerkId?: string;
	vehicleId: number;
	vehicleBrand?: string;
	vehicleModel?: string;
	towerId?: number;
	driverName?: string;
	driverClerkId?: string;
	originChar: string;
	destinationChar: string;
	date: string;
	time: string;
	status: 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELETED' | string;
	isDeleted?: boolean;
}
