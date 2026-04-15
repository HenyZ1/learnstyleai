"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AIChat.module.css";

const initialMessage =
  "Merhaba! Ben LearnStyle AI asistanınızım. Öğrenme stiliniz, çalışma planınız ve verimli öğrenme stratejileri konusunda yardımcı olabilirim. Ne üzerinde çalışmak istiyorsunuz?";

const suggestions = [
  "Öğrenme stilim için kısa bir analiz yap",
  "Sınava hazırlık için 7 günlük plan hazırla",
  "Görsel öğreniyorsam nasıl çalışmalıyım?",
  "Odaklanma sorunu için ne yapabilirim?",
];

function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function serializeMessages(messages) {
  return messages.map(({ sender, text }) => ({
    role: sender === "bot" ? "assistant" : "user",
    content: text,
  }));
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: initialMessage }]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (value) => {
    const text = value.trim();

    if (!text || isSending) {
      return;
    }

    const userMessage = { sender: "user", text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setShowSuggestions(false);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: serializeMessages(nextMessages),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI yanıtı alınamadı.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { sender: "bot", text: data.reply },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: "bot",
          text:
            error instanceof Error && error.message
              ? error.message
              : "Şu anda AI servisine ulaşılamıyor. Lütfen kısa bir süre sonra tekrar deneyin.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        className={styles.chatBtn}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        aria-label="AI Asistan"
      >
        <div className={styles.chatBtnInner}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="10" r="1" fill="currentColor" />
            <circle cx="8" cy="10" r="1" fill="currentColor" />
            <circle cx="16" cy="10" r="1" fill="currentColor" />
          </svg>
        </div>
        <div className={styles.chatBtnPulse}></div>
      </button>

      {open && (
        <div className={styles.modal}>
          <div className={`glass-card-large ${styles.modalInner}`}>
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                  </svg>
                </div>
                <div>
                  <h4>LearnStyle AI</h4>
                  <span className={styles.status}>
                    <span className={styles.statusDot}></span>
                    OpenAI bağlı
                  </span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Kapat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.messages}>
              {messages.map((message, index) => (
                <div key={`${message.sender}-${index}`} className={`${styles.message} ${styles[message.sender]}`}>
                  <div className={styles.msgAvatar}>
                    {message.sender === "bot" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.msgContent}>
                    <p style={{ whiteSpace: "pre-line" }}>{renderText(message.text)}</p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className={`${styles.message} ${styles.bot}`}>
                  <div className={styles.msgAvatar}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                    </svg>
                  </div>
                  <div className={styles.msgContent}>
                    <div className={styles.typingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
              {showSuggestions && (
                <div className={styles.suggestions}>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      className={styles.chip}
                      onClick={() => sendMessage(suggestion)}
                      disabled={isSending}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <form
                className={styles.form}
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(input);
                }}
              >
                <input
                  className={styles.input}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Mesajınızı yazın..."
                  autoComplete="off"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className={styles.sendBtn}
                  aria-label="Gonder"
                  disabled={isSending || !input.trim()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
