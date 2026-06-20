
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import HeaderDropdown, { DropdownItem } from "./HeaderDropdown";
import HeaderLogo from "./HeaderLogo";


export default async function Header() {
	const { sessionClaims } = await auth();
	if (sessionClaims?.role == "admin") {
		const paymentsDropdownItems: DropdownItem[] = [
			{ label : "Pagos", href: "/payment-system/payments", colorClass: "bg-blue-600" },
			{ label : "Liquidaciones", href: "/payment-system/disbursements", colorClass: "bg-purple-600" },
			{ label : "Reembolsos", href: "/payment-system/refunds", colorClass: "bg-orange-600" },
		];
	}

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

				<HeaderLogo />

				<div className="flex items-center gap-3 sm:gap-6">
					{/* MENUES DESPLEGABLES: Solo se muestra si el usuario está logueado */}
					<Show when="signed-in">

						{sessionClaims?.role == "admin" && (
							<HeaderDropdown 
								title="Administrar sistema de pagos" 
								items={[
									{ label: "Usuarios", href: "/admin/users", colorClass: "bg-green-600" },
									{ label: "Configuración", href: "/admin/settings", colorClass: "bg-yellow-600" }
								]}
							/>
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