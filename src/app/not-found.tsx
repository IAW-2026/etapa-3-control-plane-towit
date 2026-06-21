import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto p-12 text-center flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-lg text-slate-600 mb-8">Página no encontrada</p>
      <Link href="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium">
        Volver al inicio
      </Link>
    </div>
  );
}
