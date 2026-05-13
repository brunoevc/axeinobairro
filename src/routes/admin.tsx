import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminNav } from "@/components/admin/AdminNav";
import logo from "@/assets/logo.jpg";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Admin — Axêi no Bairro" },
      {
        name: "description",
        content: "Painel administrativo do Axêi no Bairro",
      },
    ],
  }),
});

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 flex-shrink-0">
        <AdminNav />
      </div>

      {/* Mobile Top Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40">
        <AdminNav />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="hidden md:block sticky top-0 bg-card border-b border-border h-16 z-30">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Axêi no Bairro"
                className="h-8 w-8 rounded-lg"
              />
              <h1 className="font-bold text-foreground">
                ADMIN — Axêi no Bairro
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              localStorage • Ambiente de Teste
            </p>
          </div>
        </header>

        {/* Mobile Header Spacing */}
        <div className="md:hidden h-16" />

        {/* Content Area */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
