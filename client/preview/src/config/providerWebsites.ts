// src/config/providerWebsites.ts

// 定义一个对象来存储提供商名称和对应的官网 URL
export const providerWebsites: { [key: string]: string } = {
  "OpenAI": "https://openai.com/",
  "Anthropic": "https://www.anthropic.com/",
  "Google": "https://deepmind.google/technologies/gemini/", // 指向 Gemini 页面
  "Meta": "https://ai.meta.com/llama/", // 指向 Llama 页面
  "DeepSeek": "https://deepseek.com/",
  "Mistral AI": "https://mistral.ai/",
  // 如果未来添加了更多提供商，在这里补充
};

// 提供一个辅助函数，方便获取 URL，并处理找不到的情况
export function getProviderWebsite(providerName: string): string | null {
  const url = providerWebsites[providerName];
  // 如果找到 URL 且不是占位符 '#', 则返回 URL，否则返回 null
  return (url && url !== '#') ? url : null;
}