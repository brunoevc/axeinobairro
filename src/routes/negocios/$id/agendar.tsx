import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { merchants, getMerchantPublicPath } from "@/data/merchants";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAppointment, getAppointments, generateTimeSlots } from "@/lib/scheduling";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, User, Phone, AlertTriangle } from "lucide-react";

export default function Agendar() {
  const { id } = useParams({ from: "/negocios/$id/agendar" });
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;
  const merchant = merchants.find(m => m.id === id);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [customerName, setCustomerName] = useState(search.name || "");
  const [customerPhone, setCustomerPhone] = useState(search.phone || "");
  const [existingApps, setExistingApps] = useState<string[]>([]);

  useEffect(() => {
    if (date) {
      const dateStr = date.toISOString().split("T")[0];
      const apps = getAppointments()
        .filter(app => app.merchantId === id && app.date === dateStr && app.status !== "cancelled")
        .map(app => app.startTime);
      setExistingApps(apps);
    }
  }, [date, id]);

  const handleBooking = () => {
    if (!date || !selectedSlot || !customerName || !customerPhone) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    try {
      // Cálculo de endTime baseado em duração fixa de 60min por enquanto (mock)
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      const endTotalMinutes = hours * 60 + minutes + 60;
      const endHours = Math.floor(endTotalMinutes / 60);
      const endMinutes = endTotalMinutes % 60;
      const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;

      createAppointment({
        merchantId: id as string,
        customerName,
        customerPhone,
        serviceId: "default",
        serviceName: "Atendimento Geral",
        date: date.toISOString().split("T")[0],
        startTime: selectedSlot,
        endTime,
        status: "pending"
      });
      toast.success("Agendamento solicitado com sucesso!");
      navigate({ to: getMerchantPublicPath(merchant), replace: true });
    } catch (error: any) {

      toast.error(error.message);
    }
  };

  if (!merchant) return <div>Loja não encontrada.</div>;

  const slots = date ? generateTimeSlots(date.toISOString().split("T")[0]) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-black text-slate-900">Agendar horário</h1>
          <Link to={getMerchantPublicPath(merchant)} className="hover:underline">
            <p className="text-slate-500 font-bold">{merchant.name}</p>
          </Link>
        </header>


        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-800 font-medium">
            Agenda simulada. Integração com Google Calendar será adicionada em fase futura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="w-5 h-5 text-orange-600" />
                Selecione a Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                disabled={(date: Date) => date < new Date(new Date().setHours(0,0,0,0))}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-slate-100 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Horários Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(slot => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      className={`h-12 font-bold rounded-xl ${
                        existingApps.includes(slot) 
                          ? "opacity-30 cursor-not-allowed bg-slate-100 border-transparent text-slate-400" 
                          : selectedSlot === slot ? "bg-orange-600" : "hover:border-orange-200"
                      }`}
                      disabled={existingApps.includes(slot)}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-100 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-orange-600" />
                  Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    className="rounded-xl h-12 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Telefone/WhatsApp</Label>
                  <Input 
                    id="phone" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="(22) 99999-9999"
                    className="rounded-xl h-12 border-slate-200"
                  />
                </div>
                <Button 
                  onClick={handleBooking}
                  className="w-full bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 mt-4"
                >
                  Confirmar Agendamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
