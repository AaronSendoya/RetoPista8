"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const enConsulta = pathname === "/consulta";

  return (
    <header className="sticky top-0 z-50 border-b border-pista-slate/10 bg-white shadow-sm">
      <div className="mx-auto flex h-28 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/Copia de PISTA-8-LOGO.png"
            alt="Pista 8"
            width={280}
            height={158}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </Link>
        {enConsulta ? (
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-pista-charcoal transition-all duration-200 hover:bg-pista-bg-pastel"
          >
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>
        ) : (
          <Link
            href="/consulta"
            className="rounded-lg bg-pista-red px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-pista-red/90"
          >
            Consultar Asistencia
          </Link>
        )}
      </div>
    </header>
  );
}
