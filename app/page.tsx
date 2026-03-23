import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { botonPrimario, tarjeta, textoAyuda, tituloPagina } from "@/app/lib/estilos";

export default async function PaginaInicio() {
  const [totalServicios, totalReservas] = await Promise.all([
    prisma.servicio.count(),
    prisma.reserva.count(),
  ]);

  return (
    <div>
      <h1 className={tituloPagina}>Bienvenido</h1>
      <p className={`${textoAyuda} mb-8 mt-1`}>
        Resumen de tu panel de citas y servicios.
      </p>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className={`${tarjeta} relative overflow-hidden border-emerald-100`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500" />
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Servicios
          </p>
          <p className="text-3xl font-semibold tabular-nums text-slate-900">
            {totalServicios}
          </p>
        </div>
        <div
          className={`${tarjeta} relative overflow-hidden border-sky-100`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-500 to-indigo-500" />
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Reservas
          </p>
          <p className="text-3xl font-semibold tabular-nums text-slate-900">
            {totalReservas}
          </p>
        </div>
      </div>
      <Link href="/servicios/nuevo" className={botonPrimario}>
        Agregar servicio
      </Link>
    </div>
  );
}
