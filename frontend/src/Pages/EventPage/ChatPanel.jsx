import "./ChatPanel.css";
import { useState } from "react";

export function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();

      if (data.answer) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.answer }]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Error: ${data.error}` },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Backend not reachable." },
      ]);
    }
  };

  return (
    <div className={`chat-panel ${expanded ? "expanded" : ""}`}>
      <div className="chat-header">
        <h3>Assistant</h3>
        <div className="header-buttons">
          <button
            className="expand-btn"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "➖" : "➕"}
          </button>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-box">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
}
