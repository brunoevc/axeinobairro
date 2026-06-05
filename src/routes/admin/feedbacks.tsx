import { createFileRoute } from "@tanstack/react-router";
import { FeedbackList } from "@/components/admin/FeedbackList";
import { MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/feedbacks")({
  component: AdminFeedbacksPage,
});

function AdminFeedbacksPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-violet-100">
            <Sparkles className="w-3 h-3" />
            Voz do Bairro
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
            Feedbacks
            <MessageCircle className="w-10 h-10 text-orange-600" />
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Acompanhe o que os usuários estão achando da plataforma.
          </p>
        </div>
      </header>

      <FeedbackList />
    </div>
  );
}
