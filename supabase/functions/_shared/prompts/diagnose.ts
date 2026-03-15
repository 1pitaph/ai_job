export function buildDiagnosePrompt(resume: string, jobDescription?: string): string {
  if (jobDescription?.trim()) {
    return `请根据以下岗位描述，对简历进行诊断分析。

岗位描述：
${jobDescription}

简历内容：
${resume}

请从以下维度分析：
1. 匹配度评分（0-100分，只给数字和一句话说明）
2. 核心亮点（3-5条）
3. 主要硬伤（2-4条）
4. 优化建议（3-5条具体可执行的建议）

用简洁专业的中文，每个维度用加粗标题加列表输出。`
  }

  return `请对以下简历进行诊断分析。

简历内容：
${resume}

请从以下维度分析：
1. 整体评分（0-100分，只给数字和一句话说明）
2. 核心亮点（3-5条）
3. 主要问题（2-4条）
4. 优化建议（3-5条具体可执行的建议）

用简洁专业的中文，每个维度用加粗标题加列表输出。`
}
