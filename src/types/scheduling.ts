export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Appointment {
  id: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO format: YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  googleEventId?: string; // Prepared for future integration
}

export interface BusinessService {
  id: string;
  name: string;
  durationMinutes: number;
  price?: number;
}

export interface BusinessAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isActive: boolean;
}
