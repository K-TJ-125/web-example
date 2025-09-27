import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    code: "",
  });
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!form.email) {
      setAlertMsg("이메일을 입력해주세요.");
      return;
    }
    try {
      // Integrate actual API call for sending code
      // const res = await fetch("/api/send-code", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: form.email }),
      // });
      // if (res.ok) {
        setSent(true);
        setAlertMsg("인증번호가 전송되었습니다. (테스트용)");
      // } else {
      //   const data = await res.json();
      //   setAlertMsg(data.message || "인증번호 전송 실패");
      // }
    } catch {
      setAlertMsg("서버 오류");
    }
  };

  const handleVerifyCode = async () => {
    if (!form.code) {
      setAlertMsg("인증번호를 입력해주세요.");
      return;
    }
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: form.code }),
      });
      if (res.ok) {
        setVerified(true);
        setAlertMsg("이메일 인증 성공!");
      } else {
        const data = await res.json();
        setAlertMsg(data.message || "인증번호 오류");
      }
    } catch {
      setAlertMsg("서버 오류");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setAlertMsg("이름, 이메일, 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (!verified) {
      setAlertMsg("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      if (res.ok) {
        setIsComplete(true);
      } else {
        const data = await res.json();
        setAlertMsg(data.message || "회원가입 실패");
      }
    } catch {
      setAlertMsg("서버 오류");
    }
  };

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
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="email"
            className="nexon-input"
            placeholder="이메일을 입력하세요"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ flexGrow: 1 }}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sent || !form.email}
            className="nexon-login-btn"
            style={{ width: 'auto', padding: '8px 12px' }}
          >
            {sent ? "재전송" : "인증번호 전송"}
          </button>
        </div>
        {sent && !verified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              className="nexon-input"
              placeholder="인증번호를 입력하세요"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              style={{ flexGrow: 1 }}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={!form.code}
              className="nexon-login-btn"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              인증번호 확인
            </button>
          </div>
        )}
        {verified && (
          <div style={{ color: "green", marginTop: '8px' }}>
            이메일 인증 완료
          </div>
        )}
        <input
          type="password"
          className="nexon-input"
          placeholder="비밀번호를 입력하세요"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
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