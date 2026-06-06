import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  User, 
  Store, 
  Briefcase, 
  Car, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/")({
  component: UserCentralHub,
});

type RoleKey = 'morador' | 'lojista' | 'profissional' | 'motorista' | 'comunidade' | 'representante';

interface RoleCardProps {
  id: RoleKey;
  title: string;
  description: string;
  icon: any;
  path: string;
  isActive: boolean;
  onActivate: (id: RoleKey) => void;
}

function RoleCard({ id, title, description, icon: Icon, path, isActive, onActivate }: RoleCardProps) {
  return (
    <Card className={`overflow-hidden border-2 transition-all duration-300 rounded-[2.5rem] group ${
      isActive 
        ? "border-orange-100 bg-white shadow-xl shadow-orange-100/20" 
        : "border-slate-100 bg-slate-50/50 grayscale hover:grayscale-0 hover:border-slate-200"
    }`}>
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
            isActive ? "bg-orange-600 text-white" : "bg-slate-200 text-slate-400"
          }`}>
            <Icon className="w-7 h-7" />
          </div>
          {isActive ? (
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-widest px-3 py-1">
              Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="text-slate-400 border-slate-200 font-black text-[10px] uppercase tracking-widest px-3 py-1">
              Inativo
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">{title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 min-h-[3rem]">
          {description}
        </p>

        {isActive ? (
          <Button 
            asChild
            className="w-full h-12 bg-slate-900 hover:bg-orange-600 text-white rounded-xl font-black italic uppercase tracking-widest text-[10px] transition-all"
          >
            <Link to={path}>
              Acessar Painel
              <ArrowRight className="ml-2 w-3 h-3" />
            </Link>
          </Button>
        ) : (
          <Button 
            onClick={() => onActivate(id)}
            variant="outline"
            className="w-full h-12 border-slate-200 text-slate-600 hover:bg-white hover:border-orange-500 hover:text-orange-600 rounded-xl font-black italic uppercase tracking-widest text-[10px] transition-all"
          >
            Ativar esta função
            <PlusCircle className="ml-2 w-3 h-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function UserCentralHub() {
  const [userRoles, setUserRoles] = useState<RoleKey[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("axei_user_roles");
    if (stored) {
      try {
        setUserRoles(JSON.parse(stored));
      } catch (e) {
        setUserRoles(['morador']);
      }
    } else {
      // Default role
      const initial: RoleKey[] = ['morador'];
      localStorage.setItem("axei_user_roles", JSON.stringify(initial));
      setUserRoles(initial);
    }
  }, []);

  const handleActivate = (id: RoleKey) => {
    const updated = [...userRoles, id];
    localStorage.setItem("axei_user_roles", JSON.stringify(updated));
    setUserRoles(updated);
    toast.success(`Função ${id} ativada com sucesso!`, {
      description: "Agora você tem acesso ao painel específico."
    });
  };

  const roles: Omit<RoleCardProps, 'isActive' | 'onActivate'>[] = [
    {
      id: 'morador',
      title: 'Morador',
      description: 'Gerencie seu perfil, endereços e acompanhe sua atividade no bairro.',
      icon: User,
      path: '/painel/morador'
    },
    {
      id: 'lojista',
      title: 'Lojista',
      description: 'Anuncie seu negócio, crie ofertas e venda para toda a comunidade.',
      icon: Store,
      path: '/painel/lojista'
    },
    {
      id: 'profissional',
      title: 'Profissional',
      description: 'Ofereça seus serviços e receba solicitações de clientes locais.',
      icon: Briefcase,
      path: '/painel/profissional'
    },
    {
      id: 'motorista',
      title: 'Motorista',
      description: 'Realize entregas ou transportes e aumente sua renda no bairro.',
      icon: Car,
      path: '/painel/motorista'
    },
    {
      id: 'comunidade',
      title: 'Comunidade',
      description: 'Lidere ou participe de iniciativas que melhoram seu bairro.',
      icon: Users,
      path: '/painel/comunidade'
    },
    {
      id: 'representante',
      title: 'Representante',
      description: 'Ajude o Axêi a crescer e ganhe comissões por novos parceiros.',
      icon: TrendingUp,
      path: '/painel/representante'
    }
  ];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100 rounded-full">
            <Sparkles className="h-3 w-3" />
            Ecossistema Digital Ativo
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            Meu <span className="text-orange-600">Axêi</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Centralize sua participação no bairro e gerencie suas múltiplas funções.
          </p>
        </div>

        <Card className="bg-slate-900 text-white border-none rounded-3xl shadow-xl shadow-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Status da Conta</p>
              <p className="text-sm font-bold text-white mt-1 italic uppercase tracking-tight">Membro Verificado</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roles.map((role) => (
          <RoleCard 
            key={role.id}
            {...role}
            isActive={userRoles.includes(role.id)}
            onActivate={handleActivate}
          />
        ))}
      </div>

      <section className="bg-violet-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-3">Expandir meu impacto</h2>
            <p className="text-violet-100 font-medium max-w-md">
              Quanto mais funções você ativa, mais forte fica o ecossistema do seu bairro. Em breve, novos benefícios exclusivos para multi-perfis.
            </p>
          </div>
          <Button variant="secondary" className="h-14 px-10 bg-white text-violet-600 hover:bg-violet-50 rounded-2xl font-black italic uppercase tracking-widest text-xs shadow-xl shadow-violet-900/20">
            Saiba mais sobre o Ecossistema
          </Button>
        </div>
      </section>
    </div>
  );
}