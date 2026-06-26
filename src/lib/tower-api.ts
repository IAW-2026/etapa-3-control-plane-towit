const TOWER_SYSTEM_URL = process.env.TOWER_SYSTEM_URL || "https://proyecto-a-driver2-towit.vercel.app";
const API_SECRET = process.env.INTERNAL_API_SECRET || "";

export interface DriverInfo {
  name: string | null;
  clerkId: string | null;
}

export async function getDriverInfo(towerId: number): Promise<DriverInfo | null> {
  try {
    const url = `${TOWER_SYSTEM_URL}/api/tower/drivers/${towerId}`;
    const res = await fetch(url, {
      headers: { "x-api-key": API_SECRET },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Tower API error fetching driver ${towerId}: ${res.status}`);
      return null;
    }

    const driver = await res.json() as Record<string, unknown>;
    const name = (driver.name ?? driver.fullName ?? driver.full_name ?? driver.driverName ?? driver.driver_name) as string | null;
    const clerkId = (driver.clerkId ?? driver.clerk_id ?? driver.id ?? driver.userId ?? driver.user_id) as string | null;
    return { name: name ?? null, clerkId: clerkId ?? null };
  } catch (error) {
    console.error(`Failed to fetch driver info for towerId ${towerId}:`, error);
    return null;
  }
}

export async function getDriverName(towerId: number): Promise<string | null> {
  const info = await getDriverInfo(towerId);
  return info?.name ?? null;
}
