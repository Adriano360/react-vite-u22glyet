import { useEffect, useRef, useState } from 'react';
import agentImage from '../../assets/agente-light-plus.png';
import './AgentAssistant.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    'Olá! Eu sou o Agente Light+. Posso explicar conteúdos do curso e tirar dúvidas gerais sobre subestações. O que você gostaria de saber?',
};

const SUGGESTED_QUESTIONS = [
  'O que faz o relé 86?',
  'Qual a diferença entre TC e TP?',
  'Como funciona a proteção diferencial?',
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 11 18-8-8 18-2-8-8-2Zm8 2 4-4" />
    </svg>
  );
}

function getSessionId() {
  const storageKey = 'lightPlusAgentSession';
  const savedSession = localStorage.getItem(storageKey);

  if (savedSession) return savedSession;

  const sessionId = crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(storageKey, sessionId);
  return sessionId;
}

export function AgentAvatar({ size = 'medium' }) {
  return (
    <span className={`agent-avatar agent-avatar-${size}`} aria-hidden="true">
      <span className="agent-avatar-photo">
        <img src={agentImage} alt="" draggable="false" />
      </span>
      <span className="agent-online-dot" />
    </span>
  );
}

export function AgentAssistant({ nome, isOpen, onClose }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isOpen]);

  async function sendQuestion(questionText) {
    const trimmedQuestion = questionText.trim();
    if (!trimmedQuestion || isSending) return;

    const userMessage = { role: 'user', content: trimmedQuestion };
    const conversation = [...messages, userMessage];

    setMessages(conversation);
    setQuestion('');
    setIsSending(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation
            .filter((message) => message !== INITIAL_MESSAGE)
            .slice(-10),
          studentName: nome,
          sessionId: getSessionId(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Não foi possível falar com o agente neste momento.'
        );
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: data.answer },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'error',
          content:
            error.message ||
            'O agente está temporariamente indisponível. Tente novamente.',
        },
      ]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendQuestion(question);
  }

  if (!isOpen) return null;

  return (
    <div className="agent-layer">
      <button
        type="button"
        className="agent-backdrop"
        aria-label="Fechar Agente Light+"
        onClick={onClose}
      />

      <section
        className="agent-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-dialog-title"
      >
        <header className="agent-dialog-header">
          <AgentAvatar size="large" />
          <div>
            <strong id="agent-dialog-title">Agente Light+</strong>
            <small>Assistente de subestações</small>
          </div>
          <button
            type="button"
            className="agent-close-button"
            onClick={onClose}
            aria-label="Fechar conversa"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="agent-safety-note">
          Conteúdo educativo. Para manobras, siga os procedimentos, diagramas
          oficiais e a orientação do despacho.
        </div>

        <div
          className="agent-messages"
          ref={messagesRef}
          aria-live="polite"
          aria-busy={isSending}
        >
          {messages.map((message, index) => (
            <div
              className={`agent-message agent-message-${message.role}`}
              key={`${message.role}-${index}`}
            >
              {message.role === 'assistant' && <AgentAvatar size="small" />}
              <p>{message.content}</p>
            </div>
          ))}

          {isSending && (
            <div className="agent-message agent-message-assistant">
              <AgentAvatar size="small" />
              <span className="agent-typing" aria-label="Agente digitando">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="agent-suggestions" aria-label="Perguntas sugeridas">
            {SUGGESTED_QUESTIONS.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => sendQuestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form className="agent-form" onSubmit={handleSubmit}>
          <label htmlFor="agent-question" className="sr-only">
            Digite sua pergunta
          </label>
          <textarea
            id="agent-question"
            ref={inputRef}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            placeholder="Pergunte sobre relés, proteção, equipamentos..."
            rows="1"
            maxLength="1200"
            disabled={isSending}
          />
          <button
            type="submit"
            className="agent-send-button"
            disabled={!question.trim() || isSending}
            aria-label="Enviar pergunta"
          >
            <SendIcon />
          </button>
        </form>
      </section>
    </div>
  );
}
