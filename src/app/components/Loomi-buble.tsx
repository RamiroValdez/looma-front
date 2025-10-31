import { useState, useEffect, useRef } from 'react';
import { useChatConversation, sendChatMessage, type ChatMessageDto } from '../../infrastructure/services/ChatService';

interface LoomiBubbleProps {
  chapterId: number;
  chapterContent: string;
}

export default function LoomiBubble({ chapterId, chapterContent }: LoomiBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversationData, isLoading: isLoadingHistory } = useChatConversation(chapterId);

  useEffect(() => {
    if (conversationData && messages.length === 0) {
      setMessages(conversationData);
    }
  }, [conversationData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    const tempUserMsg: ChatMessageDto = {
      userId: 0,
      chapterId,
      content: userMessage,
      userMessage: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await sendChatMessage({
        chapterId,
        message: userMessage,
        chapterContent,
      });

      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMsg: ChatMessageDto = {
        userId: 0,
        chapterId,
        content: 'Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.',
        userMessage: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-1 right-6 z-50 w-30 h-30 rounded-full hover:transition-all flex items-center justify-center group hover:cursor-pointer"
        aria-label="Abrir chat con Loomi"
      >
        {isOpen ? (
            <img src="/img/Loomi-Bubble.png" alt="Loomi" className="w-30 h-30 object-contain" />
        ) : (
          <img src="/img/Loomi-Bubble.png" alt="Loomi" className="w-30 h-30 object-contain" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-15 z-50 w-98 h-[42rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-[#1a2fa1] text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <img src="/img/Loomi-Bubble.png" alt="Loomi" className="w-30 h-30 object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Loomi</h3>
              <p className="text-base text-blue-100">Tu asistente de escritura</p>
            </div>
          </div>

          <button
            className="w-5 h-5 absolute top-2 right-2 text-white hover:cursor-pointer text-xl font-bold"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar chat"
          >
            <p>X</p>
          </button>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-sm">Cargando historial...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <img src="/img/Loomi-Bubble.png" alt="Loomi" className="w-18 h-25 mb-3 opacity-90" />
                <p className="text-gray-600 text-sm">
                  ¡Hola! Soy Loomi, tu asistente de escritura creativa.
                  <br />
                  ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.userMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.userMessage
                          ? 'bg-[#1a2fa1] text-white rounded-br-none'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu idea a Loomi..."
                rows={2}
                disabled={isSending}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1a2fa1] disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending}
                className="bg-[#1a2fa1] text-white rounded-lg px-4 py-2 hover:bg-[#152580] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSending ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 -rotate-275" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 18l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}