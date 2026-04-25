export default function ChatMessage({ message, company }) {
  const { role, content } = message;

  if (role === 'system') {
    return (
      <div className="system-message">
        <span className="system-icon">✅</span>
        <span>{content}</span>
      </div>
    );
  }

  if (role === 'user') {
    return (
      <div className="message-row user-row">
        <div className="message user-message">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="message-row bot-row">
      <div className="bot-avatar" style={{ background: company.color }}>
        {company.logo}
      </div>
      <div className="message bot-message" style={{ '--bot-color': company.color, '--bot-light': company.colorLight }}>
        {content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}
