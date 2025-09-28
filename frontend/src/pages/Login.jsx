import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        // localStorage에 사용자 정보 저장
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        alert("로그인 성공!");
        navigate("/"); // 로그인 성공 시 메인 페이지로 이동
      } else {
        const data = await res.json();
        setAlertMsg(data.message || "로그인 실패");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setAlertMsg("서버 오류");
    }
  };

  return (
    <>
      <div style={{ width: "100%", textAlign: "center", margin: "60px 0 20px 0" }}>
        <span className="main-link" onClick={() => navigate("/")}>
          캠퍼스 재능 나눔
        </span>
      </div>
      <div className="hackerton-container nexon-style">
        <div className="logo">로그인</div>
        <form onSubmit={handleSubmit} className="nexon-form">
          <input
            type="email"
            className="nexon-input" 
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="nexon-input"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="nexon-login-btn">
            로그인
          </button>
        </form>
        <div className="simple-links">
          <a href="/register">회원가입</a>
          <span>·</span>
          <a href="/find-password">비밀번호 찾기</a>
        </div>
        {alertMsg && (
          <div className="modal-backdrop">
            <div className="modal">
              <p>{alertMsg}</p>
              <button onClick={() => setAlertMsg("")} className="nexon-login-btn">
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
