export type AppointmentStatus = "solicitado" | "confirmado" | "concluido" | "cancelado";

export interface Appointment {
  id: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}
