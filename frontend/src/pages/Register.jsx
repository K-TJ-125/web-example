import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [alertMsg, setAlertMsg] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsComplete(true);
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        const data = await res.json();
        setAlertMsg(data.message || "회원가입 실패");
      }
    } catch (err) {
      setAlertMsg("서버 오류");
    }
  };

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
        <input
          type="email"
          className="nexon-input"
          placeholder="학교 이메일을 입력하세요"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
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
            <button onClick={() => setAlertMsg("")} className="nexon-login-btn">
              닫기
            </button>
          </div>
        </div>
      )}
      {isComplete && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>회원가입이 완료되었습니다</p>
            <button
              onClick={() => {
                setIsComplete(false);
                navigate("/hackerton");
              }}
              className="nexon-login-btn"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;