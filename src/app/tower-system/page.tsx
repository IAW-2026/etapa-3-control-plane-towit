import Link from "next/link";

const sections = [
	{
		name: "Administradores",
		description: "Gestiona los administradores del sistema, sus permisos y roles dentro de la plataforma.",
		href: "/tower-system/admins",
		icon: (
			<svg className="w-8 h-8 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
			</svg>
		),
		color: "from-fuchsia-500 to-purple-600",
	},
	{
		name: "Usuarios",
		description: "Visualiza y administra los conductores registrados, sus datos personales y estado en el sistema.",
		href: "/tower-system/users",
		icon: (
			<svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
		),
		color: "from-teal-500 to-emerald-600",
	},
	{
		name: "Asignaciones",
		description: "Administra la asignación de servicios a conductores, seguimiento y estado de cada tarea.",
		href: "/tower-system/assignments",
		icon: (
			<svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			</svg>
		),
		color: "from-rose-500 to-pink-600",
	},
	{
		name: "Vehículos",
		description: "Gestiona el parque vehicular de los conductores, sus especificaciones y disponibilidad.",
		href: "/tower-system/vehicles",
		icon: (
			<svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
			</svg>
		),
		color: "from-yellow-500 to-amber-600",
	},
];

export default function TowerSystemHome() {
	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-10">
				<h1 className="text-2xl font-bold text-gray-900">App Conductores (Tower)</h1>
				<p className="text-gray-500 text-sm mt-1">
					Plataforma para la gestión de conductores, vehículos y asignaciones de servicios de grúa.
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
