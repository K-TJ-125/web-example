import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (!name && !email && !password) {
      setAlertMsg("이름, 이메일, 비밀번호를 모두 입력해주세요");
      return;
    }
    if (!name) {
      setAlertMsg("이름을 입력해주세요");
      return;
    }
    if (!email) {
      setAlertMsg("이메일을 입력해주세요");
      return;
    }
    if (!password) {
      setAlertMsg("비밀번호를 입력해주세요");
      return;
    }
    // 회원가입 처리
    setIsComplete(true);
  }

  function handleCloseAlert() {
    setAlertMsg("");
  }

  function handleCloseComplete() {
    setIsComplete(false);
    navigate("/hackerton");
  }

  return (
    <div className="hackerton-container nexon-style">
      <div className="logo">회원가입</div>
      <form onSubmit={handleSubmit} className="nexon-form">
        <input
          type="text"
          className="nexon-input"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          회원가입
        </button>
      </form>
      {alertMsg && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>{alertMsg}</p>
            <button onClick={handleCloseAlert} className="nexon-login-btn">
              닫기
            </button>
          </div>
        </div>
      )}
      {isComplete && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>회원가입이 완료되었습니다</p>
            <button onClick={handleCloseComplete} className="nexon-login-btn">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;