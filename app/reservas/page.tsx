import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotonCancelarReserva } from "./boton-cancelar";
import { BotonConfirmarReserva } from "./boton-confirmar";
import {
  botonPrimario,
  tarjeta,
  textoAyuda,
  tituloPagina,
} from "@/app/lib/estilos";

const etiquetaEstado: Record<string, string> = {
  pendiente:
    "border-amber-200 bg-amber-50 text-amber-800",
  confirmada:
    "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelada: "border-slate-200 bg-slate-100 text-slate-600",
};

const estadosValidos = ["pendiente", "confirmada", "cancelada"] as const;

type Props = {
  searchParams: Promise<{ estado?: string | string[] }>;
};

export default async function PaginaReservas({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.estado;
  const estadoParam =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const estadoFiltro =
    estadoParam &&
    estadosValidos.includes(estadoParam as (typeof estadosValidos)[number])
      ? estadoParam
      : undefined;

  const reservas = await prisma.reserva.findMany({
    where: estadoFiltro ? { estado: estadoFiltro } : undefined,
    orderBy: { fecha: "asc" },
    include: { servicio: true },
  });

  const enlaceFiltro = (estado: string | null) =>
    estado ? `/reservas?estado=${estado}` : "/reservas";

  const pillClass = (activo: boolean) =>
    activo
      ? "bg-emerald-700 text-white shadow-sm"
      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900";

  return (
    <div>
      <div className="mb-2 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={tituloPagina}>Reservas</h1>
          <p className={`${textoAyuda} mt-1`}>
            Citas agendadas y su estado.
          </p>
        </div>
        <Link href="/reservas/nueva" className={`${botonPrimario} shrink-0`}>
          Nueva reserva
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={enlaceFiltro(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${pillClass(estadoFiltro === undefined)}`}
        >
          Todas
        </Link>
        {estadosValidos.map((e) => (
          <Link
            key={e}
            href={enlaceFiltro(e)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${pillClass(estadoFiltro === e)}`}
          >
            {e}
          </Link>
        ))}
      </div>

      {reservas.length === 0 ? (
        <div className={tarjeta}>
          <p className="text-sm text-slate-500">
            No hay reservas que coincidan con este criterio.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reservas.map((reserva) => (
            <li
              key={reserva.id}
              className={`${tarjeta} flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{reserva.nombre}</p>
                <p className="mt-0.5 text-xs text-slate-500">{reserva.correo}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {reserva.servicio.nombre}
                  <span className="text-slate-400"> · </span>
                  {new Date(reserva.fecha).toLocaleString("es-SV", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <span
                  className={`mt-2 inline-block rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                    etiquetaEstado[reserva.estado] ?? etiquetaEstado.pendiente
                  }`}
                >
                  {reserva.estado}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end sm:ml-4">
                <BotonConfirmarReserva
                  id={reserva.id}
                  estado={reserva.estado}
                />
                <BotonCancelarReserva
                  id={reserva.id}
                  estado={reserva.estado}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
