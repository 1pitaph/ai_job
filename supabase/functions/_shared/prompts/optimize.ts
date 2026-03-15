export function buildOptimizePrompt(resume: string, jobDescription?: string): string {
  return `你是一位专业的简历优化专家。请根据以下信息对简历进行全面重写和优化。

岗位描述：
${jobDescription?.trim() || "（未提供，请根据简历内容进行通用优化）"}

原始简历：
${resume}

要求：
1. 保留原有的真实经历和数据，不虚构内容
2. 用更专业、有力的语言重新表述每一条经历
3. 突出与岗位最相关的技能和成就
4. 优化整体结构和逻辑顺序
5. 量化成果（如有可能）

请直接输出优化后的完整简历内容，不需要额外说明。`
}
