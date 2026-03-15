const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions"

export const KIMI_CONFIG = {
  model: "kimi-k2-turbo-preview",
  temperature: 0.6,
  systemPrompt: "你是一位专业的职业顾问和简历优化专家，擅长帮助求职者提升简历质量和面试成功率。",
}

export async function callKimi(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(KIMI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: KIMI_CONFIG.model,
      temperature: KIMI_CONFIG.temperature,
      messages: [
        { role: "system", content: KIMI_CONFIG.systemPrompt },
        { role: "user",   content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Kimi API error: ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}
