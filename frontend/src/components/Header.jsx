import "./Header.css";
import { useNavigate } from "react-router";

// 웹 페이지 헤더 컴포넌트

function Header() {
  const navigate = useNavigate(); // 페이지 이동 함수

  return (
    <header>
      <h1
        onClick={function () {
          navigate("/");
        }}
      >
        Web Example!
      </h1>

      <div>
        <h2
          onClick={function () {
            navigate("/chat");
          }}
        >
          채팅
        </h2>
      </div>
    </header>
  );
}

export default Header;
