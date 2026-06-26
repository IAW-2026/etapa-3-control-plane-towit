const TOWER_API_URL = process.env.TOWER_API_URL || "https://proyecto-a-driver2-towit.vercel.app";
const API_SECRET = process.env.INTERNAL_API_SECRET || "";

export interface DriverRecord {
  towerId: number;
  name: string;
  email?: string;
  phone?: string;
}

export async function getDriverName(towerId: number): Promise<string | null> {
  try {
    const url = `${TOWER_API_URL}/api/tower/drivers/${towerId}`;
    const res = await fetch(url, {
      headers: { "x-api-key": API_SECRET },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Tower API error fetching driver ${towerId}: ${res.status}`);
      return null;
    }

    const driver: DriverRecord = await res.json();
    return driver.name || null;
  } catch (error) {
    console.error(`Failed to fetch driver name for towerId ${towerId}:`, error);
    return null;
  }
}
