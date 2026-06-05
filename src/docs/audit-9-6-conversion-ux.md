# Auditoria de Conversão, Design System e Loops de Visibilidade — Phase 9.6

## A. Auditoria de Design System e UX

Esta auditoria avalia a consistência visual e a experiência do usuário (UX) com foco na percepção de valor e facilidade de navegação.

### 1. Tipografia
*   **Status:** Médio
*   **Observação:** Uso consistente de fontes, mas a hierarquia em alguns cards (ex: `MerchantCard`) pode ser densa. Títulos em `font-black` são fortes para a marca, mas podem comprometer a leitura em descrições longas.
*   **Correção (Médio):** Padronizar tamanhos de fonte entre módulos para evitar saltos visuais ao navegar entre "Negócios" e "Serviços".

### 2. Botões
*   **Status:** Oportunidade
*   **Observação:** O sistema de variantes (`default`, `whatsapp`, `hero`, `outline`) é excelente. No entanto, o botão de WhatsApp no `MerchantCard` e no `PlanCard` compete visualmente com o botão de "Ver Detalhes".
*   **Oportunidade:** Criar uma hierarquia clara onde o botão de conversão direta (WhatsApp) tenha maior peso visual apenas em estágios avançados do funil.

### 3. Cards
*   **Status:** Crítico
*   **Observação:** `MerchantCard` possui excesso de badges (Categoria, Distância, Avaliação, Status, Exposure, Delivery). Isso gera carga cognitiva alta.
*   **Correção (Crítico):** Simplificar a interface do card. Agrupar badges secundários ou exibi-los apenas no hover/detalhes para destacar o que realmente importa: Nome, Foto e Avaliação.

### 4. Contraste
*   **Status:** Médio
*   **Observação:** Alguns badges de categoria usam fundo cinza claro com texto cinza, o que pode falhar em testes de acessibilidade em telas com brilho baixo.
*   **Correção (Médio):** Aumentar o contraste dos elementos informativos secundários.

### 5. Responsividade
*   **Status:** Médio
*   **Observação:** A aplicação é prioritariamente mobile-first (correto), mas em tablets (viewport médio) o grid de cards pode deixar espaços em branco excessivos.
*   **Correção (Oportunidade):** Otimizar o layout de grid para telas médias para manter a densidade de informação.

### 6. Consistência Visual
*   **Status:** Médio
*   **Observação:** Diferentes módulos (Classificados vs Negócios) possuem pequenas variações no estilo de inputs e cabeçalhos.
*   **Oportunidade:** Unificar os `Manager` components sob um único padrão de cabeçalho de seção.

---

## B. Auditoria de Identidade e Primeiros 30 Segundos

### Em 5 segundos: O usuário entende o que é o Axêi?
*   **Diagnóstico:** Sim, mas a mensagem atual foca muito em "Busca". O conceito de "Ecossistema Digital" ainda não é a primeira coisa percebida.
*   **Melhoria:** Refinar o Hero para comunicar "Tudo o que o seu bairro oferece, em um só lugar".

### Em 15 segundos: O usuário entende o que pode fazer?
*   **Diagnóstico:** O menu flutuante e as categorias ajudam, mas o excesso de opções (Transporte, Saúde, Eventos) pode confundir o usuário novo sobre por onde começar.
*   **Melhoria:** Destacar os 3 fluxos principais (Comprar, Contratar, Informar-se).

### Em 30 segundos: O usuário entende por que deveria voltar?
*   **Diagnóstico:** Falta um elemento de "Recorrência" claro na Home (como notícias frescas ou promoções do dia com timer).
*   **Melhoria:** Implementar a seção de "Notícias Locais" ou "Ofertas Relâmpago" com maior destaque.

---

## C. Auditoria de Valor Percebido e Monetização

### Análise de Planos
*   **Bairro+:** Percebido como "entrada". Benefícios claros (Visibilidade básica).
*   **Destaque:** O nome sugere visibilidade, mas o "como" o destaque acontece no feed precisa ser mais visual (ex: borda colorida ou selo).
*   **Premium:** Maior valor percebido. O benefício oculto é a "Prioridade no Algoritmo de Busca" que precisa ser mais explícito na venda.
*   **Patrocinador:** Valor de autoridade. Precisa de uma seção exclusiva na Home ("Apoiado por").
*   **Apoiador:** Valor social. Pouco percebido atualmente. Deveria estar ligado a causas comunitárias.

---

## D. Auditoria de Fluxo de Receita

| Estágio | Diagnóstico | Oportunidade |
| :--- | :--- | :--- |
| **Visitante** | Chega via busca orgânica ou link direto. | Melhorar o SEO de bairro específico. |
| **Usuário** | Navega por categorias. | Implementar "Salvar nos Favoritos" (Retenção). |
| **Cliente** | Clica no WhatsApp de um negócio. | Notificar o representante sobre o lead gerado. |
| **Recorrente** | Volta para ver horários ou transporte. | Criar o "PWA" (Instalar App) para acesso rápido. |
| **Indicação** | Compartilha um negócio. | Criar loop de recompensa para quem indica novos negócios. |

---

## E. Auditoria de Loops Comerciais

*   **Negócios → Serviços:** Ao ver uma loja de materiais de construção, sugerir "Encanadores" próximos.
*   **Transporte → Comunidades:** Ao buscar horários de ônibus, mostrar avisos da associação de moradores local.
*   **Classificados → Negócios:** Ao ver um item usado, mostrar lojas que vendem o item novo com garantia.
*   **Recomendações → Parceiros:** Sistema de "Quem comprou aqui também contratou...".

---

## F. Auditoria de Patrocinadores

*   **Hierarquia:** Atualmente os patrocinadores (Exposure A) aparecem no topo, mas visualmente se misturam com os outros.
*   **Rotação:** Necessidade de um sistema de "Sorteio Ponderado" para que todos os Premium/Patrocinadores tenham tempo de tela igual no topo.
*   **Justiça:** Exibir métricas reais para o patrocinador via Painel Administrativo para justificar o investimento.

---

## G. Auditoria de Alavancas de Crescimento

### 1. Receita (Alavanca: Upsell)
*   Transformar o "Isento" em "Bairro+" através de um período de teste de 15 dias de visibilidade.

### 2. Retenção (Alavanca: Conteúdo Útil)
*   A "Agenda do Bairro" e "Telefones Úteis" são os maiores ganchos de retorno diário.

### 3. Rede (Alavanca: Representantes)
*   Criar um kit digital para o representante vender com facilidade (PDF de apresentação gerado automaticamente).

### 4. Autoridade (Alavanca: Prova Social)
*   Exibir "X pessoas entraram em contato com este negócio este mês" (Metric-driven authority).

---

## H. Planejamento de Execução

### Quick Wins (30 dias)
1. Simplificar o `MerchantCard` (remover badges excessivos).
2. Adicionar seção "Ofertas do Dia" na Home.
3. Corrigir contraste de tags e categorias.

### Médio Prazo (90 dias)
1. Implementar sistema de "Favoritos" para usuários.
2. Criar o fluxo de "Upsell Automático" (Mensagem para o isento sugerindo plano pago).
3. Melhorar a visualização de Patrocinadores na Home (Seção dedicada).

### Longo Prazo (180 dias+)
1. Lançamento do Dashboard do Lojista (Self-service de métricas).
2. Expansão para bairros adjacentes com sistema de multi-instância local.
3. Programa de Afiliados para Representantes.

---

**Conclusão:**
Para transformar o Axêi no Bairro em um ecossistema autossustentável, o foco deve sair da "Quantidade de cadastros" para a "Qualidade da conexão". Menos ruído visual, mais prova social e fluxos claros de conversão são os pilares para aumentar a receita e a retenção.
