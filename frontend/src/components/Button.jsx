import "./Button.css";

// 공통 스타일이 적용된 버튼 컴포넌트

function Button({ children, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      <h3>{children}</h3>
    </button>
  );
}

export default Button;
