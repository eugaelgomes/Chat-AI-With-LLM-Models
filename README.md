# CodaWeb IA - Chat

Um aplicativo de chat multimodelos que utiliza diferentes modelos de IA (Gemini, Perplexity e DeepSeek) para responder perguntas, com histórico de conversas e seleção de modelo.

## Funcionalidades

- **Multi-modelo de IA**: Escolha entre Gemini, Perplexity ou DeepSeek
- **Histórico de conversas**: Visualize e retome conversas anteriores, mas somente na janela ativa do usuário no navegador
- **Respostas em markdown**: Suporte a formatação avançada incluindo LaTeX
- **Modo automático**: Seleção automática do melhor modelo disponível
- **Persistência local**: Histórico salvo no localStorage do navegador
- **Responsivo**: Design que funciona em dispositivos móveis e desktop

## Tecnologias utilizadas

### Frontend

- Next.js (App Router)
- React
- Framer Motion (animações)
- Tailwind CSS (estilização)
- React Markdown (renderização de respostas)
- Katex (renderização de fórmulas matemáticas)

### Backend

- Next.js API Routes
- Vercel KV (armazenamento de histórico)
- OpenAI API (para Perplexity)
- Google Generative AI (para Gemini)
- OpenRouter API (para DeepSeek)

## Como executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   PERPLEXITY_API_KEY=sua_chave_aqui
   GEMINI_API_KEY=sua_chave_aqui
   OPENROUTER_API_KEY=sua_chave_aqui
   KV_REST_API_URL=url_do_vercel_kv
   KV_REST_API_TOKEN=token_do_vercel_kv
   ```
4. Execute o projeto:
   ```bash
   npm run dev
   ```

## Modelos suportados

- **Gemini**: Modelo generativo da Google
- **Perplexity**: Modelo sonar da Perplexity AI
- **DeepSeek**: Modelo deepseek-chat via OpenRouter

## Limitações

- Rate limiting de 10 requisições por minuto por IP
- Histórico de conversas expira após 30 minutos inativos
- Seleção de modelo só pode ser alterada em novos chats
