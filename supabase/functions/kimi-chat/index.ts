import "@supabase/functions-js/edge-runtime.d.ts"
import { callKimi } from "../_shared/kimi.ts"
import { buildDiagnosePrompt } from "../_shared/prompts/diagnose.ts"
import { buildOptimizePrompt } from "../_shared/prompts/optimize.ts"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS })
  }

  const apiKey = Deno.env.get("KIMI_API_KEY")
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "未配置 KIMI_API_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    })
  }

  const { action, resume, jobDescription } = await req.json()

  if (!resume) {
    return new Response(JSON.stringify({ error: "缺少简历内容" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    })
  }

  try {
    const prompt = action === "optimize"
      ? buildOptimizePrompt(resume, jobDescription)
      : buildDiagnosePrompt(resume, jobDescription)

    const result = await callKimi(prompt, apiKey)

    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    })
  }
})
