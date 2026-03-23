"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { crearServicio } from "@/app/actions/servicios";
import {
  input,
  label,
  botonPrimario,
  mensajeError,
  textoAyuda,
  tituloPagina,
} from "@/app/lib/estilos";

const estadoInicial = { errores: {} as Record<string, string[]>, mensaje: "" };

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={botonPrimario}>
      {pending ? "Guardando..." : "Crear servicio"}
    </button>
  );
}

export default function PaginaNuevoServicio() {
  const [estado, accion] = useActionState(crearServicio, estadoInicial);

  return (
    <div className="mx-auto max-w-md">
      <h1 className={tituloPagina}>Nuevo servicio</h1>
      <p className={`${textoAyuda} mb-8 mt-1`}>
        Define nombre, descripción y duración en minutos.
      </p>

      <form action={accion} className="space-y-5">
        <div>
          <label className={label}>Nombre</label>
          <input name="nombre" type="text" className={input} />
          {estado.errores?.nombre && (
            <p className={mensajeError}>{estado.errores.nombre}</p>
          )}
        </div>

        <div>
          <label className={label}>Descripción</label>
          <textarea name="descripcion" rows={3} className={input} />
        </div>

        <div>
          <label className={label}>Duración (minutos)</label>
          <input name="duracion" type="number" min={1} className={input} />
          {estado.errores?.duracion && (
            <p className={mensajeError}>{estado.errores.duracion}</p>
          )}
        </div>

        <BotonEnviar />
      </form>
    </div>
  );
}
