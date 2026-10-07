import { z } from "zod";

const wifiPassword = z
  .string()
  .min(8, "La contraseña WiFi debe tener al menos 8 caracteres.")
  .max(63, "La contraseña WiFi no puede superar los 63 caracteres.")
  .refine((value) => !/[\u0000-\u001f\u007f]/.test(value), {
    message: "La contraseña WiFi contiene caracteres no permitidos.",
  });

export const loginSchema = z.object({
  password: z
    .string()
    .min(1, "Ingresá la contraseña de administrador.")
    .max(200, "La contraseña es demasiado larga."),
});

export const updateWifiSchema = z.object({
  password: wifiPassword,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateWifiInput = z.infer<typeof updateWifiSchema>;
