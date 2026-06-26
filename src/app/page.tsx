// src/app/page.tsx
import { Show, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="min-h-[calc(100vh-16rem)] overflow-hidden relative">
			{/* Background gradients */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white -z-20 pointer-events-none" />

			<main className="container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-32 flex flex-col items-center">
				<Show when="signed-out">
					<PublicHeroSection />
				</Show>
				<Show when="signed-in">
					<SignedInDashboard />
				</Show>
			</main>
		</div>
	);
}

function PublicHeroSection() {
	return (
		<div className="flex flex-col items-center text-center w-full max-w-4xl mx-auto relative z-10">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[400px] bg-blue-400/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

			<div className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-blue-700 mb-8 shadow-sm">
				<svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
				</svg>
				Plataforma Administrativa Unificada
			</div>

			<h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
				Control y gestión para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TowIt</span>
			</h1>

			<p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl leading-relaxed">
				El sistema central para auditar pagos, gestionar clientes y recolectar feedback. Toda tu operativa en un solo lugar.
			</p>

			<div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full">
				<SignInButton mode="modal">
					<button className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-slate-900 px-8 py-4 font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto cursor-pointer">
						<span className="absolute right-0 top-0 h-full w-10 translate-x-full bg-white/20 transition-all duration-300 group-hover:-translate-x-4 group-hover:w-full group-hover:bg-white/10 skew-x-12"></span>
						<span className="relative">Iniciar Sesión Segura</span>
					</button>
				</SignInButton>
			</div>

			<div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left border-t border-slate-200/60 pt-12 w-full">
				<div className="group p-4 rounded-2xl transition-colors hover:bg-slate-50/80">
					<div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-blue-200">
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
					</div>
					<h4 className="font-bold text-slate-900 mb-2">Seguridad Enterprise</h4>
					<p className="text-sm text-slate-600 leading-relaxed">Autenticación robusta y control de acceso granular para todos los módulos.</p>
				</div>
				<div className="group p-4 rounded-2xl transition-colors hover:bg-slate-50/80">
					<div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-indigo-200">
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
					</div>
					<h4 className="font-bold text-slate-900 mb-2">Procesamiento Rápido</h4>
					<p className="text-sm text-slate-600 leading-relaxed">Gestión de pagos, reembolsos y liquidaciones en tiempo real.</p>
				</div>
				<div className="group p-4 rounded-2xl transition-colors hover:bg-slate-50/80">
					<div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-emerald-200">
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
					</div>
					<h4 className="font-bold text-slate-900 mb-2">Análisis Detallado</h4>
					<p className="text-sm text-slate-600 leading-relaxed">Visualización de datos e inteligencia de negocio integrada.</p>
				</div>
			</div>
		</div>
	);
}

function SignedInDashboard() {
	const apps = [
		{
			name: "App Clientes (Customer)",
			description: "Sistema para los usuarios que solicitan servicios de grúa (Riders).",
			href: "/customer-admin",
			icon: (
				<svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			),
			color: "from-emerald-500 to-teal-600",
		},
		{
			name: "App Conductores (Tower)",
			description: "Plataforma para los conductores de grúas que atienden los servicios.",
			href: "/tower",
			icon: (
				<svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
				</svg>
			),
			color: "from-amber-500 to-orange-600",
		},
		{
			name: "Sistema de Pagos (Payments)",
			description: "Audita, procesa y visualiza transacciones financieras y liquidaciones.",
			href: "/payment-system",
			icon: (
				<svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
				</svg>
			),
			color: "from-blue-500 to-indigo-600",
		},
		{
			name: "Sistema de Feedback",
			description: "Califica los servicios y visualiza los perfiles de calificaciones.",
			href: "/feedback-system",
			icon: (
				<svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
				</svg>
			),
			color: "from-purple-500 to-fuchsia-600",
		}
	];

	return (
		<div className="w-full max-w-5xl mx-auto flex flex-col items-center">
			<div className="text-center mb-16 relative">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[300px] bg-slate-200/40 blur-[80px] rounded-full -z-10 pointer-events-none" />
				
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
					Panel de Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Central</span>
				</h1>
				<p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
					Bienvenido a la plataforma administrativa de TowIt. Selecciona un módulo para comenzar a gestionar los recursos y operativas de la plataforma.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
				{apps.map((app) => (
					<Link href={app.href} key={app.name} className="group relative rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 flex flex-col overflow-hidden">
						{/* Subtle background gradient on hover */}
						<div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${app.color} opacity-5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-150 group-hover:opacity-10`} />
						
						<div className={`mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:bg-white group-hover:shadow-md border border-slate-100 group-hover:scale-110 group-hover:rotate-3`}>
							{app.icon}
						</div>
						
						<h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">
							{app.name}
						</h3>
						<p className="text-slate-600 flex-1 mb-8 leading-relaxed relative z-10">
							{app.description}
						</p>
						
						<div className="mt-auto flex items-center text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors relative z-10">
							<span className="border-b-2 border-transparent group-hover:border-blue-600 pb-0.5 transition-all">Acceder al módulo</span>
							<svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
