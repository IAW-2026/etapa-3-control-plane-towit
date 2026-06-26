export interface PaymentRecord {
	transaction_id: string;
	trip_id: string;
	clerk_id: string;
	amount: string | number;
	external_id: string | null;
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | string;
	created_at: string | Date;
	updated_at: string | Date;
	deleted_at: string | Date | null;
}
