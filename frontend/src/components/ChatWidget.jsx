import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatWidget({ company, onLeadCaptured }) {
  const [history, setHistory] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([
    { role: 'assistant', content: company.greeting }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickPhrases, setShowQuickPhrases] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, isTyping]);

  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    const newHistory = [...history, userMsg];

    setDisplayMessages(prev => [...prev, userMsg]);
    setHistory(newHistory);
    setIsTyping(true);
    setShowQuickPhrases(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory, companyId: company.id })
      });

      const data = await response.json();
      const botMsg = { role: 'assistant', content: data.reply };
      const updatedHistory = [...newHistory, botMsg];

      setHistory(updatedHistory);
      setDisplayMessages(prev => [...prev, botMsg]);

      if (data.metadata?.leadCaptured) {
        const note = { role: 'system', content: `Quote request submitted! Our team will call you within 2 hours.` };
        setDisplayMessages(prev => [...prev, note]);
        onLeadCaptured?.(data.metadata.leadData);
      } else if (data.metadata?.callbackScheduled) {
        const note = { role: 'system', content: `Callback scheduled! Our team will reach you at your preferred time.` };
        setDisplayMessages(prev => [...prev, note]);
        onLeadCaptured?.(data.metadata.bookingData);
      } else if (data.metadata?.humanFlagged) {
        const note = { role: 'system', content: `Escalated to our team — someone will be in touch shortly.` };
        setDisplayMessages(prev => [...prev, note]);
      }
    } catch {
      const errMsg = { role: 'assistant', content: 'I apologise — something went wrong. Please try again or contact our team directly.' };
      setDisplayMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-header" style={{ background: company.color }}>
        <div className="chat-header-left">
          <div className="header-avatar">{company.logo}</div>
          <div className="header-info">
            <div className="header-name">{company.botName}</div>
            <div className="header-status">
              <span className="status-dot" />
              Online now
            </div>
          </div>
        </div>
        <div className="header-badge">{company.badge}</div>
      </div>

      <div className="chat-messages">
        {displayMessages.map((msg, i) => (
          <ChatMessage key={i} message={msg} company={company} />
        ))}

        {isTyping && (
          <div className="message-row bot-row">
            <div className="bot-avatar" style={{ background: company.color }}>
              {company.logo}
            </div>
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showQuickPhrases && (
        <div className="quick-phrases">
          {company.quickPhrases.map((phrase, i) => (
            <button
              key={i}
              className="quick-phrase-chip"
              style={{ '--chip-color': company.color, '--chip-light': company.colorLight }}
              onClick={() => sendMessage(phrase)}
            >
              {phrase}
            </button>
          ))}
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={isTyping} color={company.color} />
    </div>
  );
}
