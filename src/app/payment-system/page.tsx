import Link from "next/link";

const sections = [
	{
		name: "Pagos",
		description: "Audita y procesa todas las transacciones financieras, filtra por estado y aplica operaciones.",
		href: "/payment-system/payments",
		icon: (
			<svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
			</svg>
		),
		color: "from-blue-500 to-indigo-600",
	},
	{
		name: "Liquidaciones",
		description: "Visualiza y gestiona las liquidaciones a conductores, montos y fechas de pago.",
		href: "/payment-system/disbursements",
		icon: (
			<svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
		color: "from-purple-500 to-fuchsia-600",
	},
	{
		name: "Reembolsos",
		description: "Administra las solicitudes de reembolso, su procesamiento y estado actual.",
		href: "/payment-system/refunds",
		icon: (
			<svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
			</svg>
		),
		color: "from-orange-500 to-red-600",
	},
];

export default function PaymentSystemHome() {
	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-10">
				<h1 className="text-2xl font-bold text-gray-900">Sistema de Pagos</h1>
				<p className="text-gray-500 text-sm mt-1">
					Audita, procesa y visualiza transacciones financieras, liquidaciones y reembolsos de la plataforma.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{sections.map((section) => (
					<Link
						key={section.name}
						href={section.href}
						className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col overflow-hidden"
					>
						<div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${section.color} opacity-5 rounded-bl-[80px] transition-transform duration-500 group-hover:scale-150 group-hover:opacity-10`} />

						<div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm border border-slate-100 group-hover:scale-110 group-hover:rotate-3">
							{section.icon}
						</div>

						<h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">{section.name}</h3>
						<p className="text-sm text-slate-600 leading-relaxed relative z-10 flex-1">{section.description}</p>

						<div className="mt-4 flex items-center text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors relative z-10">
							<span className="border-b-2 border-transparent group-hover:border-blue-600 pb-0.5 transition-all">Ir a {section.name}</span>
							<svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
