import Link from "next/link";

const sections = [
	{
		name: "Calificaciones",
		description: "Visualiza todas las calificaciones de servicios, respuestas y métricas de satisfacción.",
		href: "/feedback-system/ratings",
		icon: (
			<svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
			</svg>
		),
		color: "from-yellow-400 to-amber-500",
	},
	{
		name: "Reportes",
		description: "Accede a los reportes detallados de feedback.",
		href: "/feedback-system/reports",
		icon: (
			<svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
		),
		color: "from-red-500 to-rose-600",
	},
	{
		name: "Promedios",
		description: "Consulta los puntajes promedio por conductor.",
		href: "/feedback-system/avg-ratings",
		icon: (
			<svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
			</svg>
		),
		color: "from-pink-500 to-rose-600",
	},
];

export default function FeedbackSystemHome() {
	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="mb-10">
				<h1 className="text-2xl font-bold text-gray-900">Sistema de Feedback</h1>
				<p className="text-gray-500 text-sm mt-1">
					Gestiona las calificaciones, reportes y métricas de satisfacción de los servicios de TowIt.
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
