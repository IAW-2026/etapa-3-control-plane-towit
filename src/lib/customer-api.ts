const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL || "https://towit-customerview.vercel.app";
const API_SECRET = process.env.INTERNAL_API_SECRET || "";

interface ApiOptions {
  page?: number;
  limit?: number;
  search?: string;
  clerkId?: string;
  status?: string;
  sort?: string;
}

async function fetchApi<T>(path: string, options?: ApiOptions): Promise<T> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.search) params.set("search", options.search);
  if (options?.clerkId) params.set("clerkId", options.clerkId);
  if (options?.status) params.set("status", options.status);
  if (options?.sort) params.set("sort", options.sort);

  const query = params.toString();
  const url = `${CUSTOMER_APP_URL}/api/admin${path}${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    headers: { "x-api-key": API_SECRET },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Customer API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export interface DashboardData {
  tripCount: number;
  customerCount: number;
  vehicleCount: number;
  recentTrips: {
    tripId: number;
    date: string;
    time: string;
    customerName: string;
    originChar: string;
    destinationChar: string;
    status: string;
  }[];
}

export interface CustomerRecord {
  customerId: number;
  clerkId: string;
  fullName: string;
  isActive: boolean;
  createdAt?: string;
}

export interface TripRecord {
  tripId: number;
  customer?: {
    customerId: number;
    clerkId: string;
    fullName: string;
    isActive: boolean;
  };
  vehicleId: number;
  vehicleBrand?: string;
  vehicleModel?: string;
  towerId?: string;
  driverName?: string;
  driverClerkId?: string;
  originChar: string;
  destinationChar: string;
  date: string;
  time: string;
  status: string;
  isDeleted?: boolean;
}

export interface VehicleRecord {
  vehicleId: number;
  customerId: number;
  customerName: string;
  brand: string;
  model: string;
  year: number;
  weight: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export async function getDashboard(): Promise<DashboardData> {
  const url = `${CUSTOMER_APP_URL}/api/admin/dashboard`;
  const res = await fetch(url, {
    headers: { "x-api-key": API_SECRET },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Customer API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getCustomers(options?: ApiOptions): Promise<PaginatedResponse<CustomerRecord>> {
  return fetchApi<PaginatedResponse<CustomerRecord>>("/customers", options);
}

export async function getTrips(options?: ApiOptions): Promise<PaginatedResponse<TripRecord>> {
  return fetchApi<PaginatedResponse<TripRecord>>("/trips", options);
}

export async function getVehicles(options?: ApiOptions): Promise<PaginatedResponse<VehicleRecord>> {
  return fetchApi<PaginatedResponse<VehicleRecord>>("/vehicles", options);
}
