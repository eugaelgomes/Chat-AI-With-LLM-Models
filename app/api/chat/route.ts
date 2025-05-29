import { NextRequest, NextResponse } from "next/server";
const modelosDisponiveisParaFrontend = [
  { id: "deepseek", nome: "DeepSeek" },
  { id: "deepcode", nome: "DeepCode" },
  { id: "phi-4", nome: "Phi-4" },
  { id: "perplexity", nome: "Perplexity" },
  { id: "gemini", nome: "Gemini" },
];

async function testModelConnection(modelId: string): Promise<{ modelId: string; status: string; message: string; timestamp: string }> {
  console.log(`Simulando teste de conexão para o modelo: ${modelId}`);
  const knownModels = modelosDisponiveisParaFrontend.map(m => m.id);
  if (knownModels.includes(modelId)) {
    return {
      modelId,
      status: "ok",
      message: `Conexão com ${modelId} bem-sucedida (simulado).`,
      timestamp: new Date().toISOString(),
    };
  } else {
    return {
      modelId,
      status: "error",
      message: `Modelo ${modelId} não encontrado ou falha na conexão (simulado).`,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const modelId = searchParams.get("modelId");

  if (modelId) {
    // Se um modelId é fornecido, testa a conexão
    const status = await testModelConnection(modelId);
    return NextResponse.json(status);
  } else {
    // Se nenhum modelId é fornecido retorna a lista de todos
    return NextResponse.json({ modelos: modelosDisponiveisParaFrontend });
  }
}