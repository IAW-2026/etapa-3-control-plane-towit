export interface RefundRecord {
	transaction_id: string;
	trip_id: string;
	clerk_id: string;
	amount: string | number;
	refund_type: 'TOTAL' | 'PARTIAL'; // Exclusivo de Refunds
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | string;
	created_at: string | Date;
	deleted_at: string | Date | null;
}
