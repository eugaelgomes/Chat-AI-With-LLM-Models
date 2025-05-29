import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL não informada." }, { status: 400 });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const content = await page.content();
    await browser.close();

    return NextResponse.json({ html: content });
  } catch (error) {
    console.error("Erro ao acessar a página:", error);
    return NextResponse.json({ error: "Erro ao acessar a página." }, { status: 500 });
  }
}
