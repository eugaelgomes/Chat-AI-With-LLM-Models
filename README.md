
# CodaWeb IA - Chat (v.2.0)

Esta é a segunda versão do CodaWeb IA, uma plataforma interativa de chat com modelos de linguagem avançados (LLMs). O projeto visa oferecer uma ferramenta útil e acessível para desenvolvedores, especialmente iniciantes, buscando apoio no aprendizado e na escrita de código.

## 💡 Motivação

A percepção de um crescente interesse no uso de APIs de IA para criação de ferramentas e chatbots em comunidades de programação e sites de freelancer (Quora, Reddit, Workana) motivou este projeto. A primeira versão do CodaWeb IA foi um protótipo experimental para integrar essas APIs. Esta segunda versão foca em usabilidade, persistência de dados e robustez da aplicação, baseada em melhorias e ideias coletadas.

## ✨ Funcionalidades

- **Multi-modelo de IA**: Seleção entre Gemini, Perplexity ou DeepSeek.
- **Autenticação Social**: Login com Google e GitHub via OAuth.
- **Histórico de Conversas Persistente**: Interações salvas em banco de dados (Vercel KV), permitindo retomar conversas após sair da plataforma.
- **Contextualização entre Mensagens**: Manutenção de contexto para respostas mais relevantes e coerentes.
- **Verificação da Saúde da API (Ping)**: Checagem da disponibilidade da API do modelo antes do envio da mensagem.
- **Sistema de Tema**: Alternância entre tema claro e escuro.
- **Respostas em Markdown**: Suporte à formatação avançada, incluindo LaTeX.
- **Modo Automático**: Seleção automática do melhor modelo de IA disponível.
- **Responsivo**: Design adaptável para dispositivos móveis e desktop.

## 🛠️ Tecnologias Utilizadas

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
- Prisma JS
- NextAuth

## 🚀 Como Executar

1. Clone o repositório.
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
   # Adicione as variáveis para NextAuth (Google e GitHub OAuth) conforme a documentação do NextAuth
   GOOGLE_CLIENT_ID=seu_google_client_id
   GOOGLE_CLIENT_SECRET=seu_google_client_secret
   GITHUB_ID=seu_github_id
   GITHUB_SECRET=seu_github_secret
   NEXTAUTH_URL=http://localhost:3000 # ou sua URL de desenvolvimento/produção
   NEXTAUTH_SECRET=gere_uma_string_secreta_forte # Ex: openssl rand -base64 32
   ```
4. Executar o projeto:
   ```bash
   npm install
   npm run dev
   ```

## 🧠 Modelos Suportados

- **Gemini**: Modelo generativo da Google.
- **Perplexity**: Modelo  Perplexity ( API Paga).
- **DeepSeek**: Modelo via OpenRouter.
- **DeepCode**: Modelo via OpenRouter.
- **Phi-4**: Modelo da Microsoft.

## 📈 Próximos Passos

A próxima etapa do CodaWeb IA foca em direcioná-lo para programação, com suporte a desenvolvedores júnior. Isto inclui a criação de uma base de conhecimento em programação para auxiliar na solução de problemas submetidos.

## ⚠️ Limitações

- Rate limiting de 10 requisições por minuto por IP.
- A seleção de modelo só pode ser alterada em novos chats.

Link: [https://ai.codaweb.com.br]([https://ai.codaweb.com.br](CodaWeb AI 2.0))
