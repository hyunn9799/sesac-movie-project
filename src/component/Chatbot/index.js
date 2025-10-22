"use client";

import { useState, useRef, useEffect } from "react";

/**
 * MovieHub 챗봇 메인 컴포넌트
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "안녕하세요! 🎬 MovieHub 챗봇입니다.\n영화 추천이나 궁금한 점을 물어보세요!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 메시지 목록 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data.reply || "죄송해요, 다시 말씀해주시겠어요?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("챗봇 에러:", error);
      const errorMessage = {
        role: "assistant",
        content: "죄송해요, 일시적인 오류가 발생했습니다. 😢",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키로 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
            border: "none",
            boxShadow: "0 4px 20px rgba(229, 9, 20, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            zIndex: 999,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 6px 25px rgba(229, 9, 20, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(229, 9, 20, 0.4)";
          }}
        >
          💬
        </button>
      )}

      {/* 챗봇 창 */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "380px",
            height: "600px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
            overflow: "hidden",
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              background: "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
              color: "#fff",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>🎬</span>
              <div>
                <div style={{ fontWeight: "700", fontSize: "16px" }}>
                  MovieHub Bot
                </div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>
                  영화 추천 & 문의
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#fff",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
            >
              ×
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              background: "#f8f9fa",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: "16px",
                    background: msg.role === "user" ? "#E50914" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#333",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "16px",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                  }}
                >
                  <span>🤔 생각중...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div
            style={{
              padding: "16px",
              background: "#fff",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "24px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#E50914";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: input.trim() && !isLoading ? "#E50914" : "#ccc",
                border: "none",
                color: "#fff",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isLoading) {
                  e.currentTarget.style.background = "#B20710";
                }
              }}
              onMouseLeave={(e) => {
                if (input.trim() && !isLoading) {
                  e.currentTarget.style.background = "#E50914";
                }
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
