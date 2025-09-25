import "./Test.css";
import { useNavigate } from "react-router";

// 메인 페이지 컴포넌트
function Test() {
  const navigate = useNavigate(); // 페이지 이동 함수

  const handleButtonClick = (buttonNumber) => {
    console.log(`버튼 ${buttonNumber} 클릭됨`);
    // 여기에 버튼 클릭 시 실행할 로직을 추가하세요

    navigate("/");
  };

  return (
    <div className="test-container">
      <h1>테스트 페이지</h1>
      <div className="button-grid">
        {Array.from({ length: 20 }, (_, index) => (
          <button
            key={index + 1}
            className="grid-button"
            onClick={() => handleButtonClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Test;