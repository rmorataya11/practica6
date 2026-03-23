import { prisma } from "@/lib/prisma";
import { FormularioReserva } from "./formulario";
import { textoAyuda, tituloPagina } from "@/app/lib/estilos";

export default async function PaginaNuevaReserva() {
  const servicios = await prisma.servicio.findMany({
    orderBy: { nombre: "asc" },
  });

  return (
    <div className="mx-auto max-w-md">
      <h1 className={tituloPagina}>Nueva reserva</h1>
      <p className={`${textoAyuda} mb-8 mt-1`}>
        Completa los datos y elige fecha y servicio.
      </p>
      <FormularioReserva servicios={servicios} />
    </div>
  );
}
