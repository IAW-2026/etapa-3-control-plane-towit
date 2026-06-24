export interface DisbursementRecord {
	transaction_id: string;
	trip_id: string;
	clerk_id: string; // El conductor que recibe el dinero
	amount: string | number;
	platform_fee: string | number; // Exclusivo de Disbursements
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | string;
	created_at: string | Date;
	deleted_at: string | Date | null;
}
