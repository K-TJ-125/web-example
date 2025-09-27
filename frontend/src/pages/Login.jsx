import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("로그인 성공!");
        navigate("/"); // 로그인 성공 시 메인 페이지로 이동
      } else {
        const data = await res.json();
        alert(data.message || "로그인 실패");
      }
    } catch (err) {
      alert("서버 오류");
    }
  };

  return (
    <div className="hackerton-container nexon-style">
      <div className="logo">로그인</div>
      <form onSubmit={handleSubmit} className="nexon-form">
        <input
          type="email"
          name="email"
          className="nexon-input"
          placeholder="이메일을 입력하세요"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="nexon-input"
          placeholder="비밀번호를 입력하세요"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="nexon-login-btn">
          로그인
        </button>
      </form>
      <button
        className="nexon-login-btn"
        style={{ width: "100%", marginTop: 8 }}
        onClick={() => navigate("/register")}
      >
        회원가입
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <button
          className="nexon-login-btn"
          style={{ width: "48%" }}
          onClick={() => navigate("/find-id")}
        >
          아이디 찾기
        </button>
        <button
          className="nexon-login-btn"
          style={{ width: "48%" }}
          onClick={() => navigate("/find-password")}
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}

export default Login;
