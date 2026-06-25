export interface Location {
    lat: string;
    long: string;
}

export interface AssignmentRecord {
    assignment_id: string;
    trip_id: string;
    tower_id: string;
    status: string;
    location: Location;
    origin: string;
    destination: string;
    deactivated: boolean;
    clerk_id?: string;
    createdAt?: string;
    updatedAt?: string;
}
