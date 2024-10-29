// src/components/Chat.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:4000");

// 랜덤 닉네임 생성 함수
function generateRandomNickname() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
}

function Chat() {
  const [nickname] = useState(generateRandomNickname()); // 닉네임 고정
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat message", ({ nickname, message }) => {
      setMessages((prevMessages) => [...prevMessages, { nickname, message }]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat message", { nickname, message: input });
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.nickname}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." className="chat-input" />
        <button onClick={sendMessage} className="chat-send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
