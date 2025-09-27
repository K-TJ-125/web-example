import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    // 로그인 처리
    console.log("로그인 시도:", email, password);
  }

  return (
    <div className="hackerton-container nexon-style">
      <div className="logo">LOGIN</div>
      <form onSubmit={handleSubmit} className="nexon-form">
        <input
          type="email"
          className="nexon-input"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="nexon-input"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="nexon-login-btn">
          로그인
        </button>
      </form>
      <div className="nexon-links">
        <Link to="/register">회원가입</Link>
        <span>·</span>
        <Link to="/find-id">아이디 찾기</Link>
        <span>·</span>
        <Link to="/find-password">비밀번호 찾기</Link>
      </div>
    </div>
  );
}

export default Login;
