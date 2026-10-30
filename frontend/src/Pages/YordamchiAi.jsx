import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./YordamchiAi.css";

import logoImg   from "../assets/yordamchi.png";
import bannerImg from "../assets/banner.png";
import sendIcon  from "../assets/send.png";

// Backend manzili (.env faylda: VITE_API_URL=http://localhost:3001)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const WELCOME_MESSAGE = {
  id: 0,
  role: "bot",
  text: "men gulbozor uz yordamchi Ai man, savolingiz bolsa yozing 😊",
};

export default function YordamchiAi() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: "user", text };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setIsTyping(true);

    // Suhbat tarixini API formatiga o'tkazish (salomlashuv xabarini tashlab, oxirgi 20 ta)
    const history = updated
      .filter((m) => m.id !== 0)
      .slice(-20)
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("Server xatosi");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Kechirasiz, hozir javob bera olmadim. Iltimos, birozdan so'ng qayta urinib ko'ring. 🍃",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="yai-root">

      {/* MOBILE header */}
      <motion.div
        className="yai-mobile-header"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.45 }}
      >
        <div className="yai-avatar-wrap">
          <img src={logoImg} alt="Yordamchi Ai" className="yai-avatar" />
        </div>
        <span className="yai-mobile-name">Yordamchi Ai</span>
      </motion.div>

      {/* DESKTOP header */}
      <motion.div
        className="yai-desktop-header"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.5 }}
      >
        <div className="yai-desktop-profile">
          <div className="yai-avatar-wrap large">
            <img src={logoImg} alt="Yordamchi Ai" className="yai-avatar" />
          </div>
          <div className="yai-desktop-info">
            <span className="yai-desktop-name">Yordamchi Ai</span>
            <span className="yai-status">
              <span className="yai-dot" /> onlayn
            </span>
          </div>
        </div>
        <div className="yai-banner-wrap">
          <img src={bannerImg} alt="Banner" className="yai-banner" />
        </div>
      </motion.div>

      {/* CHAT AREA */}
      <div className="yai-chat-area" ref={chatRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`yai-bubble-wrap ${msg.role}`}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1,  y: 0,  scale: 1   }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {msg.role === "bot" && (
                <img src={logoImg} alt="" className="yai-bubble-avatar" />
              )}
              <div className={`yai-bubble ${msg.role}`}>{msg.text}</div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              key="typing"
              className="yai-bubble-wrap bot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1,  y: 0 }}
              exit={{ opacity: 0 }}
            >
              <img src={logoImg} alt="" className="yai-bubble-avatar" />
              <div className="yai-bubble bot yai-typing">
                <span /><span /><span />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="yai-input-bar">
        <input
          className="yai-input"
          placeholder="savolingizni yozing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={isTyping}
        />
        <motion.button
          className="yai-send-btn"
          onClick={handleSend}
          disabled={isTyping}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
        >
          <img src={sendIcon} alt="Yuborish" className="yai-send-icon" />
        </motion.button>
      </div>

    </div>
  );
}