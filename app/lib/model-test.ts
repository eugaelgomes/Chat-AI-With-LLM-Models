import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicialize os clients aqui mesmo
const perplexityClient = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function testModelConnection(modelId: string): Promise<{
  status: "online" | "offline" | "slow";
  responseTime: number;
}> {
  const startTime = Date.now();

  try {
    let testResponse;
    let isOk = false;

    switch (modelId) {
      case "deepseek":
        testResponse = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_DEEPSEEK_API_KEY}`,
          },
        });
        isOk = testResponse.ok;
        break;

      case "phi-4":
        testResponse = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            Authorization: `Bearer ${process.env.PHI4_API_KEY}`,
          },
        });
        isOk = testResponse.ok;
        break;

      case "deepcode":
        testResponse = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            Authorization: `Bearer ${process.env.DEEPCODE_API_KEY}`,
          },
        });
        isOk = testResponse.ok;
        break;

      case "perplexity":
        testResponse = await perplexityClient.models.list();
        isOk = true; // Se chegou aqui sem erro, considera ok
        break;

      case "gemini":
        // Método correto para testar conexão com Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        // Teste simples de conexão
        await model.generateContent({
          contents: [{ role: "user", parts: [{ text: "Ping" }] }],
        });
        isOk = true;
        break;

      default:
        return { status: "offline", responseTime: 0 };
    }

    const responseTime = Date.now() - startTime;
    return {
      status: isOk ? (responseTime > 1000 ? "slow" : "online") : "offline",
      responseTime,
    };
  } catch (error) {
    console.error(`Error testing model ${modelId}:`, error);
    return { status: "offline", responseTime: 0 };
  }
}
