"use client";

import { confirmarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonPrimarioCompacto, mensajeError } from "@/app/lib/estilos";

export function BotonConfirmarReserva({
  id,
  estado,
}: {
  id: number;
  estado: string;
}) {
  const [error, setError] = useState<string | null>(null);

  if (estado !== "pendiente") {
    return null;
  }

  async function manejarClick() {
    const resultado = await confirmarReserva(id);
    if (!resultado.exito) {
      setError(resultado.mensaje ?? "Error desconocido.");
    }
  }

  return (
    <div className="w-full text-right sm:w-auto">
      <button type="button" onClick={manejarClick} className={botonPrimarioCompacto}>
        Confirmar
      </button>
      {error && <p className={mensajeError}>{error}</p>}
    </div>
  );
}
