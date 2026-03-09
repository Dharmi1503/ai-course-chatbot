import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessage, generateSessionId } from "./api";

const sessionId = generateSessionId();

export default function ChatWidget({ courseId = "aiml" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `👋 Hi! I'm your **${courseId.toUpperCase()} Course Assistant**.\n\nAsk me anything and I'll explain it in simple terms!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [btnPop, setBtnPop] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setBtnPop(true);
    setTimeout(() => setBtnPop(false), 200);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    const answer = await sendMessage(input, courseId, sessionId);
    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes slideInBot {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUser {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(0.88); }
          100% { transform: scale(1); }
        }

        .float-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #2563eb;
          border: none;
          cursor: pointer;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37,99,235,0.45);
          animation: pulse 2.5s infinite;
          z-index: 1000;
          transition: background 0.2s, transform 0.2s;
        }
        .float-btn:hover { background: #1d4ed8; transform: scale(1.08); }

        .chat-window {
          position: fixed;
          bottom: 96px;
          right: 20px;
          width: 400px;
          height: calc(100vh - 130px);
          max-height: 610px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
          animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 999;
          display: flex;
          flex-direction: column;
          background: #0f172a;
        }

        .header {
          background: #1e293b;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .header-avatar {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(37,99,235,0.4);
        }
        .header-title { color: #f1f5f9; font-weight: 600; font-size: 14px; letter-spacing: 0.2px; }
        .header-sub { color: #22c55e; font-size: 11px; margin-top: 2px; display: flex; align-items: center; gap: 4px; }
        .online-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; display: inline-block; }
        .close-btn {
          background: rgba(255,255,255,0.07); border: none; color: #94a3b8;
          width: 28px; height: 28px; border-radius: 8px; cursor: pointer;
          font-size: 13px; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.12); color: #f1f5f9; }

        .messages-area {
          flex: 1; overflow-y: auto; padding: 16px 14px;
          display: flex; flex-direction: column; gap: 10px;
          background: #0f172a;
          scrollbar-width: thin;
          scrollbar-color: #1e293b transparent;
        }
        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }

        .bot-row { display: flex; align-items: flex-start; gap: 8px; animation: slideInBot 0.25s ease; }
        .user-row { display: flex; align-items: flex-start; justify-content: flex-end; gap: 8px; animation: slideInUser 0.25s ease; }

        .bot-avatar {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .user-avatar {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: #1e293b;
          display: flex; align-items: center; justify-content: center; font-size: 13px;
          border: 1px solid #334155;
        }

        .bot-bubble {
          background: #1e293b; color: #cbd5e1;
          padding: 10px 13px; border-radius: 4px 14px 14px 14px;
          font-size: 13px; line-height: 1.75; max-width: 83%;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .user-bubble {
          background: #2563eb;
          color: #fff; padding: 10px 13px;
          border-radius: 14px 4px 14px 14px;
          font-size: 13px; line-height: 1.6; max-width: 83%;
          box-shadow: 0 2px 12px rgba(37,99,235,0.3);
        }

        .typing-bubble {
          background: #1e293b; padding: 12px 15px;
          border-radius: 4px 14px 14px 14px;
          display: flex; gap: 5px; align-items: center;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #3b82f6;
          animation: bounce 1.3s infinite;
        }

        .input-area {
          padding: 12px 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; gap: 8px; background: #0f172a;
          align-items: center;
          flex-shrink: 0;
        }
        .input-box {
          flex: 1; padding: 10px 14px; border-radius: 12px;
          border: 1px solid #1e293b; background: #1e293b;
          color: #e2e8f0; font-size: 13px; outline: none;
          transition: border 0.2s, background 0.2s;
          font-family: inherit;
        }
        .input-box:focus { border-color: #2563eb; background: #1e293b; }
        .input-box::placeholder { color: #475569; }

        .send-btn {
          width: 38px; height: 38px; border-radius: 11px;
          background: #2563eb;
          border: none; color: #fff; cursor: pointer;
          font-size: 14px; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .send-btn:hover { background: #1d4ed8; }
        .send-btn.pop { animation: pop 0.2s ease; }

        .md-content p { margin: 3px 0; }
        .md-content strong { color: #60a5fa; font-weight: 600; }
        .md-content ul { padding-left: 16px; margin: 5px 0; }
        .md-content ol { padding-left: 16px; margin: 5px 0; }
        .md-content li { margin: 3px 0; color: #cbd5e1; }
        .md-content h1, .md-content h2, .md-content h3 {
          color: #60a5fa; margin: 8px 0 4px; font-size: 13px; font-weight: 600;
        }
        .md-content code {
          background: #0f172a; color: #7dd3fc; padding: 1px 6px;
          border-radius: 4px; font-size: 12px;
        }
      `}</style>

      {/* Floating Button */}
      <button className="float-btn" onClick={() => setIsOpen(!isOpen)}>
        {"🤖"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="header">
            <div className="header-left">
              <div className="header-avatar">🤖</div>
              <div>
                <div className="header-title">{courseId.toUpperCase()} Assistant</div>
                <div className="header-sub">
                  <span className="online-dot" /> Online
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "user-row" : "bot-row"}>
                {msg.role === "assistant" && <div className="bot-avatar">🤖</div>}
                <div className={msg.role === "user" ? "user-bubble" : "bot-bubble"}>
                  {msg.role === "assistant" ? (
                    <div className="md-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : msg.content}
                </div>
                {msg.role === "user" && <div className="user-avatar">👤</div>}
              </div>
            ))}
            {isLoading && (
              <div className="bot-row">
                <div className="bot-avatar">🤖</div>
                <div className="typing-bubble">
                  <span className="dot" />
                  <span className="dot" style={{ animationDelay: "0.2s" }} />
                  <span className="dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <input
              className="input-box"
              type="text"
              placeholder="Ask anything about this course..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`send-btn ${btnPop ? "pop" : ""}`}
              onClick={handleSend}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}