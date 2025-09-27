import React, { useEffect, useState } from "react";
import TalentTest from "./TalentTest";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
  const [talentInfo, setTalentInfo] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [searchGuestTalent, setSearchGuestTalent] = useState("");
  const [searchResultRoom, setSearchResultRoom] = useState(null);
  const [searchError, setSearchError] = useState("");
  const userEmail = localStorage.getItem("userEmail");
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const navigate = useNavigate();
  const [showTalentTest, setShowTalentTest] = useState(false);
  const [talentInput, setTalentInput] = useState("");

  // 매칭된 방(게스트 또는 호스트로 성사된 방) 상태
  const [matchedRoom, setMatchedRoom] = useState(null);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setUserName("");
    setTalentInfo(null); // 로그아웃 시 내 재능/레벨 정보도 즉시 숨김
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
  }, [userEmail, showTalentTest]);

  // 방 목록 불러오기 및 매칭된 방 찾기 (게스트 또는 호스트)
  useEffect(() => {
    fetch("http://localhost:3000/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.rooms)) {
          setRooms(data.rooms);
          // 1. 내가 게스트로 매칭된 방
          let found = data.rooms.find(
            (room) => room.guestEmail && room.guestEmail === userEmail
          );
          // 2. 내가 호스트이고 게스트가 입장한 방
          if (!found) {
            found = data.rooms.find(
              (room) =>
                room.hostEmail === userEmail &&
                room.guestEmail &&
                room.guestEmail !== ""
            );
          }
          setMatchedRoom(found || null);
        }
      });
  }, [userEmail]);

  // 매칭된 방(등가교환 성사) 제외한 방만 보여주기 위한 필터
  const visibleRooms = rooms.filter(
    (room) => !(room.hostEmail && room.hostEmail !== "" && room.guestEmail && room.guestEmail !== "")
  );
  // 검색 결과도 마찬가지로 필터 적용
  const visibleSearchResultRoom =
    searchResultRoom &&
    !(searchResultRoom.hostEmail && searchResultRoom.hostEmail !== "" && searchResultRoom.guestEmail && searchResultRoom.guestEmail !== "")
      ? searchResultRoom
      : null;

  return (
    <div className="main-page">
      {/* 이하 기존 전체 UI 코드 유지 */}
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
      {/* ...이하 기존 코드 동일... */}
      <section className="hero">
        {/* ...existing code... */}
        <div className="hero-content">
          {/* ...existing code... */}
          {talentInfo && (
            <div style={{ margin: "24px 0", fontWeight: 600 }}>
              내 재능:{" "}
              <span style={{ color: "#010101ff" }}>{talentInfo.talent}</span>
              {" / "}
              레벨:{" "}
              <span style={{ color: "#010202ff" }}>
                {talentInfo.talentLevel}
              </span>
            </div>
          )}
          {/* ...이하 기존 코드 동일... */}
          <div className="search-container">
            {/* ...existing code... */}
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
          {showTalentTest && (
            <div style={{ marginTop: 32 }}>
              <TalentTest
                talent={talentInput}
                onClose={() => setShowTalentTest(false)}
                onComplete={() => {
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
                }}
              />
            </div>
          )}
          <div className="search-container secondary-search">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="배우고 싶은 재능이 무엇인가요?"
                className="search-input"
                value={searchGuestTalent}
                onChange={(e) => setSearchGuestTalent(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <button
              className="search-btn"
              onClick={async () => {
                setSearchError("");
                setSearchResultRoom(null);
                if (!searchGuestTalent.trim()) {
                  setSearchError("궁금한 재능을 입력하세요.");
                  return;
                }
                if (!talentInfo || !talentInfo.talent) {
                  setSearchError(
                    "내가 줄 수 있는 재능 정보가 없습니다. 먼저 재능을 등록하세요."
                  );
                  return;
                }
                const found = rooms.find(
                  (room) =>
                    room.talent === searchGuestTalent.trim() &&
                    room.guestTalent === talentInfo.talent
                );
                if (found) {
                  setSearchResultRoom(found);
                  return;
                }
                if (
                  !window.confirm(
                    "해당 조건의 방이 없습니다. 방을 생성하시겠습니까?"
                  )
                ) {
                  setSearchError("방이 없습니다. 방 생성을 취소했습니다.");
                  return;
                }
                try {
                  const res = await fetch(
                    "http://localhost:3000/api/find-or-create-room",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        talent: talentInfo.talent,
                        guestTalent: searchGuestTalent.trim(),
                      }),
                    }
                  );
                  const data = await res.json();
                  if (res.ok && data.room) {
                    setSearchResultRoom(data.room);
                    fetch("http://localhost:3000/api/rooms")
                      .then((res) => res.json())
                      .then((data) => {
                        if (Array.isArray(data.rooms)) setRooms(data.rooms);
                      });
                  } else {
                    setSearchError(data.message || "방 생성에 실패했습니다.");
                  }
                } catch (e) {
                  setSearchError("방 생성 중 오류가 발생했습니다.");
                }
              }}
              style={{ marginTop: 8 }}
            >
              찾기
            </button>
          </div>
        </div>
      </section>

      {/* 매칭된 방이 있으면 최상단에 메시지와 방 정보 노출 */}
      {matchedRoom && (
        <div
          style={{
            background: "#e6f4ea",
            padding: 24,
            margin: "24px 0 0 0",
            borderRadius: 12,
            border: "1px solid #b7e0c2",
          }}
        >
          <h2
            className="section-title"
            style={{ color: "#1a8917", marginTop: 0 }}
          >
            해당 사용자에게 원하는 재능의 등가교환이 성사되었습니다!
          </h2>
          <div style={{ margin: "16px 0 0 0", fontWeight: 600 }}>
            <span>방 정보</span>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: 8, border: "1px solid #eee" }}>
                    방 ID
                  </th>
                  <th style={{ padding: 8, border: "1px solid #eee" }}>
                    기부 재능
                  </th>
                  <th style={{ padding: 8, border: "1px solid #eee" }}>
                    방장 이메일
                  </th>
                  <th style={{ padding: 8, border: "1px solid #eee" }}>
                    방장 레벨
                  </th>
                  <th style={{ padding: 8, border: "1px solid #eee" }}>
                    배우고자 하는 재능
                  </th>
                  <th style={{ padding: 8, border: "1px solid #eee" }}>
                    게스트 이메일
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>
                    {matchedRoom.id}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>
                    {matchedRoom.talent}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>
                    {matchedRoom.hostEmail}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>
                    {matchedRoom.hostTalentLevel}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>
                    {matchedRoom.guestTalent}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>
                    {matchedRoom.guestEmail}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <main className="main-content">
        <div className="content-container">
          <section className="talent-section">
            <h2 className="section-title">
              {searchResultRoom ? "검색 결과 방 목록" : "모든 방 목록"}
            </h2>
            <div className="talent-grid" style={{ gap: 32 }}>
              {visibleSearchResultRoom ? (
                <div
                  className="talent-card"
                  key={visibleSearchResultRoom.id}
                  style={{
                    border: '1.5px solid #d1d5db',
                    borderRadius: 16,
                    boxShadow: '0 4px 16px 0 rgba(118,75,162,0.07)',
                    background: '#fff',
                    padding: 0,
                    transition: 'box-shadow 0.2s, border 0.2s',
                    minWidth: 260,
                    maxWidth: 340,
                    margin: '0 auto',
                    cursor: 'pointer',
                  }}
                  onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(118,75,162,0.13)'; e.currentTarget.style.border = '1.5px solid #764ba2'; }}
                  onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(118,75,162,0.07)'; e.currentTarget.style.border = '1.5px solid #d1d5db'; }}
                >
                  <div className="talent-card-content" style={{ padding: '28px 24px 20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', minHeight: 140 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span className="talent-card-title" style={{ fontSize: 22, fontWeight: 700, color: '#333' }}>{visibleSearchResultRoom.talent}</span>
                      <span className="talent-level-tag" style={{ fontSize: 15, background: '#e0e7ff', color: '#333', borderRadius: 12, padding: '4px 14px', fontWeight: 700, letterSpacing: 1 }}>Lv.{visibleSearchResultRoom.hostTalentLevel}</span>
                    </div>
                    <div style={{ height: 1, background: '#f0f0f0', margin: '8px 0 18px 0' }} />
                    <div className="talent-card-category" style={{ fontSize: 17, color: '#764ba2', fontWeight: 600, textAlign: 'left', marginBottom: 0 }}>
                      배우고 싶은 재능<br />
                      <span style={{ color: '#333', fontSize: 18, fontWeight: 700 }}>{visibleSearchResultRoom.guestTalent}</span>
                    </div>
                    {userEmail &&
                      visibleSearchResultRoom.guestEmail === "" &&
                      talentInfo &&
                      visibleSearchResultRoom.guestTalent === talentInfo.talent &&
                      visibleSearchResultRoom.talent === searchGuestTalent.trim() && (
                        <button
                          style={{ marginTop: 20, padding: '10px 0', background: '#764ba2', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 16, width: '100%' }}
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `http://localhost:3000/api/rooms/${visibleSearchResultRoom.id}/join`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    guestEmail: userEmail,
                                  }),
                                }
                              );
                              const data = await res.json();
                              if (res.ok && data.success) {
                                alert("방에 입장했습니다!");
                                setSearchResultRoom({
                                  ...visibleSearchResultRoom,
                                  guestEmail: userEmail,
                                });
                                fetch("http://localhost:3000/api/rooms")
                                  .then((res) => res.json())
                                  .then((data) => {
                                    if (Array.isArray(data.rooms))
                                      setRooms(data.rooms);
                                  });
                              } else {
                                alert(data.message || "입장 실패");
                              }
                            } catch (e) {
                              alert("입장 중 오류 발생");
                            }
                          }}
                        >
                          입장
                        </button>
                      )}
                  </div>
                </div>
              ) : visibleRooms.length === 0 ? (
                <div style={{ textAlign: "center", padding: 16, width: '100%' }}>방이 없습니다.</div>
              ) : (
                visibleRooms.map((room) => (
                  <div
                    className="talent-card"
                    key={room.id}
                    style={{
                      border: '1.5px solid #d1d5db',
                      borderRadius: 16,
                      boxShadow: '0 4px 16px 0 rgba(118,75,162,0.07)',
                      background: '#fff',
                      padding: 0,
                      transition: 'box-shadow 0.2s, border 0.2s',
                      minWidth: 260,
                      maxWidth: 340,
                      margin: '0 auto',
                      cursor: 'pointer',
                    }}
                    onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(118,75,162,0.13)'; e.currentTarget.style.border = '1.5px solid #764ba2'; }}
                    onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(118,75,162,0.07)'; e.currentTarget.style.border = '1.5px solid #d1d5db'; }}
                  >
                    <div className="talent-card-content" style={{ padding: '28px 24px 20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', minHeight: 140 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span className="talent-card-title" style={{ fontSize: 22, fontWeight: 700, color: '#333' }}>{room.talent}</span>
                        <span className="talent-level-tag" style={{ fontSize: 15, background: '#e0e7ff', color: '#333', borderRadius: 12, padding: '4px 14px', fontWeight: 700, letterSpacing: 1 }}>Lv.{room.hostTalentLevel}</span>
                      </div>
                      <div style={{ height: 1, background: '#f0f0f0', margin: '8px 0 18px 0' }} />
                      <div className="talent-card-category" style={{ fontSize: 17, color: '#764ba2', fontWeight: 600, textAlign: 'left', marginBottom: 0 }}>
                        배우고 싶은 재능<br />
                        <span style={{ color: '#333', fontSize: 18, fontWeight: 700 }}>{room.guestTalent}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
