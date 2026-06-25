'use client'

import React from "react";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import HeaderDropdown from "./HeaderDropdown";

const NAV_DROPDOWNS = [
  {
    title: "Sistema de pagos",
    items: [
      { label: "Pagos", href: "/payment-system/payments", colorClass: "bg-blue-600" },
      { label: "Liquidaciones", href: "/payment-system/disbursements", colorClass: "bg-purple-600" },
      { label: "Reembolsos", href: "/payment-system/refunds", colorClass: "bg-orange-600" },
    ],
  },
  {
    title: "Customer App",
    items: [
      { label: "Dashboard", href: "/customer-admin/dashboard", colorClass: "bg-indigo-600" },
      { label: "Clientes", href: "/customer-admin/customers", colorClass: "bg-emerald-600" },
      { label: "Viajes", href: "/customer-admin/trips", colorClass: "bg-cyan-600" },
      { label: "Vehículos", href: "/customer-admin/vehicles", colorClass: "bg-amber-600" },
    ],
  },
  {
    title: "Sistema de feedback",
    items: [
      { label: "Calificaciones", href: "/feedback-system/ratings", colorClass: "bg-yellow-500" },
    ],
  },
] as const;

function HeaderUserSectionInner() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      <Show when="signed-in">
        {role === "admin" && NAV_DROPDOWNS.map((dd) => (
          <HeaderDropdown key={dd.title} title={dd.title} items={[...dd.items]} />
        ))}
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
  );
}

export default React.memo(HeaderUserSectionInner);
