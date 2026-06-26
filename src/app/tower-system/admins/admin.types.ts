export interface AdminRecord {
	admin_id: string;
	clerk_id: string;
	email: string;
	full_name: string;
	deactivated: boolean;
	createdAt: string | Date;
	updatedAt: string | Date;
}
