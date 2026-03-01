# CCPC Admission Analytics

## Current State
- ComparisonTab data (achievements, college comparison table, top colleges, data source note) is in React state only — lost on reload
- No AI integration exists
- Backend does NOT have getComparisonSettings/updateComparisonSettings endpoints

## Requested Changes (Diff)

### Add
**Frontend:**
- Persist ComparisonTab state to localStorage under key "ccpc-comparison-settings" so data survives page reloads (for all visitors and admins)
- New `AIService` utility (`src/frontend/src/utils/aiService.ts`) that can call any of 4 AI providers from the browser:
  - Grok (xAI): POST https://api.x.ai/v1/chat/completions, model "grok-3-mini"
  - Gemini (Google): POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
  - Perplexity: POST https://api.perplexity.ai/chat/completions, model "sonar"
  - DeepSeek: POST https://api.deepseek.com/chat/completions, model "deepseek-chat"
  Each takes an apiKey string and the CCPC context prompt, returns the AI-generated text string.

- New `AISettingsModal` component: admin-only modal where admin can enter their API keys for each provider (stored in localStorage, never sent to backend). Shows 4 provider cards (Grok, Gemini, Perplexity, DeepSeek) each with an API key input field and a "Test" button.

- In ComparisonTab (admin-only panel):
  - "AI Auto-Update" section with a provider selector (dropdown with 4 options) and "Run AI Analysis" button
  - Calls the selected provider with the CCPC context prompt
  - Parses the response and updates the achievements cards text + aiSummary display
  - Shows a loading spinner while AI call is in progress
  - Shows the AI result in a highlighted "AI Generated Analysis" card with provider name + timestamp badge
  - Shows error if API key not set (links to AI Settings)

- "AI Settings" button in the admin panel of ComparisonTab (opens AISettingsModal)
- aiSummary state and lastAiRefresh state added to ComparisonTab, persisted to localStorage

### Modify
- ComparisonTab: load initial state from localStorage on mount; save to localStorage on every admin edit (achievements, comparison rows, top colleges, data source note, aiSummary, lastAiRefresh)
- App.tsx: pass sessionToken to ComparisonTab

### Remove
- Nothing removed.

## Implementation Plan
1. **`src/frontend/src/utils/aiService.ts`** — Create utility with 4 provider functions. Shared prompt constant for CCPC context. Each function: accepts apiKey, returns Promise<string> (the AI text) or throws.
2. **`src/frontend/src/components/AISettingsModal.tsx`** — Dialog with 4 API key inputs. Keys stored in localStorage under "ccpc-ai-keys". Show/hide password toggle for each key.
3. **`ComparisonTab.tsx`** — Load/save localStorage on state changes. Add AI panel (admin only) with provider dropdown, Run button, loading state, result card. Add AI Settings button.
4. **`App.tsx`** — Pass sessionToken to ComparisonTab.
