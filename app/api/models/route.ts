import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@vercel/kv";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { testModelConnection } from "../../lib/model-test";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Definição de requisitos e modelos de IAs
type Role = "user" | "model";
type ModelType =
  | "auto"
  | "gemini"
  | "perplexity"
  | "deepseek"
  | "deepcode"
  | "phi-4";

// Modelos de API por Bibliotecas
const perplexityClient = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(req: NextRequest) {
  const modelosDisponiveis = [
    { id: "deepseek", nome: "DeepSeek" },
    { id: "deepcode", nome: "DeepCode" },
    { id: "phi-4", nome: "Phi-4" },
    { id: "perplexity", nome: "Perplexity" },
    { id: "gemini", nome: "Gemini" },
  ];

  const modelId = req.nextUrl.searchParams.get("modelId");

  if (modelId) {
    const status = await testModelConnection(modelId);
    return NextResponse.json(status);
  }

  return NextResponse.json({ modelos: modelosDisponiveis });
}

// ... (o resto do código permanece igual)
interface MessagePart {
  text: string;
}

interface ChatMessage {
  role: Role;
  parts: MessagePart[];
}

// ... (continuar com o restante do código original)

interface MemoryCacheEntry {
  modeloEscolhido: ModelType;
  historico: ChatMessage[];
}

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const memoryCache: Record<string, MemoryCacheEntry> = {};

const CACHE_TTL = 300;
const RATE_LIMIT_TTL = 60;
const MAX_REQUESTS = 10;

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate-limit:${ip}`;
  const current = await kv.get(key);
  if (current && parseInt(current as string) >= MAX_REQUESTS) return false;
  await kv.incr(key);
  await kv.expire(key, RATE_LIMIT_TTL);
  return true;
}

function determineRole(question: string): string {
  const q = question.toLowerCase();
  let role = "";

  if (
    q.includes("como") &&
    (q.includes("programar") ||
      q.includes("código") ||
      q.includes("desenvolver"))
  )
    role =
      "Você é um especialista técnico que explica conceitos técnicos de forma clara e direta. Seja conciso e preciso.";
  else if (
    q.includes("ideias") ||
    q.includes("criativo") ||
    q.includes("sugestões")
  )
    role =
      "Você é um assistente criativo que gera ideias inovadoras de forma resumida. Evite explicações longas.";
  else if (
    q.includes("quando") ||
    q.includes("onde") ||
    q.includes("quem") ||
    q.includes("fato")
  )
    role =
      "Você é um assistente focado em fatos. Forneça apenas informações verificáveis e seja extremamente conciso.";
  else
    role =
      "Você é um assistente conciso que fornece respostas diretas e objetivas.";

  if (
    q.includes("em inglês") ||
    q.includes("in english") ||
    q.includes("en español")
  )
    return role;

  return `${role} Responda sempre em português, a menos que o usuário peça outra língua explicitamente.`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    const isValidOrigin =
      origin?.includes("https://ai.codaweb.com.br") ||
      origin?.includes("http://localhost:3000");

    const isValidReferer =
      referer?.includes("https://ai.codaweb.com.br") ||
      referer?.includes("http://localhost:3000");

    if (!isValidOrigin && !isValidReferer) {
      return NextResponse.json({ erro: "Não autorizado." }, { status: 403 });
    }

    if (!(await checkRateLimit(ip))) {
      return NextResponse.json(
        { erro: "Limite de requisições atingido." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      pergunta,
      modelo: modeloRecebido,
      conversationId,
    } = body as {
      pergunta: string;
      modelo?: ModelType;
      conversationId: string;
    };

    if (!pergunta || !conversationId) {
      return NextResponse.json(
        { erro: "Pergunta ou conversationId inválidos." },
        { status: 400 }
      );
    }

    const chatId = conversationId.toString();
    let chatData = memoryCache[chatId];

    if (!chatData) {
      const raw = await kv.hgetall(`chat:${chatId}`);
      if (raw?.historico) {
        chatData = {
          modeloEscolhido: (raw.modeloEscolhido ||
            modeloRecebido ||
            "deepseek") as ModelType,
          historico: JSON.parse(raw.historico as string),
        };
        memoryCache[chatId] = chatData;
      }
    }

    if (!chatData) {
      chatData = {
        modeloEscolhido:
          modeloRecebido === "auto" ? "deepseek" : modeloRecebido || "deepseek",
        historico: [],
      };
    }

    const modeloEscolhido = chatData.modeloEscolhido;
    const history = chatData.historico.slice(-5);
    const role = determineRole(pergunta);

    let respostaFinal = "";
    let fonte = "";

    const messages = [
      { role: "system", content: role },
      ...history.map((msg) => ({
        role: msg.role === "model" ? "assistant" : msg.role,
        content: msg.parts.map((p) => p.text).join(" "),
      })),
      { role: "user", content: pergunta },
    ];

    // DeepSeek
    if (modeloEscolhido === "deepseek") {
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_DEEPSEEK_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://gael.codaweb.com.br",
              "X-Title": "CodaWeb AI",
            },
            body: JSON.stringify({
              model: "deepseek/deepseek-chat-v3-0324:free",
              messages,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error?.message || "Erro no DeepSeek");

        respostaFinal = data.choices[0]?.message?.content || "Sem resposta.";
        fonte = "DeepSeek";
      } catch (error) {
        console.error("Erro no DeepSeek:", error);
        return NextResponse.json(
          {
            status: "erro",
            erro: "O modelo DeepSeek está temporariamente indisponível.",
          },
          { status: 503 }
        );
      }
    }

    // DeepCode
    if (modeloEscolhido === "deepcode") {
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.DEEPCODE_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://gael.codaweb.com.br",
              "X-Title": "CodaWeb AI",
            },
            body: JSON.stringify({
              model: "agentica-org/deepcoder-14b-preview:free",
              messages,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error?.message || "Erro no DeepCode");

        respostaFinal = data.choices[0]?.message?.content || "Sem resposta.";
        fonte = "DeepCode";
      } catch (error) {
        console.error("Erro no DeepCode:", error);
        return NextResponse.json(
          {
            status: "erro",
            erro: "O modelo DeepCode está temporariamente indisponível.",
          },
          { status: 503 }
        );
      }
    }

    // Phi 4
    if (modeloEscolhido === "phi-4") {
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PHI4_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://gael.codaweb.com.br",
              "X-Title": "CodaWeb AI",
            },
            body: JSON.stringify({
              model: "microsoft/phi-4-reasoning-plus:free",
              messages,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error?.message || "Erro no Microsoft Phi-4");

        respostaFinal = data.choices[0]?.message?.content || "Sem resposta.";
        fonte = "phi-4";
      } catch (error) {
        console.error("Erro no Microsoft Phi-4:", error);
        return NextResponse.json(
          {
            status: "erro",
            erro: "O modelo Microsoft Phi-4 está temporariamente indisponível.",
          },
          { status: 503 }
        );
      }
    }

    // Perplexity
    else if (modeloEscolhido === "perplexity") {
      try {
        const openaiMessages: ChatCompletionMessageParam[] = messages.map(
          (m) => ({
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
          })
        );

        const resposta = await perplexityClient.chat.completions.create({
          model: "sonar",
          messages: openaiMessages,
          max_tokens: 300,
          temperature: 0.5,
        });

        respostaFinal =
          resposta.choices[0]?.message?.content || "Sem resposta.";
        fonte = "Perplexity";
      } catch (error) {
        console.error("Erro no Perplexity:", error);
        return NextResponse.json(
          {
            status: "erro",
            erro: "O modelo Perplexity está temporariamente indisponível.",
          },
          { status: 503 }
        );
      }
    }

    // Gemini
    else if (modeloEscolhido === "gemini") {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const chat = model.startChat({
          history: history.slice(-5).map((msg) => ({
            role: msg.role,
            parts: msg.parts,
          })),
        });

        const result = await chat.sendMessage(pergunta);
        const response = await result.response;
        respostaFinal = response.text() || "Sem resposta.";
        fonte = "Gemini";
      } catch (error) {
        console.error("Erro no Gemini:", error);
        return NextResponse.json(
          {
            status: "erro",
            erro: "O modelo Gemini está temporariamente indisponível.",
          },
          { status: 503 }
        );
      }
    }

    // Atualiza histórico
    history.push(
      { role: "user", parts: [{ text: pergunta }] },
      { role: "model", parts: [{ text: respostaFinal }] }
    );

    memoryCache[chatId] = {
      modeloEscolhido: chatData.modeloEscolhido,
      historico: history,
    };

    await kv.hset(`chat:${chatId}`, {
      modeloEscolhido: chatData.modeloEscolhido,
      historico: JSON.stringify(history),
    });
    await kv.expire(`chat:${chatId}`, CACHE_TTL);

    return NextResponse.json({ resposta: respostaFinal.trim(), fonte });
  } catch (error) {
    console.error("[ERRO API ENVIAR]", error);
    return NextResponse.json({ erro: "Erro interno." }, { status: 500 });
  }
}
