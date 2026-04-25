import type { AiRole } from '../../lib/aiChat';

type MessageBubbleProps = {
  role: AiRole;
  content: string;
  isLoading?: boolean;
};

export function MessageBubble({ role, content, isLoading = false }: MessageBubbleProps) {
  const label = role === 'user' ? 'You' : 'Assistant';

  return (
    <article className={`ai-chat-bubble ${role}`} aria-label={`${label} message`}>
      <p className="date-time-picker__eyebrow">{label}</p>
      <p className={isLoading ? 'ai-chat-bubble__content ai-chat-bubble__content--loading' : 'ai-chat-bubble__content'}>
        {content}
      </p>
    </article>
  );
}