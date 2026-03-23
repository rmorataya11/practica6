"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const EsquemaReserva = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("El correo no es válido."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  servicioId: z.coerce.number({ message: "Debe seleccionar un servicio." }),
});

function sumarMinutos(fecha: Date, minutos: number) {
  return new Date(fecha.getTime() + minutos * 60_000);
}

function intervalosSeSolapan(
  aInicio: Date,
  aFin: Date,
  bInicio: Date,
  bFin: Date
) {
  return aInicio < bFin && bInicio < aFin;
}

export async function crearReserva(_estadoPrevio: any, formData: FormData) {
  const campos = EsquemaReserva.safeParse({
    nombre: formData.get("nombre"),
    correo: formData.get("correo"),
    fecha: formData.get("fecha"),
    servicioId: formData.get("servicioId"),
  });

  if (!campos.success) {
    return {
      errores: campos.error.flatten().fieldErrors,
      mensaje: "Error de validación.",
    };
  }

  const servicio = await prisma.servicio.findUnique({
    where: { id: campos.data.servicioId },
  });

  if (!servicio) {
    return {
      errores: {
        servicioId: ["El servicio no existe."],
      },
      mensaje: "Error de validación.",
    };
  }

  const inicioNuevo = new Date(campos.data.fecha);
  const finNuevo = sumarMinutos(inicioNuevo, servicio.duracion);

  const existentes = await prisma.reserva.findMany({
    where: {
      servicioId: campos.data.servicioId,
      estado: { not: "cancelada" },
    },
    include: { servicio: true },
  });

  for (const r of existentes) {
    const inicioExistente = r.fecha;
    const finExistente = sumarMinutos(r.fecha, r.servicio.duracion);
    if (
      intervalosSeSolapan(inicioNuevo, finNuevo, inicioExistente, finExistente)
    ) {
      return {
        errores: {
          fecha: [
            "Ya existe una reserva que se solapa con este horario para el servicio.",
          ],
        },
        mensaje: "Error de validación.",
      };
    }
  }

  await prisma.reserva.create({
    data: {
      nombre: campos.data.nombre,
      correo: campos.data.correo,
      fecha: new Date(campos.data.fecha),
      servicioId: campos.data.servicioId,
    },
  });

  revalidatePath("/reservas");
  redirect("/reservas");
}

export async function cancelarReserva(id: number) {
  try {
    await prisma.reserva.update({
      where: { id },
      data: { estado: "cancelada" },
    });
    revalidatePath("/reservas");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo cancelar la reserva." };
  }
}
