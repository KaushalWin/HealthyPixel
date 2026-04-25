# Feature 7 — AI Health Chat

## Product Scope

Users can open a dedicated AI Health Chat page, select a provider and model, paste their own provider API key, and ask general health-tracking or wellness questions from a frontend-only screen.

## Functional Summary

1. User opens the AI Health Chat page from the Help section.
2. User selects a provider: DeepSeek or OpenAI (ChatGPT).
3. Model options update dynamically based on the selected provider.
4. After provider and model are selected, the matching API-key input appears.
5. API keys stay in React state only and are never persisted to localStorage, sessionStorage, cookies, or app context.
6. Chat input remains disabled until provider, model, and API key are all available.
7. Every request prepends a fixed health-focused system prompt.
8. Requests go directly from the browser to the selected provider endpoint.
9. Loading, provider errors, and empty replies are shown inline in the UI.
10. Clear Chat wipes the in-memory conversation state.
11. Switching provider clears API key and chat state.
12. Switching model resets the conversation while keeping the current provider key in memory.

## Provider and Model Matrix

| Provider | Models |
|----------|--------|
| DeepSeek | `deepseek-chat`, `deepseek-reasoner` |
| OpenAI | `gpt-4o`, `gpt-4o-mini` |

## Route

| Page | Route |
|------|-------|
| AI Health Chat | `/ai-chat` |

## Privacy and Security Notes

- PixieTrack does not store the API key or transcript.
- Typed chat content is sent directly to the selected provider when the user sends a message.
- This frontend-only pattern is intentionally lightweight but is not production-secure for shared or managed secrets.

## UX Notes

- The page shows a visible medical disclaimer near the top.
- The composer displays `Thinking...` while waiting for a provider response.
- Error states remain on the page without reloading the conversation shell.
- The feature is available from the main menu only, not from quick actions, so fast-entry actions stay focused on daily tracking flows.