import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./Yordamchi.css";
import botIcon from "../assets/yordamchi.png"; 
import bannerImg from "../assets/banner.png"; 

const Yordamchi = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "bot", text: "Assalomu alaykum! Men Gulbozor AI yordamchisiman. Savolingiz bolsa yozing." }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Siz bergan API kaliti
        const API_KEY = "AIzaSyBL9TIGSxTG1Po0xSGKDBdR1pzMY6DcSB4"; 

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
                {
                    contents: [{
                        parts: [{ text: input }]
                    }]
                }
            );

            if (response.data.candidates) {
                const botText = response.data.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { role: "bot", text: botText }]);
            }
        } catch (error) {
            console.error("API xatosi:", error);
            setMessages(prev => [...prev, { role: "bot", text: "Kechirasiz, javob olishda xatolik yuz berdi." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-wrapper">
            <div className="ai-container">
                {/* Tepadagi rasm div ichida ixcham turadi */}
                <div className="ai-banner-container">
                    <img src={bannerImg} className="ai-banner-img" alt="Banner" />
                    <div className="ai-status-bar">
                        <img src={botIcon} className="ai-mini-avatar" />
                        <span>Gulbozor AI (Online)</span>
                    </div>
                </div>

                {/* Xabarlar maydoni */}
                <div className="ai-messages-list">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`ai-message-row ${msg.role}`}
                            >
                                <div className="ai-bubble">{msg.text}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && <div className="ai-loading">Yozmoqda...</div>}
                    <div ref={chatEndRef} />
                </div>

                {/* Pastki input - doim qotib turadi */}
                <div className="ai-input-footer">
                    <div className="ai-input-group">
                        <input 
                            type="text" 
                            placeholder="Xabarni yozing..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={handleSend} disabled={loading} className="ai-send-btn">
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Yordamchi;