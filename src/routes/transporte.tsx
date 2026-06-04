import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export const Route = createFileRoute("/transporte")({
  component: Transporte,
});

import { ridesRepository, normalizePhone } from "@/repositories/ridesRepository";
import { localBoostsRepository } from "@/repositories/localBoostsRepository";
import { reviewsRepository } from "@/repositories/reviewsRepository";
import { RideDriver, ServiceType, AvailabilityStatus } from "@/types/rides";
import { ReviewSection } from "@/components/ReviewSection";
import { LocalTransportMap } from "@/components/LocalTransportMap";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Star, Car, Truck, Bike, Users, MessageSquare, ShieldAlert, Search, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const statusConfig = {
  online: { label: "Online agora", color: "bg-green-500" },
  disponivel_hoje: { label: "Disponível hoje", color: "bg-orange-500" },
  indisponivel: { label: "Indisponível", color: "bg-slate-400" },
};

const serviceIcons = {
  carona: <Users className="w-4 h-4" />,
  carro: <Car className="w-4 h-4" />,
  frete: <Truck className="w-4 h-4" />,
  moto: <Bike className="w-4 h-4" />,
  van: <Car className="w-4 h-4" />,
};

export default function Transporte() {
  const [rides, setRides] = useState<RideDriver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | undefined>();
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    serviceType: "all",
    status: "all",
  });
  const [isLoading, setIsLoading] = useState(true);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = ridesRepository.filter({
        origin: filters.origin || undefined,
        destination: filters.destination || undefined,
        serviceType: filters.serviceType === "all" ? undefined : filters.serviceType,
        status: filters.status === "all" ? undefined : filters.status,
      });

      const sorted = localBoostsRepository.sortByBoost(filtered, 'transporte', 'id');
      setRides(sorted);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);


  const handleSelectDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
    const element = cardRefs.current[driverId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleWhatsApp = (driver: RideDriver) => {
    const phone = normalizePhone(driver.phone);
    const message = encodeURIComponent(`Olá, vi seu transporte no Axéí no Bairro. Gostaria de saber se você está disponível para uma viagem.`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Transporte Alternativo no Bairro</h1>
        <p className="text-slate-500 font-medium mt-2">Carros e motos da comunidade para viagens combinadas direto pelo WhatsApp.</p>
        <div className="h-1.5 w-20 bg-orange-600 mt-4 rounded-full" />
      </header>

      <div className="bg-slate-900 text-white p-8 rounded-3xl mb-12 border-l-8 border-orange-600 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4 italic text-orange-500">Como funciona</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: '1', t: 'Escolha um motorista' },
              { n: '2', t: 'Clique em WhatsApp' },
              { n: '3', t: 'Combine valor e local' },
              { n: '4', t: 'Realize a viagem' }
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-2 bg-slate-800 p-4 rounded-2xl">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-600 text-white font-black">{step.n}</span>
                <p className="text-xs font-bold leading-tight">{step.t}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-orange-600 shrink-0" />
          <div>
            <p className="text-sm md:text-base font-medium text-slate-300">
              <span className="block font-bold text-white mb-1">Este não é um aplicativo de corrida em tempo real.</span>
              Os motoristas são profissionais e moradores cadastrados na plataforma. Combine valor, ponto de encontro, rota e condições diretamente pelo WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <LocalTransportMap 
            drivers={rides} 
            onSelectDriver={handleSelectDriver} 
            selectedDriverId={selectedDriverId}
          />
        </div>
        <div>
          <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8 text-slate-900">
              <Filter className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-black uppercase tracking-widest">Filtrar Viagens</span>
            </div>
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Origem</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Ex: Centro" 
                    className="pl-10 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all" 
                    value={filters.origin}
                    onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Destino</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Ex: Praia" 
                    className="pl-10 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all" 
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Veículo</label>
                <Select value={filters.serviceType} onValueChange={(val) => setFilters({ ...filters, serviceType: val })}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50">
                    <SelectValue placeholder="Todos os veículos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="frete">Frete</SelectItem>
                    <SelectItem value="carona">Carona</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Disponibilidade</label>
                <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50">
                    <SelectValue placeholder="Qualquer status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer um</SelectItem>
                    <SelectItem value="online">Online agora</SelectItem>
                    <SelectItem value="disponivel_hoje">Disponível hoje</SelectItem>
                    <SelectItem value="indisponivel">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ origin: "", destination: "", serviceType: "all", status: "all" })}
              className="mt-8 h-12 rounded-xl border-slate-200 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50"
            >
              Limpar Filtros
            </Button>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full">
            <ListingSkeleton type="ride" count={6} />
          </div>
        ) : rides.length > 0 ? (

          rides.map((driver) => {
            const activeBoost = localBoostsRepository.getActiveBoostForTarget('transporte', driver.id);
            const isBoosted = !!activeBoost;
            const isSelected = selectedDriverId === driver.id;

            return (
              <div key={driver.id} ref={el => { cardRefs.current[driver.id] = el; }}>
                <Card 
                  className={`
                    rounded-[2.5rem] border-slate-100 hover:shadow-2xl transition-all duration-500 group overflow-hidden relative
                    ${isBoosted ? 'border-2 border-orange-200' : ''}
                    ${isSelected ? 'ring-4 ring-orange-600 ring-offset-4 scale-[1.02] shadow-2xl' : ''}
                  `}
                >
                  {isBoosted && (
                    <div className="absolute top-6 right-6 z-10 bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 border-2 border-white uppercase tracking-wider">
                      <Star className="w-3 h-3 fill-white" />
                      Premium
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                        <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[driver.availabilityStatus].color} shadow-sm shadow-black/10`} />
                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">
                          {statusConfig[driver.availabilityStatus].label}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-black uppercase py-1 px-3 border-slate-200 text-slate-400">
                        {driver.serviceType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-5 mb-8">
                      <div className={`
                        w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300
                        ${isSelected ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white group-hover:bg-orange-600'}
                      `}>
                        {serviceIcons[driver.serviceType as keyof typeof serviceIcons] || <Car className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-black text-2xl text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight italic">{driver.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{driver.vehicle}</p>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <div className="flex items-center gap-1 text-orange-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-black">
                              {(() => {
                                const { average, total } = reviewsRepository.getAverageRating('transporte', driver.id);
                                return total > 0 ? average : 'Novo';
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10">
                      <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2">
                          <Search className="w-3 h-3" /> Rotas Disponíveis
                        </div>
                        <div className="space-y-2">
                          {driver.routes.map((r, i) => (
                            <div key={i} className="text-xs font-black text-slate-700 flex items-center gap-3 italic">
                              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">{r.origin}</span>
                              <span className="text-orange-600">→</span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">{r.destination}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {driver.locationNote && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 px-2 italic">
                          <Star className="w-3 h-3 text-orange-500" /> {driver.locationNote}
                        </div>
                      )}

                      {driver.notes && (
                        <p className="text-sm text-slate-500 leading-relaxed px-2 font-medium">"{driver.notes}"</p>
                      )}

                      {driver.price && (
                        <div className="pt-4 border-t border-slate-100 flex items-baseline gap-2 px-2">
                          <span className="text-[10px] font-black uppercase text-slate-400">Combine a partir de</span>
                          <span className="text-2xl font-black text-slate-900 italic">{driver.price}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="w-full h-12 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Ver Avaliações
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8">
                          <ReviewSection targetId={driver.id} targetType="transporte" />
                        </DialogContent>
                      </Dialog>

                      <Button 
                        onClick={() => handleWhatsApp(driver)}
                        className="w-full bg-slate-900 hover:bg-orange-600 h-16 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 group/btn italic"
                      >
                        <MessageSquare className="w-6 h-6 fill-white" />
                        Chamar no WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3 italic">Nenhum motorista encontrado</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
              Tente outro bairro ou mude o tipo de veículo para encontrar transporte disponível.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ origin: "", destination: "", serviceType: "all", status: "all" })}
              className="h-14 px-8 rounded-2xl border-slate-200 font-black uppercase text-xs tracking-[0.2em]"
            >
              Ver todos os motoristas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
