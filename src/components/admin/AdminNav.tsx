import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Visão Geral", href: "/admin", icon: "📊" },
  { label: "Lojas", href: "/admin/lojas", icon: "🏪" },
  { label: "Aprovações", href: "/admin/aprovacoes", icon: "⏳" },
  { label: "Planos", href: "/admin/planos", icon: "📈" },
];

export function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-col w-64 bg-card border-r border-border fixed h-screen left-0 top-0 pt-6 overflow-y-auto">
        <div className="px-6 mb-8">
          <h2 className="text-lg font-bold text-foreground">ADMIN</h2>
          <p className="text-xs text-muted-foreground mt-1">Axêi no Bairro</p>
        </div>

        <div className="space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-foreground hover:bg-accent/10 transition-colors [&.active]:bg-accent/20"
              activeProps={{ className: "bg-accent/20" }}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto px-4 pb-6 border-t border-border pt-4 text-xs text-muted-foreground">
          <p>Ambiente de teste</p>
          <p>localStorage apenas</p>
        </div>
      </nav>

      {/* Mobile Nav Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <h2 className="font-bold text-foreground">ADMIN</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-accent/10 rounded-lg"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-card border-b border-border z-30 shadow-lg">
          <div className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-foreground hover:bg-accent/10 transition-colors [&.active]:bg-accent/20"
                activeProps={{ className: "bg-accent/20" }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
