import React from "react";
import HeaderLogo from "./HeaderLogo";
import HeaderUserSection from "./HeaderUserSection";
import { currentUser } from "@clerk/nextjs/server";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import HeaderDropdown from "./HeaderDropdown";

export default async function Header() {
	const user = await currentUser();
	const role = user?.publicMetadata?.role as string | undefined;

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

				<HeaderLogo />

				<div className="flex items-center gap-1 sm:gap-2 md:gap-3">
					{/* MENUES DESPLEGABLES: Solo se muestra si el usuario está logueado */}
					<Show when="signed-in">

						{role == "admin" && (
							<>
								<HeaderDropdown
									title="Customer App"
									icon={
										<svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
									}
									items={[
										{ label: "Dashboard", href: "/customer-admin/dashboard", colorClass: "bg-indigo-600" },
										{ label: "Clientes", href: "/customer-admin/customers", colorClass: "bg-emerald-600" },
										{ label: "Viajes", href: "/customer-admin/trips", colorClass: "bg-cyan-600" },
										{ label: "Vehículos", href: "/customer-admin/vehicles", colorClass: "bg-amber-600" },
									]}
								/>
								<HeaderDropdown
									title="Towers App"
									icon={
										<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
										</svg>
									}
									items={[
										{ label: "Administradores", href: "/tower-system/admins", colorClass: "bg-fuchsia-600" },
										{ label: "Usuarios", href: "/tower-system/users", colorClass: "bg-teal-600" },
										{ label: "Asignaciones", href: "/tower-system/assignments", colorClass: "bg-rose-600" },
										{ label: "Vehículos", href: "/tower-system/vehicles", colorClass: "bg-yellow-600" },
									]}
								/>
								<HeaderDropdown
									title="Pagos"
									icon={
										<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
										</svg>
									}
									items={[
										{ label: "Pagos", href: "/payment-system/payments", colorClass: "bg-blue-600" },
										{ label: "Liquidaciones", href: "/payment-system/disbursements", colorClass: "bg-purple-600" },
										{ label: "Reembolsos", href: "/payment-system/refunds", colorClass: "bg-orange-600" },
									]}
								/>
								<HeaderDropdown
									title="Feedback"
									icon={
										<svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
										</svg>
									}
									items={[
										{ label: "Calificaciones", href: "/feedback-system/ratings", colorClass: "bg-yellow-500" },
										{ label: "Reportes", href: "/feedback-system/reports", colorClass: "bg-red-600" },
										{ label: "Promedios", href: "/feedback-system/avg-ratings", colorClass: "bg-pink-600" },
									]}
								/>
							</>
						)}

					</Show>

					<Show when="signed-out">
						<SignInButton mode="modal">
							<button className="px-3 sm:px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-zinc-800 whitespace-nowrap transition-colors">
								Iniciar sesión
							</button>
						</SignInButton>
					</Show>

					<Show when="signed-in">
						<UserButton />
					</Show>
				</div>

			</div>
		</header>
	);
}
