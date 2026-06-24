export interface TripRecord {
	tripId: number;
	customerId: number;
	customerName: string;
	vehicleId: number;
	originChar: string;
	destinationChar: string;
	date: string;
	time: string;
	status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | string;
}
