export interface VehicleRecord {
    vehicle_id: string;
    brand: string;
    model: string;
    year: number;
    max_load: number;
    tower_id: string;
    deactivated: boolean;
    createdAt?: string;
    updatedAt?: string;
}
