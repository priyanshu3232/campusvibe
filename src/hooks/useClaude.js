// CampusVibe — React hook for calling the Claude API

import { useState, useCallback } from 'react';
import { callClaude } from '../api/claude';

const API_KEY_STORAGE_KEY = 'campusvibe_api_key';

/**
 * Hook that provides a convenient wrapper around the Claude API.
 *
 * @returns {{
 *   callAI: (systemPrompt: string, message: string) => Promise<string|null>,
 *   loading: boolean,
 *   error: string|null,
 *   hasApiKey: boolean
 * }}
 */
export default function useClaude() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getApiKey = () => {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const apiKey = getApiKey();
  const hasApiKey = Boolean(apiKey);

  const callAI = useCallback(
    async (systemPrompt, message) => {
      const key = getApiKey();

      if (!key) {
        setError('No API key found. Please add your Anthropic API key in settings.');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await callClaude(systemPrompt, message, key);
        if (result === null) {
          setError('Failed to get a response from Claude. Please try again.');
        }
        return result;
      } catch (err) {
        const msg = err?.message || 'An unexpected error occurred.';
        setError(msg);
        console.error('useClaude error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { callAI, loading, error, hasApiKey };
}
