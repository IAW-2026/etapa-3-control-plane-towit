# API Endpoints para el Customer App

Endpoints REST que debe exponer `https://towit-customerview.vercel.app/api/admin/*` para que el Control Plane consuma los datos.

## Autenticación

Todos los endpoints se autentican via header `x-api-key` con el valor de `INTERNAL_API_SECRET` (mismo mecanismo que los endpoints existentes en `lib/api-auth.ts`).

```typescript
import { validateApiKey } from "@/lib/api-auth";
```

## Formato de respuesta paginada

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

---

## 1. Dashboard — `GET /api/admin/dashboard`

Devuelve KPIs generales y los últimos 10 viajes.

### Response

```typescript
interface DashboardResponse {
  tripCount: number;
  customerCount: number;
  vehicleCount: number;
  recentTrips: RecentTrip[];
}

interface RecentTrip {
  tripId: number;
  date: string;          // "2026-06-20"
  time: string;          // "14:30"
  customerName: string;
  originChar: string;
  destinationChar: string;
  status: string;        // "COMPLETED" | "PENDING" | "CANCELLED" | ...
}
```

### Código de ejemplo

```typescript
// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { db } from "@/db";
import { trip, customer, vehicle } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [tripCount] = await db.select({ count: count() }).from(trip);
  const [customerCount] = await db.select({ count: count() }).from(customer);
  const [vehicleCount] = await db.select({ count: count() }).from(vehicle);

  const recentTrips = await db
    .select({
      tripId: trip.trip_id,
      date: trip.date,
      time: trip.time,
      customerName: customer.full_name,
      originChar: trip.origin_char,
      destinationChar: trip.destination_char,
      status: trip.status,
    })
    .from(trip)
    .leftJoin(customer, eq(trip.customer_id, customer.customer_id))
    .orderBy(desc(trip.date), desc(trip.time))
    .limit(10);

  return NextResponse.json({
    tripCount: tripCount.count,
    customerCount: customerCount.count,
    vehicleCount: vehicleCount.count,
    recentTrips: recentTrips.map((t) => ({
      ...t,
      status: t.status?.toUpperCase().replace(/\s+/g, "_") ?? "UNKNOWN",
    })),
  });
}
```

---

## 2. Clientes — `GET /api/admin/customers`

Lista paginada de clientes con búsqueda y filtro por estado.

### Query params

| Param    | Tipo   | Default | Descripción                        |
|----------|--------|---------|------------------------------------|
| `page`   | number | 1       | Número de página                   |
| `limit`  | number | 25      | Items por página                   |
| `search` | string | —       | Búsqueda por `full_name` (ILIKE)   |
| `status` | string | —       | `"ACTIVE"` o `"INACTIVE"`          |

### Response

```typescript
PaginatedResponse<{
  customerId: number;
  clerkId: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
}>
```

Nota: `email` queda fuera porque no está en la tabla `Customer` de la DB. Si se necesita, se puede omitir o agregar después.

### Código de ejemplo

```typescript
// app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { db } from "@/db";
import { customer } from "@/db/schema";
import { eq, ilike, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;

  const conditions = [];
  if (search) {
    conditions.push(ilike(customer.full_name, `%${search}%`));
  }
  if (status === "ACTIVE") {
    conditions.push(eq(customer.is_active, true));
  } else if (status === "INACTIVE") {
    conditions.push(eq(customer.is_active, false));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customer)
    .where(where);

  const data = await db
    .select({
      customerId: customer.customer_id,
      clerkId: customer.clerk_id,
      fullName: customer.full_name,
      isActive: customer.is_active,
      createdAt: sql<string>`${customer.customer_id}::text`, // placeholder
    })
    .from(customer)
    .where(where)
    .offset((page - 1) * limit)
    .limit(limit)
    .orderBy(customer.full_name);

  return NextResponse.json({
    data,
    total: Number(totalResult.count),
    page,
    limit,
  });
}
```

---

## 3. Viajes — `GET /api/admin/trips`

Lista paginada de viajes con búsqueda y filtro por estado.

### Query params

| Param    | Tipo   | Default | Descripción                                    |
|----------|--------|---------|------------------------------------------------|
| `page`   | number | 1       | Número de página                               |
| `limit`  | number | 25      | Items por página                               |
| `search` | string | —       | Búsqueda en `origin_char`, `destination_char`, `customer.full_name` |
| `status` | string | —       | Filtro por `trip.status`                       |

### Response

```typescript
PaginatedResponse<{
  tripId: number;
  customerId: number;
  customerName: string;
  vehicleId: number;
  originChar: string;
  destinationChar: string;
  date: string;
  time: string;
  status: string;
}>
```

### Código de ejemplo

```typescript
// app/api/admin/trips/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { db } from "@/db";
import { trip, customer } from "@/db/schema";
import { eq, ilike, and, or, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(trip.origin_char, `%${search}%`),
        ilike(trip.destination_char, `%${search}%`),
        ilike(customer.full_name, `%${search}%`),
        sql`${trip.trip_id}::text ILIKE ${`%${search}%`}`
      )
    );
  }
  if (status && status !== "ALL") {
    conditions.push(eq(trip.status, status));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(trip)
    .leftJoin(customer, eq(trip.customer_id, customer.customer_id))
    .where(where);

  const data = await db
    .select({
      tripId: trip.trip_id,
      customerId: trip.customer_id,
      customerName: customer.full_name,
      vehicleId: trip.vehicle_id,
      originChar: trip.origin_char,
      destinationChar: trip.destination_char,
      date: trip.date,
      time: trip.time,
      status: trip.status,
    })
    .from(trip)
    .leftJoin(customer, eq(trip.customer_id, customer.customer_id))
    .where(where)
    .offset((page - 1) * limit)
    .limit(limit)
    .orderBy(desc(trip.date), desc(trip.time));

  return NextResponse.json({
    data,
    total: Number(totalResult.count),
    page,
    limit,
  });
}
```

---

## 4. Vehículos — `GET /api/admin/vehicles`

Lista paginada de vehículos con búsqueda.

### Query params

| Param    | Tipo   | Default | Descripción                                    |
|----------|--------|---------|------------------------------------------------|
| `page`   | number | 1       | Número de página                               |
| `limit`  | number | 25      | Items por página                               |
| `search` | string | —       | Búsqueda en `brand`, `model`, `customer.full_name` |

### Response

```typescript
PaginatedResponse<{
  vehicleId: number;
  customerId: number;
  customerName: string;
  brand: string;
  model: string;
  year: number;
  weight: number;
}>
```

### Código de ejemplo

```typescript
// app/api/admin/vehicles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { db } from "@/db";
import { vehicle, customer } from "@/db/schema";
import { eq, ilike, and, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
  const search = searchParams.get("search") || undefined;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(vehicle.brand, `%${search}%`),
        ilike(vehicle.model, `%${search}%`),
        ilike(customer.full_name, `%${search}%`),
        sql`${vehicle.year}::text ILIKE ${`%${search}%`}`
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(vehicle)
    .leftJoin(customer, eq(vehicle.customer_id, customer.customer_id))
    .where(where);

  const data = await db
    .select({
      vehicleId: vehicle.vehicle_id,
      customerId: vehicle.customer_id,
      customerName: customer.full_name,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      weight: vehicle.weight,
    })
    .from(vehicle)
    .leftJoin(customer, eq(vehicle.customer_id, customer.customer_id))
    .where(where)
    .offset((page - 1) * limit)
    .limit(limit)
    .orderBy(vehicle.brand, vehicle.model);

  return NextResponse.json({
    data,
    total: Number(totalResult.count),
    page,
    limit,
  });
}
```

---

## 5. Alternar estado de cliente — `PATCH /api/admin/customers/[id]`

Actualiza el estado `isActive` de un cliente.

### Body

```typescript
{
  isActive: boolean;
}
```

### Response

```typescript
{
  success: boolean;
  customer: {
    customerId: number;
    isActive: boolean;
  };
}
```

### Código de ejemplo

```typescript
// app/api/admin/customers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { db } from "@/db";
import { customer } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = Number(params.id);
  if (isNaN(customerId)) {
    return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
  }

  const body = await request.json();
  if (typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 });
  }

  const [updated] = await db
    .update(customer)
    .set({ is_active: body.isActive })
    .where(eq(customer.customer_id, customerId))
    .returning({ customerId: customer.customer_id, isActive: customer.is_active });

  if (!updated) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, customer: updated });
}
```

---

## Resumen de archivos a crear en `towit-customer`

```
towit-customer/app/api/admin/
├── dashboard/route.ts
├── customers/route.ts
├── customers/[id]/route.ts   ← PATCH para toggle estado
├── trips/route.ts
└── vehicles/route.ts
```

Cada uno sigue el patrón existente en `app/api/vehicles/[id]/route.ts` (imports, `validateApiKey`, etc.).
