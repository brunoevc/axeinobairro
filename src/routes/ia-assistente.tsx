import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, Send, ArrowLeft, Bot, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ia-assistente")({
  component: AIAssistant,
});

function AIAssistant() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", content: "Olá! Sou o assistente do seu bairro. Como posso te ajudar hoje?" }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: "Entendi! Estou procurando as melhores opções no bairro para você agora mesmo..." 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 pt-10 pb-4 border-b border-border flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2 hover:bg-secondary rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assistente IA
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Inteligência Local</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'bot' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                {msg.role === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${msg.role === 'bot' ? 'bg-card border border-border/50' : 'bg-primary text-white shadow-lg'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="p-6 border-t border-border bg-card">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Pergunte qualquer coisa sobre o bairro..."
            className="flex-1 bg-secondary/50 border border-border/50 rounded-2xl px-5 py-3 outline-none focus:border-primary transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="p-3 bg-primary text-white rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Mercado aberto agora?", "Eventos hoje", "Eletricista perto"].map(suggestion => (
            <button 
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-secondary px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
