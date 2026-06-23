export interface PaymentRecord {
	transaction_id: string;
	trip_id: string;
	id_user: number;
	amount: string | number;
	external_id: string | null;
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | string;
	created_at: string | Date;
	updated_at: string | Date;
	deleted_at: string | Date | null;
}
