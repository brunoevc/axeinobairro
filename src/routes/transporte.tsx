import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/transporte")({
  component: Transporte,
});
import { ridesRepository, normalizePhone } from "@/repositories/ridesRepository";
import { localBoostsRepository } from "@/repositories/localBoostsRepository";
import { reviewsRepository } from "@/repositories/reviewsRepository";
import { RideDriver, ServiceType, AvailabilityStatus } from "@/types/rides";
import { ReviewSection } from "@/components/ReviewSection";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Truck, Bike, Users, MessageSquare, ShieldAlert, Search, Filter } from "lucide-react";

const statusConfig = {
  online: { label: "Online agora", color: "bg-green-500" },
  disponivel_hoje: { label: "Disponível hoje", color: "bg-orange-500" },
  indisponivel: { label: "Indisponível", color: "bg-slate-400" },
};

const serviceIcons = {
  carona: <Users className="w-4 h-4" />,
  frete: <Truck className="w-4 h-4" />,
  moto: <Bike className="w-4 h-4" />,
  van: <Car className="w-4 h-4" />,
};

export default function Transporte() {
  const [rides, setRides] = useState<RideDriver[]>([]);
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    serviceType: "all",
    status: "all",
  });

  useEffect(() => {
    const filtered = ridesRepository.filter({
      origin: filters.origin || undefined,
      destination: filters.destination || undefined,
      serviceType: filters.serviceType === "all" ? undefined : filters.serviceType,
      status: filters.status === "all" ? undefined : filters.status,
    });

    // Phase 8.3: Apply Boosts
    const activeBoosts = localBoostsRepository.getActiveBoostsByType('transporte');
    const levelWeight = { 'A': 3, 'B': 2, 'C': 1, 'none': 0 };

    filtered.sort((a, b) => {
      const boostA = activeBoosts.find(boost => boost.targetId === a.id);
      const boostB = activeBoosts.find(boost => boost.targetId === b.id);
      
      const weightA = boostA ? levelWeight[boostA.level] : levelWeight.none;
      const weightB = boostB ? levelWeight[boostB.level] : levelWeight.none;

      return weightB - weightA;
    });

    setRides(filtered);
  }, [filters]);


  const handleWhatsApp = (driver: RideDriver) => {
    const phone = normalizePhone(driver.phone);
    const message = encodeURIComponent(`Olá, vi seu transporte no Axéí no Bairro. Gostaria de saber se você está disponível para uma viagem.`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Transporte no Bairro</h1>
        <div className="h-1.5 w-20 bg-orange-600 mt-4 rounded-full" />
      </header>

      {/* AVISO DE SEGURANÇA */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl mb-8 flex items-start gap-3 border-l-4 border-orange-600 shadow-xl">
        <ShieldAlert className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
        <p className="text-sm font-medium">
          <span className="font-black uppercase text-orange-600 mr-2">Aviso:</span>
          O Axéí no Bairro apenas conecta moradores e motoristas. Combine valores, horários, rota, identidade do motorista e condições diretamente pelo WhatsApp.
        </p>
      </div>

      {/* FILTROS */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-12">
        <div className="flex items-center gap-2 mb-6 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Filtros de Busca</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Origem (Bairro)" 
              className="pl-10 h-12 rounded-xl" 
              value={filters.origin}
              onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Destino (Bairro)" 
              className="pl-10 h-12 rounded-xl" 
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            />
          </div>
          <Select value={filters.serviceType} onValueChange={(val) => setFilters({ ...filters, serviceType: val })}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Tipo de Serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="carona">Carona</SelectItem>
              <SelectItem value="frete">Frete Pequeno</SelectItem>
              <SelectItem value="moto">Moto</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Disponibilidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer status</SelectItem>
              <SelectItem value="online">Online agora</SelectItem>
              <SelectItem value="disponivel_hoje">Disponível hoje</SelectItem>
              <SelectItem value="indisponivel">Indisponível</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* LISTA DE MOTORISTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.length > 0 ? (
          rides.map((driver) => {
            const activeBoost = localBoostsRepository.getActiveBoostForTarget('transporte', driver.id);
            const isBoosted = !!activeBoost;

            return (
              <Card 
                key={driver.id} 
                className={`rounded-3xl border-slate-100 hover:shadow-xl transition-all duration-300 group overflow-hidden relative ${isBoosted ? 'border-2 border-orange-200' : ''}`}
              >
                {isBoosted && (
                  <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-white" />
                    Destaque
                  </div>
                )}
                <CardContent className="p-6">

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statusConfig[driver.availabilityStatus].color}`} />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {statusConfig[driver.availabilityStatus].label}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase py-1 border-slate-200">
                    {driver.serviceType}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    {serviceIcons[driver.serviceType]}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-orange-600 transition-colors">{driver.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500 font-medium">{driver.vehicle}</p>
                      <div className="flex items-center gap-1 text-orange-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold">
                          {(() => {
                            const { average, total } = reviewsRepository.getAverageRating('transporte', driver.id);
                            return total > 0 ? average : 'Novo';
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl font-bold">
                    <span className="text-orange-600">Rotas:</span>
                    {driver.routes.map((r, i) => (
                      <span key={i}>{r.origin} → {r.destination}</span>
                    ))}
                  </div>
                  {driver.notes && (
                    <p className="text-sm text-slate-500 line-clamp-2 italic">"{driver.notes}"</p>
                  )}
                  {driver.price && (
                    <div className="text-lg font-black text-slate-900">
                      <span className="text-[10px] uppercase text-slate-400 mr-1">A partir de</span>
                      {driver.price}
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        Ver Avaliações
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8">
                      <ReviewSection targetId={driver.id} targetType="transporte" />
                    </DialogContent>
                  </Dialog>

                  <Button 
                    onClick={() => handleWhatsApp(driver)}
                    className="w-full bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl font-black text-white shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-transform hover:-translate-y-1"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chamar no WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })

        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhum motorista encontrado</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Tente outro bairro ou fale com um comerciante local para indicar motoristas da sua região.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ origin: "", destination: "", serviceType: "all", status: "all" })}
              className="rounded-xl border-slate-200 font-bold"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
