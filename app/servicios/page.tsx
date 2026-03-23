import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotonEliminarServicio } from "./boton-eliminar";
import { botonPrimario, tarjeta, textoAyuda, tituloPagina } from "@/app/lib/estilos";

export default async function PaginaServicios() {
  const servicios = await prisma.servicio.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reservas: true } } },
  });

  return (
    <div>
      <div className="mb-2 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={tituloPagina}>Servicios</h1>
          <p className={`${textoAyuda} mt-1`}>
            Tipos de cita que ofreces y su duración.
          </p>
        </div>
        <Link href="/servicios/nuevo" className={`${botonPrimario} shrink-0`}>
          Agregar servicio
        </Link>
      </div>

      {servicios.length === 0 ? (
        <div className={tarjeta}>
          <p className="text-sm text-slate-500">
            Aún no hay servicios. Crea el primero para empezar a recibir
            reservas.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {servicios.map((servicio) => (
            <li
              key={servicio.id}
              className={`${tarjeta} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{servicio.nombre}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {servicio.duracion} min · {servicio._count.reservas}{" "}
                  reserva(s)
                </p>
              </div>
              <BotonEliminarServicio id={servicio.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
