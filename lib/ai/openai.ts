import { createOpenAI } from '@ai-sdk/openai';

/**
 * OpenAI provider configuration
 * 
 * This provider contains language model support for the OpenAI chat and completion APIs
 * and embedding model support for the OpenAI embeddings API.
 * 
 * Models available:
 * - gpt-4o: Latest model with image input and tool usage support
 * - gpt-4o-mini: Smaller, faster version of gpt-4o
 * - gpt-4-turbo: Previous generation model with image input and tool usage
 * - gpt-3.5-turbo: Faster, more economical model
 * - o1-mini, o1-preview, o3-mini: Reasoning models with different capabilities
 * 
 * Embedding models:
 * - text-embedding-3-large: 3072 dimensions (default)
 * - text-embedding-3-small: 1536 dimensions
 * 
 * See documentation: https://platform.openai.com/docs/models
 */
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  // Optional custom settings
  // baseURL: 'https://api.openai.com/v1', // Default URL prefix for API calls
  // organization: '', // OpenAI Organization
  // project: '', // OpenAI project
  // headers: {}, // Custom headers to include in requests
  compatibility: 'strict', // Use strict mode for OpenAI API
}); 