"use client";

import { cancelarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonPeligro, mensajeError } from "@/app/lib/estilos";

export function BotonCancelarReserva({
  id,
  estado,
}: {
  id: number;
  estado: string;
}) {
  const [error, setError] = useState<string | null>(null);

  if (estado === "cancelada") {
    return null;
  }

  async function manejarClick() {
    const resultado = await cancelarReserva(id);
    if (!resultado.exito) {
      setError(resultado.mensaje ?? "Error desconocido.");
    }
  }

  return (
    <div className="w-full text-right sm:w-auto">
      <button type="button" onClick={manejarClick} className={botonPeligro}>
        Cancelar reserva
      </button>
      {error && <p className={mensajeError}>{error}</p>}
    </div>
  );
}
