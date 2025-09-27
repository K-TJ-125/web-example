import React, { useEffect, useState } from "react";
import TalentTest from "./TalentTest";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
  // const [searchKeyword, setSearchKeyword] = useState("");
  // const [selectedJobType, setSelectedJobType] = useState("모든 직군");
  // const [selectedLocation, setSelectedLocation] = useState("모든 지역/시");
  // const [selectedCareer, setSelectedCareer] = useState("모든 고용형태");
  const [talentInfo, setTalentInfo] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const navigate = useNavigate();

  // TalentTest 모달 상태
  const [showTalentTest, setShowTalentTest] = useState(false);
  const [talentInput, setTalentInput] = useState("");

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setUserName("");
    alert("로그아웃 성공!");
    navigate("/");
  };

  useEffect(() => {
    if (!userEmail) return;
    fetch(
      `http://localhost:3000/api/user-talent?email=${encodeURIComponent(
        userEmail
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.talent && data.talentLevel) setTalentInfo(data);
      });
  }, [userEmail]);

  // 상위 8개 재능
  const topTalentListings = [
    {
      id: 1,
      title: "포토샵",
      category: "디자인",
      platform: "PC",
      tags: ["초급"],
    },
    {
      id: 2,
      title: "영어회화",
      category: "언어",
      platform: "MOBILE",
      tags: ["중급"],
    },
    {
      id: 3,
      title: "기타연주",
      category: "음악",
      platform: "PC",
      tags: ["고급"],
    },
    {
      id: 4,
      title: "요리",
      category: "생활",
      platform: "MOBILE",
      tags: ["초급"],
    },
    {
      id: 5,
      title: "프로그래밍",
      category: "개발",
      platform: "PC",
      tags: ["중급"],
    },
    {
      id: 6,
      title: "댄스",
      category: "운동",
      platform: "MOBILE",
      tags: ["초급"],
    },
    {
      id: 7,
      title: "일본어",
      category: "언어",
      platform: "PC",
      tags: ["고급"],
    },
    {
      id: 8,
      title: "그림그리기",
      category: "예술",
      platform: "MOBILE",
      tags: ["중급"],
    },
  ];

  return (
    <div className="main-page">
      {/* 헤더 */}
      <header className="header">
        <div className="header-container">
          <div className="logo" style={{ marginBottom: 0 }}>
            <span className="logo-text">캠퍼스 재능 나눔</span>
          </div>
          <nav className="nav">
            <div className="auth-buttons">
              {userName ? (
                <>
                  <span style={{ marginRight: 12, fontWeight: 600 }}>
                    {userName}님
                  </span>
                  <button className="login-btn" onClick={handleLogout}>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="login-btn"
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </button>
                  <button
                    className="signup-btn"
                    onClick={() => navigate("/register")}
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            국가를 넘어 재능을 교환하는 여정,
            <br />이 유난한 도전에 함께할 동료를 찾습니다
          </h1>
          {/* 여기에 추가! */}
          {talentInfo && (
            <div style={{ margin: "24px 0", fontWeight: 600 }}>
              내 재능:{" "}
              <span style={{ color: "#010101ff" }}>{talentInfo.talent}</span>
              {" / "}
              레벨:{" "}
              <span style={{ color: "#010202ff" }}>{talentInfo.talentLevel}</span>
            </div>
          )}

          {/* 첫 번째 검색 바 */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="당신의 재능은 무엇인가요?"
                value={talentInput}
                onChange={(e) => setTalentInput(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="search-btn"
              onClick={() => {
                if (!talentInput.trim()) {
                  alert("재능을 입력해주세요.");
                  return;
                }
                setShowTalentTest(true);
              }}
            >
              수준 확인
            </button>
          </div>
          {/* 재능 수준 확인 모달 */}
          {showTalentTest && (
            <div style={{ marginTop: 32 }}>
              <TalentTest
                talent={talentInput}
                onClose={() => setShowTalentTest(false)}
              />
            </div>
          )}

          {/* 두 번째 검색 바 */}
          <div className="search-container secondary-search">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="궁금한 재능이 무엇인가요?"
                className="search-input"
              />
            </div>
            <button className="search-btn">찾기</button>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <div className="content-container">
          {/* 좌우로 나란히 배치 */}
          <div className="talent-sections-row">
            {/* 좌측: 재능 기부의 방 */}
            <section className="talent-section">
              <h2 className="section-title">재능 기부의 방</h2>
              <div className="talent-grid">
                {topTalentListings.map((talent) => (
                  <div key={talent.id} className="talent-card">
                    <div className="talent-card-header">
                      <div className="talent-platform-badges">
                        <span
                          className={`platform-badge ${talent.platform.toLowerCase()}`}
                        >
                          {talent.platform}
                        </span>
                      </div>
                    </div>
                    <div className="talent-card-content">
                      <h3 className="talent-card-title">{talent.title}</h3>
                      <p className="talent-card-category">{talent.category}</p>
                    </div>
                    <div className="talent-card-footer">
                      <div className="talent-card-tags">
                        {talent.tags.map((tag, index) => (
                          <span key={index} className="talent-level-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
