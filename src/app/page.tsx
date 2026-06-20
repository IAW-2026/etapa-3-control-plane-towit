// src/app/page.tsx
import { Show, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {	
	return (
		<div className="min-h-[calc(100vh-16rem)] overflow-hidden">
			<main className="container mx-auto px-4 pt-6 pb-16 md:pt-10 md:pb-24 flex flex-col items-center">
				<PublicHeroSection />
			</main>
		</div>
	);
}

function PublicHeroSection() {
	return (
		<div className="flex flex-col items-center text-center w-full max-w-3xl mx-auto">
			<div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-8">
				<svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
				</svg>
				Infraestructura Segura de Pagos
			</div>

			<h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 break-words">
				Gestión financiera centralizada para <span className="text-blue-600">TowIt</span>
			</h1>

			<p className="text-base sm:text-lg md:text-xl text-slate-600 mb-12">
				El subsistema de <strong className="font-semibold text-slate-800">TowIt Payments</strong> es el centro de control donde auditamos, procesamos y visualizamos todas las transacciones generadas en los viajes.
			</p>

			
			<div className="text-center">
				<p className="text-slate-500 mb-4 text-sm sm:text-base">Inicia sesión con tu cuenta corporativa para acceder a tu historial de transacciones.</p>
				<SignInButton mode="modal">
					<button className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
						Acceder al Sistema
					</button>
				</SignInButton>
			</div>
		</div>
	);
}

