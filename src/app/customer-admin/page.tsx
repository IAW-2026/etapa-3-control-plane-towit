import Link from "next/link";

const sections = [
	{
		name: "Dashboard",
		description: "Resumen general de métricas, viajes recientes y actividad de la plataforma de clientes.",
		href: "/customer-admin/dashboard",
		icon: (
			<svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
			</svg>
		),
		color: "from-indigo-500 to-indigo-600",
	},
	{
		name: "Clientes",
		description: "Gestiona los usuarios registrados, visualiza sus datos y monitorea su actividad en la plataforma.",
		href: "/customer-admin/customers",
		icon: (
			<svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
		),
		color: "from-emerald-500 to-teal-600",
	},
	{
		name: "Viajes",
		description: "Visualiza el historial de viajes solicitados, filtra por estado y da seguimiento a cada servicio.",
		href: "/customer-admin/trips",
		icon: (
			<svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
			</svg>
		),
		color: "from-cyan-500 to-blue-600",
	},
	{
		name: "Vehículos",
		description: "Administra los vehículos registrados por los clientes, sus características y estado.",
		href: "/customer-admin/vehicles",
		icon: (
			<svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
			</svg>
		),
		color: "from-amber-500 to-orange-600",
	},
];

export default function CustomerAdminHome() {
	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-10">
				<h1 className="text-2xl font-bold text-gray-900">App Clientes (Customer)</h1>
				<p className="text-gray-500 text-sm mt-1">
					Sistema para la gestión de usuarios, vehículos y viajes de la plataforma TowIt.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
