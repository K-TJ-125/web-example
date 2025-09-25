import "./Main.css";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

// 메인 페이지 컴포넌트

function Main() {
  const navigate = useNavigate(); // 페이지 이동 함수

  const [name, setName] = useState(""); // 닉네임 상태 변수
  const [serverMessage, setServerMessage] = useState(""); // 서버 메시지 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 컴포넌트 마운트 시 서버 상태 확인
  useEffect(() => {
    checkServerStatus();
  }, []);

  // 서버 상태 확인 함수
  async function checkServerStatus() {
    try {
      const response = await fetch("http://localhost:3000/status");
      const data = await response.json();
      setServerMessage(data.message);
      setIsLoading(false);
    } catch (error) {
      console.error("서버 연결 실패:", error);
      setServerMessage("백엔드 서버에 연결할 수 없습니다. 😞");
      setIsLoading(false);
    }
  }

  // 닉네임 입력 처리 함수
  function handleNameChange(event) {
    setName(event.target.value);
  }

  return (
    <div className="root">
      <h1>Web Example 프로젝트에 오신 것을 환영합니다!</h1>
      <p>이곳은 메인 페이지입니다.</p>

      {/* 서버 연동 상태 메시지 */}
      <div className="server-status">
        {isLoading ? (
          <p>서버 연결 확인 중...</p>
        ) : (
          <p
            className={
              serverMessage.includes("성공적으로") ? "success" : "error"
            }
          >
            {serverMessage}
          </p>
        )}
      </div>

      <div className="name-container">
        <h4>닉네임</h4>
        <input
          placeholder="닉네임을 입력하세요"
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <Button onClick={() => navigate(`/chat?name=${name || "Guest"}`)}>
        채팅 시작하기
      </Button>
    </div>
  );
}

export default Main;
