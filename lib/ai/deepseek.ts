import { createDeepSeek } from '@ai-sdk/deepseek';

/**
 * DeepSeek provider configuration
 * 
 * This provider offers access to powerful language models through the DeepSeek API,
 * including their DeepSeek-V3 model.
 * 
 * Models available:
 * - deepseek-chat: For general text generation with object generation and tool usage support
 * - deepseek-reasoner: For text generation with reasoning capabilities
 * 
 * See documentation: https://github.com/deepseek-ai/DeepSeek-V3
 */
export const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  // Optional custom settings
  // baseURL: 'https://api.deepseek.com/v1', // Default URL prefix for API calls
  // headers: {}, // Custom headers to include in requests
});