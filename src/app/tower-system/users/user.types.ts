export interface TowerRecord {
	tower_id: string;
	clerk_id: string;
	email: string;
	full_name: string;
	payments_alias: string | null;
	deactivated: boolean;
	createdAt: string | Date;
	updatedAt: string | Date;
}
