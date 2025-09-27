import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      console.log("Submitting form:", form);
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("로그인 성공!");
        // TODO: 메인 페이지 등으로 이동하려면 아래 사용
        // navigate("/");
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
      <div className="logo">LOGIN</div>
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