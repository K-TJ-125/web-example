import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function FindID() {
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
    navigate("/hackerton");
  }

  return (
    <div className="hackerton-container nexon-style">
      <div className="logo">아이디 찾기</div>
      <form onSubmit={handleSubmit} className="nexon-form">
        <input
          type="email"
          className="nexon-input"
          placeholder="아이디를 받을 이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="nexon-login-btn">
          아이디 찾기
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
            <p>입력하신 이메일을 확인해 주세요</p>
            <button onClick={handleCloseComplete} className="nexon-login-btn">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindID;