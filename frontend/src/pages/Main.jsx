import "./Main.css";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { useState } from "react";

// 메인 페이지 컴포넌트

function Main() {
  const navigate = useNavigate(); // 페이지 이동 함수

  const [name, setName] = useState(""); // 닉네임 상태 변수

  // 닉네임 입력 처리 함수
  function handleNameChange(event) {
    setName(event.target.value);
  }

  return (
    <div className="root">
      <h1>Web Example 프로젝트에 오신 것을 환영합니다!</h1>
      <p>이곳은 메인 페이지입니다.</p>

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
