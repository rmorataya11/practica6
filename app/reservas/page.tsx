import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotonCancelarReserva } from "./boton-cancelar";
import { BotonConfirmarReserva } from "./boton-confirmar";
import { tarjeta } from "@/app/lib/estilos";

const etiquetaEstado: Record<string, string> = {
  pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmada: "bg-green-50 text-green-700 border-green-200",
  cancelada: "bg-gray-100 text-gray-500 border-gray-200",
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

  const linkClass = (activo: boolean) =>
    activo
      ? "text-black font-medium text-sm border-b-2 border-black pb-0.5"
      : "text-gray-500 text-sm hover:text-black";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Reservas</h1>
        <Link
          href="/reservas/nueva"
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
        >
          Nueva reserva
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          href={enlaceFiltro(null)}
          className={linkClass(estadoFiltro === undefined)}
        >
          Todas
        </Link>
        {estadosValidos.map((e) => (
          <Link
            key={e}
            href={enlaceFiltro(e)}
            className={linkClass(estadoFiltro === e)}
          >
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </Link>
        ))}
      </div>

      {reservas.length === 0 ? (
        <p className="text-sm text-gray-400">No hay reservas registradas.</p>
      ) : (
        <ul className="space-y-3">
          {reservas.map((reserva) => (
            <li
              key={reserva.id}
              className={`${tarjeta} flex items-start justify-between`}
            >
              <div>
                <p className="font-medium text-sm">{reserva.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{reserva.correo}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {reserva.servicio.nombre} -{" "}
                  {new Date(reserva.fecha).toLocaleString("es-SV")}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded border ${
                    etiquetaEstado[reserva.estado] ?? etiquetaEstado.pendiente
                  }`}
                >
                  {reserva.estado}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
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
