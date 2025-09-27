import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("모든 직군");
  const [selectedLocation, setSelectedLocation] = useState("모든 지역/시");
  const [selectedCareer, setSelectedCareer] = useState("모든 고용형태");
  const navigate = useNavigate();

  const jobListings = [
    {
      id: 1,
      title: "10월 신입 Insurance advisor과정 (서울/대전/전주/부산)",
      company: "비즈니스 • 보험영업 • 보험설계 • 상담 • 손해보험",
      category: "한화손보",
      tags: ["중급"],
    },
    {
      id: 2,
      title: "Compliance Manager",
      company: "컴플라이언스 • 준법감시 • 내부통제",
      category: "중급",
      tags: ["중급"],
    },
    {
      id: 3,
      title: "Executive Assistant",
      company: "EA • 임원지원 • 어시스턴트",
      category: "초급",
      tags: ["중급"],
    },
    {
      id: 4,
      title: "Finance Director",
      company: "재무 • 회계 • FP&A • 리더십",
      category: "시니어",
      tags: [],
    },
    {
      id: 5,
      title: "Site Manager (부산센터)",
      company: "센터장 • 컬렉센터 • BPO • 인하우스 • 부산 • 지사장",
      category: "시니어",
      tags: [],
    },
    {
      id: 6,
      title: "보험설계사 (위촉직 대면 FC, 정직)",
      company: "비즈니스 • 보험영업 • 보험설계 • 상담 • 손해보험",
      category: "한화손보",
      tags: [],
    },
    {
      id: 7,
      title: "FP&A Director",
      company: "FP&A • 재무관리업 • 재무회계 • 재무분석",
      category: "토스",
      tags: [],
    },
  ];

  const newsItems = [
    {
      title: "공입업이 성장하는 토스 파이낸터 탐험들의 이야기",
      date: "2025.09.24",
    },
    {
      title: "복잡한 금융 데이터를 시각적 컨텐츠로 풀어내는 토스증권 AI Silo",
      date: "2025.09.24",
    },
    {
      title:
        "초 단위로 응답하는 데이터, 그 뒤에 있는 토스증권 Realtime Data Team",
      date: "2025.09.24",
    },
  ];

  return (
    <div className="main-page">
      {/* 헤더 */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-text">중꺾마</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link">
              사이트 소개
            </a>
            <a href="#" className="nav-link">
              개발자 소개
            </a>
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => navigate("/login")}>
                로그인
              </button>
              <button
                className="signup-btn"
                onClick={() => navigate("/register")}
              >
                회원가입
              </button>
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

          {/* 검색 바 */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="원하는 재능을 검색해보세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="filter-select"
            >
              <option>모든 재능</option>
              <option>패션</option>
              <option>스포츠</option>
              <option>게임</option>
              <option>역사</option>
              <option>보컬</option>
              <option>악기</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="filter-select"
            >
              <option>MBTI</option>
              <option>ISTJ</option>
              <option>ISFJ</option>
              <option>INFJ</option>
              <option>INTJ</option>
              <option>ISTP</option>
              <option>ISFP</option>
              <option>INFP</option>
              <option>INTP</option>
              <option>ESTP</option>
              <option>ESFP</option>
              <option>ENFP</option>
              <option>ENTP</option>
              <option>ESTJ</option>
              <option>ESFJ</option>
              <option>ENFJ</option>
              <option>ENTJ</option>
            </select>

            <button className="search-btn">초기화</button>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <div className="content-container">
          {/* 채용 공고 섹션 */}
          <section className="job-section">
            <h2 className="section-title">312개의 포지션이 열려있어요.</h2>

            <div className="job-listings">
              {jobListings.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-info">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                  </div>
                  <div className="job-tags">
                    <span className="job-category">{job.category}</span>
                    {job.tags.map((tag, index) => (
                      <span key={index} className="job-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 사이드바 */}
          <aside className="sidebar">
            {/* 특별 채용 이벤트 */}
            <div className="sidebar-card special-event">
              <div className="event-content">
                <h3>토스 커뮤니티 전력군 대규모 경력 채용 &gt;</h3>
                <p className="event-time">9.17 (수) - 9.30 (월)</p>
              </div>
            </div>

            {/* 새로운 아티클 */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                새로운 아티클 <span className="more-link">전체 보기 &gt;</span>
              </h3>
              <div className="news-list">
                {newsItems.map((item, index) => (
                  <div key={index} className="news-item">
                    <h4 className="news-title">{item.title}</h4>
                    <p className="news-date">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
