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
  const [error, setError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() && !previewImage) return;

    const userMessage = {
      role: "user",
      content: input || "What is in this image?",
      image: previewImage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPreviewImage(null);
    setIsLoading(true);
    setError(false);

    const answer = await sendMessage(
      input || "What is in this image?",
      courseId,
      sessionId
    );

    if (answer.startsWith("Sorry, something went wrong")) {
      setError(true);
    }

    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes slideInBot {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUser {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(109,40,217,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(109,40,217,0); }
        }

        .float-btn {
          position: fixed;
          bottom: 28px; right: 28px;
          width: 58px; height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none; cursor: pointer;
          font-size: 24px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(109,40,217,0.45);
          animation: pulse 2.5s infinite;
          z-index: 1000;
          transition: transform 0.2s;
        }
        .float-btn:hover { transform: scale(1.08); }

        .chat-window {
          position: fixed;
          bottom: 98px; right: 28px;
          width: 375px;
          height: calc(100vh - 130px);
          max-height: 620px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06);
          animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 999;
          display: flex; flex-direction: column;
          background: #ffffff;
        }

        .header {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          padding: 16px 18px;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .header-avatar {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .header-title { color: #fff; font-weight: 700; font-size: 14px; }
        .header-sub { color: rgba(255,255,255,0.8); font-size: 11px; margin-top: 2px; display: flex; align-items: center; gap: 4px; }
        .online-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; display: inline-block; }
        .close-btn {
          background: rgba(255,255,255,0.2); border: none; color: #fff;
          width: 28px; height: 28px; border-radius: 8px; cursor: pointer;
          font-size: 13px; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.3); }

        .messages-area {
          flex: 1; overflow-y: auto; padding: 16px 14px;
          display: flex; flex-direction: column; gap: 10px;
          background: #f8f7ff;
          scrollbar-width: thin;
          scrollbar-color: #e9d5ff transparent;
        }
        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-thumb { background: #e9d5ff; border-radius: 4px; }

        .bot-row { display: flex; align-items: flex-start; gap: 8px; animation: slideInBot 0.25s ease; }
        .user-row { display: flex; align-items: flex-start; justify-content: flex-end; gap: 8px; animation: slideInUser 0.25s ease; }

        .bot-avatar {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .user-avatar {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: #ede9fe;
          display: flex; align-items: center; justify-content: center; font-size: 13px;
          border: 1px solid #ddd6fe;
        }

        .bot-bubble {
          background: #ffffff; color: #1e1b4b;
          padding: 10px 14px; border-radius: 4px 16px 16px 16px;
          font-size: 13px; line-height: 1.75; max-width: 83%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          border: 1px solid #f0ebff;
        }
        .user-bubble {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff; padding: 10px 14px;
          border-radius: 16px 4px 16px 16px;
          font-size: 13px; line-height: 1.6; max-width: 83%;
          box-shadow: 0 2px 12px rgba(109,40,217,0.3);
        }

        .typing-bubble {
          background: #fff; padding: 12px 15px;
          border-radius: 4px 16px 16px 16px;
          display: flex; gap: 5px; align-items: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          border: 1px solid #f0ebff;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #7c3aed;
          animation: bounce 1.3s infinite;
        }

        .error-box {
          background: #fff1f2; border: 1px solid #fecdd3;
          color: #be123c; padding: 10px 14px; border-radius: 10px;
          font-size: 13px; display: flex; align-items: center; justify-content: space-between;
          animation: slideInBot 0.25s ease;
        }
        .dismiss-btn {
          background: #be123c; border: none; color: #fff;
          padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 12px;
        }

        .image-preview {
          padding: 8px 14px 0;
          position: relative; display: inline-block;
        }
        .image-preview img {
          max-height: 80px; border-radius: 10px;
          border: 2px solid #ddd6fe;
        }
        .remove-image {
          position: absolute; top: 4px; right: 4px;
          background: #7c3aed; color: white; border: none;
          border-radius: 50%; width: 18px; height: 18px;
          font-size: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }

        .msg-image {
          max-width: 180px; border-radius: 10px; margin-top: 6px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .input-area {
          padding: 10px 14px 12px;
          border-top: 1px solid #f0ebff;
          background: #ffffff;
          flex-shrink: 0;
        }
        .input-row {
          display: flex; gap: 8px; align-items: center;
        }
        .input-box {
          flex: 1; padding: 10px 14px; border-radius: 14px;
          border: 1.5px solid #ede9fe; background: #f8f7ff;
          color: #1e1b4b; font-size: 13px; outline: none;
          transition: border 0.2s;
          font-family: inherit;
        }
        .input-box:focus { border-color: #7c3aed; background: #fff; }
        .input-box::placeholder { color: #a78bfa; }

        .attach-btn {
          width: 38px; height: 38px; border-radius: 11px;
          background: #ede9fe; border: none; cursor: pointer;
          font-size: 16px; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; flex-shrink: 0;
        }
        .attach-btn:hover { background: #ddd6fe; }

        .send-btn {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none; color: #fff; cursor: pointer;
          font-size: 14px; display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(109,40,217,0.3);
        }
        .send-btn:hover { transform: scale(1.05); }

        .md-content p { margin: 3px 0; color: #1e1b4b; }
        .md-content strong { color: #6d28d9; font-weight: 600; }
        .md-content ul { padding-left: 16px; margin: 5px 0; }
        .md-content ol { padding-left: 16px; margin: 5px 0; }
        .md-content li { margin: 3px 0; color: #1e1b4b; }
        .md-content h1, .md-content h2, .md-content h3 {
          color: #6d28d9; margin: 8px 0 4px; font-size: 13px; font-weight: 700;
        }
        .md-content code {
          background: #f3f0ff; color: #6d28d9; padding: 1px 6px;
          border-radius: 4px; font-size: 12px;
        }
      `}</style>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {/* Floating Button */}
      <button className="float-btn" onClick={() => setIsOpen(!isOpen)}>
        🤖
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
                  <span className="online-dot" /> Online • Always here to help
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
                  {msg.image && (
                    <img src={msg.image} alt="uploaded" className="msg-image" />
                  )}
                  {msg.role === "assistant" ? (
                    <div className="md-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div>{msg.content}</div>
                  )}
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

            {error && (
              <div className="error-box">
                <span>⚠️ Server not reachable. Please try again.</span>
                <button className="dismiss-btn" onClick={() => setError(false)}>Dismiss</button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Image Preview */}
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="preview" />
              <button className="remove-image" onClick={() => setPreviewImage(null)}>✕</button>
            </div>
          )}

          {/* Input */}
          <div className="input-area">
            <div className="input-row">
              <button
                className="attach-btn"
                onClick={() => fileInputRef.current.click()}
                title="Attach image"
              >
                📎
              </button>
              <input
                className="input-box"
                type="text"
                placeholder="Ask anything about this course..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="send-btn" onClick={handleSend}>➤</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}