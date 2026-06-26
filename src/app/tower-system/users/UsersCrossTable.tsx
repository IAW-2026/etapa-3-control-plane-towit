import React from "react";
import Link from "next/link";
import { getAssignmentsAction } from "@/actions/tower-system/assignment.actions";

async function fetchRecentDisbursements() {
    const baseUrl = process.env.PAYMENTS_SYSTEM_URL;
    if (!baseUrl) return [];

    try {
        const response = await fetch(`${baseUrl}/api/disbursements?limit=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.INTERNAL_API_SECRET || ''
            },
            cache: 'no-store'
        });

        if (!response.ok) return [];
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        return [];
    }
}

export default async function UsersCrossTable() {
    // 1. Fetch recent assignments
    const assignmentsRes = await getAssignmentsAction(1, 15, undefined, 'ALL', 'created_desc');
    const assignments = assignmentsRes.success && assignmentsRes.data ? assignmentsRes.data.assignments : [];

    // 2. Fetch recent disbursements
    const disbursements = await fetchRecentDisbursements();

    // 3. Join data
    const tableData = assignments.map((assignment: any) => {
        const disbursement = disbursements.find((d: any) => d.trip_id === assignment.trip_id);
        return {
            clerk_id: assignment.clerk_id,
            assignment_id: assignment.assignment_id,
            trip_id: assignment.trip_id,
            transaction_id: disbursement ? disbursement.transaction_id : null
        };
    });

    if (tableData.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Actividad Reciente</h2>
                        <p className="text-xs text-slate-500 font-medium">Asignaciones y transacciones en tiempo real</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clerk ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Asignación</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Viaje</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transacción</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                        {tableData.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/tower-system/users?search=${row.clerk_id}#management-section`} replace={true} scroll={true} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        <span className="truncate max-w-[100px]">{row.clerk_id ? row.clerk_id.substring(0, 12) + '...' : 'N/A'}</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/tower-system/assignments?search=${row.assignment_id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-sky-50 hover:text-sky-700 transition-colors">
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        <span className="truncate max-w-[100px]">{row.assignment_id}</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/customer-admin/trips?search=${row.trip_id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-amber-50 hover:text-amber-700 transition-colors">
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="truncate max-w-[100px]">{row.trip_id}</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {row.transaction_id ? (
                                        <Link href={`/payment-system/disbursements?search=${row.transaction_id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold shadow-sm shadow-emerald-100/50 hover:bg-emerald-100 hover:-translate-y-0.5 transition-all">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="truncate max-w-[100px]">{row.transaction_id.split('-')[0]}</span>
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 text-sm font-medium border border-slate-100 border-dashed">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Pendiente
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
