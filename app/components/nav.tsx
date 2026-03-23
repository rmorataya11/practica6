"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const enlaces = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/servicios", etiqueta: "Servicios" },
  { href: "/reservas", etiqueta: "Reservas" },
];

export function Nav() {
  const pathname = usePathname();
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setListo(true);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-900"
        >
          <span
            className="h-2 w-2 rounded-full bg-emerald-600"
            aria-hidden
          />
          Panel de reservas
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {enlaces.map(({ href, etiqueta }) => {
            const activo = listo && pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  activo
                    ? "rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900"
                    : "rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                }
              >
                {etiqueta}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
