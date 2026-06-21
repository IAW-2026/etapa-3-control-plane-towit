import Link from "next/link";
import { getDashboard, type DashboardData } from "@/lib/customer-api";

export const dynamic = 'force-dynamic';

interface MetricCard {
  label: string;
  value: number;
  href: string;
  borderColor: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'COMPLETED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'PENDING': 'bg-amber-100 text-amber-800 border-amber-200',
    'CANCELLED': 'bg-rose-100 text-rose-800 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${styles[status] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
      {status}
    </span>
  );
}

export default async function AdminDashboard() {
  const data: DashboardData = await getDashboard();

  const metrics: MetricCard[] = [
    { label: "Viajes Totales", value: data.tripCount, href: "/customer-admin/trips", borderColor: "border-indigo-500" },
    { label: "Clientes Registrados", value: data.customerCount, href: "/customer-admin/customers", borderColor: "border-emerald-500" },
    { label: "Vehículos Registrados", value: data.vehicleCount, href: "/customer-admin/vehicles", borderColor: "border-amber-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard TowIt Customer</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general de la plataforma de clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {metrics.map((m) => (
          <Link key={m.label} href={m.href} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block group">
            <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wide group-hover:text-slate-700 transition">{m.label}</p>
            <p className={`text-4xl font-bold text-slate-900 border-l-4 ${m.borderColor} pl-4`}>{m.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Últimos Viajes Registrados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["ID", "Fecha y Hora", "Cliente", "Origen", "Destino", "Estado"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentTrips.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">No hay viajes registrados aún.</td></tr>
              ) : (
                data.recentTrips.map((t) => (
                  <tr key={t.tripId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700">#{t.tripId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.date} {t.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{t.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={t.originChar}>{t.originChar}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={t.destinationChar}>{t.destinationChar}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={t.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
