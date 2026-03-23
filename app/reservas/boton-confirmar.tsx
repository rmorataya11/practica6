"use client";

import { confirmarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonPrimario } from "@/app/lib/estilos";

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
    <div className="text-right">
      <button type="button" onClick={manejarClick} className={botonPrimario}>
        Confirmar
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
