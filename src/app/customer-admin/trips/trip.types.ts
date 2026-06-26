export interface TripRecord {
	tripId: number;
	customerId: number;
	customerName: string;
	vehicleId: number;
	towerId?: number;
	driverName?: string;
	originChar: string;
	destinationChar: string;
	date: string;
	time: string;
	status: 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELETED' | string;
	isDeleted?: boolean;
}
