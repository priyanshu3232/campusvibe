// CampusVibe — Claude AI API helper utilities

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1024;

/**
 * Core function to call the Claude API.
 * @param {string} systemPrompt - System-level instruction for the model
 * @param {string} userMessage - The user's message
 * @param {string} apiKey - Anthropic API key
 * @returns {Promise<string|null>} The text response, or null on error
 */
export async function callClaude(systemPrompt, userMessage, apiKey) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    return null;
  }
}

/**
 * Improve a college student's social media post — keeps it casual and Hinglish-friendly.
 */
export async function enhancePost(text, apiKey) {
  const systemPrompt =
    'You are a social media expert for Indian college students. ' +
    'Improve the given post to make it more engaging, relatable, and share-worthy. ' +
    'Keep the tone casual and Hinglish-friendly (mix of Hindi and English is fine). ' +
    'Do not add hashtags — just return the improved post text.';
  return callClaude(systemPrompt, text, apiKey);
}

/**
 * Generate relevant hashtags for a post.
 */
export async function generateHashtags(text, apiKey) {
  const systemPrompt =
    'You are a hashtag generator for Indian college social media posts. ' +
    'Generate 5-8 relevant, trending hashtags for the given post. ' +
    'Include a mix of general and college-specific tags. ' +
    'Return only the hashtags separated by spaces, nothing else.';
  return callClaude(systemPrompt, text, apiKey);
}

/**
 * Make a post funnier while keeping it relatable.
 */
export async function makeFunnier(text, apiKey) {
  const systemPrompt =
    'You are a comedy writer who specialises in Indian college humour. ' +
    'Rewrite the given post to make it funnier while keeping the core message. ' +
    'Use Hinglish, memes references, and relatable college jokes where appropriate. ' +
    'Return only the rewritten post.';
  return callClaude(systemPrompt, text, apiKey);
}

/**
 * Translate a post between English and Hindi.
 */
export async function translatePost(text, targetLang, apiKey) {
  const systemPrompt =
    `You are a translator. Translate the given text to ${targetLang}. ` +
    'Keep the tone casual and natural — do not make it sound formal or robotic. ' +
    'If translating to Hindi, use Devanagari script. ' +
    'Return only the translated text.';
  return callClaude(systemPrompt, text, apiKey);
}

/**
 * Campus AI assistant — Hinglish-capable, college context-aware.
 */
export async function chatWithAssistant(message, context, apiKey) {
  const systemPrompt =
    'You are CampusVibe AI, a friendly and helpful campus assistant for Indian college students. ' +
    'You can chat in English, Hindi, or Hinglish — match the language the user writes in. ' +
    'You know about college life, academics, placements, hostel life, fests, clubs, and student culture. ' +
    'Be witty, supportive, and relatable. Keep answers concise unless the user asks for detail. ' +
    (context ? `Context: ${context}` : '');
  return callClaude(systemPrompt, message, apiKey);
}

/**
 * Generate 10 MCQ trivia questions as a JSON array.
 */
export async function generateTrivia(apiKey) {
  const systemPrompt =
    'You are a trivia question generator for Indian college students. ' +
    'Generate 10 multiple-choice trivia questions. Mix topics: GK, pop culture, science, sports, Bollywood, Indian history, and college life. ' +
    'Return ONLY a valid JSON array with objects shaped like: ' +
    '{"question": "...", "options": ["A", "B", "C", "D"], "answer": "B", "explanation": "..."}. ' +
    'No extra text, no markdown — pure JSON.';
  return callClaude(systemPrompt, 'Generate 10 trivia questions.', apiKey);
}

/**
 * Validate a word in the word chain game.
 */
export async function validateWord(word, category, previousWord, apiKey) {
  const systemPrompt =
    'You are a word-chain game judge. ' +
    'The player must say a valid English word that: ' +
    '1. Belongs to the given category (if provided). ' +
    '2. Starts with the last letter of the previous word (if provided). ' +
    'Respond ONLY with a JSON object: {"valid": true/false, "reason": "..."}. ' +
    'No extra text — pure JSON.';
  const userMsg =
    `Word: "${word}"` +
    (category ? `, Category: "${category}"` : '') +
    (previousWord ? `, Previous word: "${previousWord}"` : '');
  return callClaude(systemPrompt, userMsg, apiKey);
}
