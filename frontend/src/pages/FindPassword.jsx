import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function FindPassword() {
  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (!email) {
      setAlertMsg("이메일을 입력해 주세요");
      return;
    }
    setIsComplete(true);
  }

  function handleCloseAlert() {
    setAlertMsg("");
  }

  function handleCloseComplete() {
    setIsComplete(false);
    navigate("/login");
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          textAlign: "center",
          margin: "60px 0 20px 0",
        }}
      >
        <span className="main-link" onClick={() => navigate("/")}>
          캠퍼스 재능 나눔
        </span>
      </div>
      <div className="hackerton-container nexon-style">
        <div className="logo">비밀번호 찾기</div>
        <form onSubmit={handleSubmit} className="nexon-form">
          <input
            type="email"
            className="nexon-input"
            placeholder="비밀번호를 받을 이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="nexon-login-btn">
            비밀번호 찾기
          </button>
        </form>
        {/* 로그인으로 링크 추가 */}
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <span className="main-link" onClick={() => navigate("/login")}>
            로그인으로
          </span>
        </div>
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
              <p>입력하신 이메일을 확인해 주세요</p>
              <button onClick={handleCloseComplete} className="nexon-login-btn">
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FindPassword;