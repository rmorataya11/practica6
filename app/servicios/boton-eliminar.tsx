"use client";

import { eliminarServicio } from "@/app/actions/servicios";
import { useState } from "react";
import { botonPeligro, mensajeError } from "@/app/lib/estilos";

export function BotonEliminarServicio({ id }: { id: number }) {
  const [error, setError] = useState<string | null>(null);

  async function manejarClick() {
    const resultado = await eliminarServicio(id);
    if (!resultado.exito) {
      setError(resultado.mensaje ?? "Error desconocido.");
    }
  }

  return (
    <div className="shrink-0 text-right">
      <button type="button" onClick={manejarClick} className={botonPeligro}>
        Eliminar
      </button>
      {error && <p className={`${mensajeError} max-w-[14rem]`}>{error}</p>}
    </div>
  );
}
