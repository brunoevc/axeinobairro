import React from 'react';
import { RideDriver } from '@/types/rides';
import { Car, Bike, Truck, Users, MapPin } from 'lucide-react';

interface LocalTransportMapProps {
  drivers: RideDriver[];
  onSelectDriver: (driverId: string) => void;
  selectedDriverId?: string;
}

const zoneColors: Record<string, string> = {
  'Centro': 'bg-slate-200',
  'Vila Madalena': 'bg-orange-100',
  'Mooca': 'bg-blue-100',
  'Jardins': 'bg-emerald-100',
  'Outros': 'bg-slate-100',
};

const serviceIcons = {
  carona: <Users className="w-4 h-4" />,
  carro: <Car className="w-4 h-4" />,
  frete: <Truck className="w-4 h-4" />,
  moto: <Bike className="w-4 h-4" />,
  van: <Car className="w-4 h-4" />,
};

const statusColors = {
  online: 'bg-green-500',
  disponivel_hoje: 'bg-orange-500',
  indisponivel: 'bg-slate-400',
};

export function LocalTransportMap({ drivers, onSelectDriver, selectedDriverId }: LocalTransportMapProps) {
  // Mock layout positions based on mapZone
  const zones = ['Vila Madalena', 'Jardins', 'Centro', 'Mooca'];
  
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h3 className="font-black text-lg uppercase tracking-tight">Mapa de Cobertura Local</h3>
          <p className="text-slate-400 text-xs font-medium">Localização aproximada por bairro</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Hoje</span>
          </div>
        </div>
      </div>

      <div className="relative h-[400px] bg-slate-50 p-4 grid grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div 
            key={zone} 
            className={`${zoneColors[zone] || 'bg-slate-100'} rounded-3xl p-4 border border-white/50 relative overflow-hidden group transition-all`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400/50 absolute top-4 left-4">
              Zona: {zone}
            </span>
            
            <div className="flex flex-wrap gap-3 mt-8 relative z-10">
              {drivers
                .filter(d => d.mapZone === zone || d.bairro === zone)
                .map(driver => (
                  <button
                    key={driver.id}
                    onClick={() => onSelectDriver(driver.id)}
                    className={`
                      relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg transition-all active:scale-90
                      ${selectedDriverId === driver.id 
                        ? 'bg-orange-600 text-white scale-110 ring-4 ring-orange-100' 
                        : 'bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-600'}
                    `}
                  >
                    {serviceIcons[driver.serviceType as keyof typeof serviceIcons]}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${statusColors[driver.availabilityStatus]}`} />
                  </button>
                ))
              }
            </div>
            
            {/* Mock "streets" or visual elements */}
            <div className="absolute bottom-0 right-0 p-4 opacity-5">
              <MapPin className="w-24 h-24 rotate-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-orange-50 border-t border-orange-100 flex items-center gap-3">
        <MapPin className="w-4 h-4 text-orange-600" />
        <p className="text-[10px] md:text-xs text-orange-800 font-bold uppercase tracking-tight">
          Mapa ilustrativo. Confirme o ponto de encontro e localização exata diretamente com o motorista pelo WhatsApp.
        </p>
      </div>
    </div>
  );
}
