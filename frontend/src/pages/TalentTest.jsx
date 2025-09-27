import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TalentTest({ talent, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!talent) return;
    setLoading(true);
    fetch("http://localhost:3000/api/talent-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ talent }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.questions)) {
          setQuestions(data.questions.map((q) => q.question));
          setAnswers(Array(data.questions.length).fill(null));
        } else {
          setError("질문을 불러오지 못했습니다.");
        }
      })
      .catch(() => setError("질문을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [talent]);

  const handleAnswer = (idx, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answers.some((a) => a === null)) {
      setError("모든 질문에 답변해주세요.");
      return;
    }
    setLoading(true);
    fetch("http://localhost:3000/api/save-talent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        talent,
        talentQuestions: questions,
        talentAnswers: answers,
        talentLevel: Math.max(
          1,
          Math.min(
            5,
            Math.round(
              answers.reduce(
                (a, b) =>
                  a + ["매우 아님", "아님", "맞음", "매우 맞음"].indexOf(b),
                0
              ) / answers.length
            ) + 1
          )
        ),
        email: localStorage.getItem("userEmail"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("저장되었습니다!");
          window.scrollTo(0, 0); // 화면을 최상단으로 이동
          onClose && onClose();
          navigate("/");
        } else {
          setError("저장에 실패했습니다.");
        }
      })
      .catch(() => setError("저장에 실패했습니다."))
      .finally(() => setLoading(false));
  };

  if (!talent) return null;
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div
      style={{
        background: "#fff",
        padding: 32,
        borderRadius: 16,
        maxWidth: 540,
        margin: "32px auto",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 32,
          color: "#764ba2",
        }}
      >
        재능 수준 확인: <span style={{ color: "#764ba2" }}>{talent}</span>
      </h2>
      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 32,
            padding: "18px 0",
            borderBottom:
              idx !== questions.length - 1 ? "1px solid #eee" : "none",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 18,
              color: "#333",
            }}
          >
            {idx + 1}. {q}
          </div>
          <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
            {["매우 아님", "아님", "맞음", "매우 맞음"].map((opt, oidx) => (
              <label
                key={oidx}
                style={{
                  display: "block",
                  padding: "10px 18px",
                  borderRadius: 8,
                  border:
                    answers[idx] === opt
                      ? "2px solid #764ba2"
                      : "1.5px solid #ddd",
                  background: answers[idx] === opt ? "#f3e8ff" : "#fafbfc",
                  color: answers[idx] === opt ? "#764ba2" : "#333",
                  fontWeight: answers[idx] === opt ? 700 : 400,
                  cursor: "pointer",
                  fontSize: 15,
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={opt}
                  checked={answers[idx] === opt}
                  onChange={() => handleAnswer(idx, opt)}
                  style={{ display: "none" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 32px",
            background: "#764ba2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            marginRight: 12,
          }}
        >
          저장
        </button>
        <button
          onClick={() => {
            window.scrollTo(0, 0); // 화면을 최상단으로 이동
            onClose && onClose();
            navigate("/");
          }}
          style={{
            padding: "12px 32px",
            background: "#eee",
            color: "#333",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default TalentTest;
