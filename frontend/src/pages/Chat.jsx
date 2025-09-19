import { useLocation } from "react-router";
import "./Chat.css";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";

function Chat() {
  const location = useLocation(); // URL 정보 추출 함수
  const urlParams = new URLSearchParams(location.search); // 쿼리 파라미터를 쉽게 다루기 위한 객체
  const name = urlParams.get("name") || "Guest"; // name 파라미터 추출, 없으면 "Guest" 기본값

  const [chats, setChats] = useState([]); // 채팅 메시지 상태 변수
  const [input, setInput] = useState(""); // 채팅 입력 상태 변수
  const [isChatSending, setIsChatSending] = useState(false); // 채팅 전송 상태 변수

  // 채팅 입력 처리 함수
  function handleInputChange(event) {
    setInput(event.target.value);
  }

  // 채팅 전송 처리 함수
  function handleSendButtonClick() {
    if (input.trim() === "") return; // 빈 메시지 전송 방지

    // 새로운 채팅 메시지 기록 추가
    const newChat = { name: name, message: input };
    setChats((prevChats) => [...prevChats, newChat]);

    // 입력란 초기화
    setInput("");

    // 백엔드로 메시지 전송
    setIsChatSending(true);

    axios
      .post("http://localhost:4000/chat", newChat)
      .then((response) => {
        console.log("Message sent:", response.data);
        const botReply = { name: "ChatGPT", message: response.data.reply };
        setChats((prevChats) => [...prevChats, botReply]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setIsChatSending(false);
      });
  }

  return (
    <div className="root">
      <div className="container">
        {/* 환영 메시지 */}
        <h2>
          <span>{name}</span>님 환영합니다!
        </h2>

        {/* 메시지 기록 */}
        <div className="chat-log-container">
          {chats.map((chat, index) => (
            <div key={`chat-${index}`} className="chat-log">
              <strong>{chat.name}</strong>
              <p>{chat.message}</p>
            </div>
          ))}
        </div>

        {/* 채팅 입력란 */}
        <div className="chat-input-container">
          <input
            placeholder={isChatSending ? "메시지 전송 중..." : "메시지를 입력하세요."}
            value={input}
            onChange={handleInputChange}
            disabled={isChatSending}
          />
          <Button onClick={handleSendButtonClick} disabled={isChatSending}>
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
