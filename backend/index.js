

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// env 파일 로드
dotenv.config();
// user.json 파일 경로
const userFile = path.join(process.cwd(), "user.json");

// 유틸: user.json 읽기/쓰기
function readUsers() {
  try {
    const data = fs.readFileSync(userFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function writeUsers(users) {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

// 이메일 인증번호 저장용 (메모리, 실제 서비스는 DB/Redis 사용)
const emailCodes = {};
//hi
// 서버 실행 포트
const PORT = Number(process.env.SERVER_PORT);

// Express 앱 생성
const app = express();

// CORS 설정
app.use(cors());

// JSON 요청 바디 파싱 미들웨어
app.use(express.json());

// 기본 라우트 설정
app.get("/", (req, res) => {
  res.send("Web Example Server!");
});

app.post("/chat", async (req, res) => {
  const { name, message } = req.body;
  console.log(`프론트엔드로부터 메시지 수신! ${name}: ${message}`);

  if (!message) {
    return res.status(400).json({ error: "메시지가 없습니다." });
  }

  // ChatGPT API 호출
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: `다음은 ${name}님이 전송한 메시지입니다.
        ${name}님의 메시지에 대한 답을 다음 스타일로 작성해주세요.
        20대 대학생, 친구 같은 친근한 말투.`,
      },
      { role: "user", content: message },
    ],
    max_output_tokens: 2048,
    temperature: 0.7,
  });

  res.status(200).json({ reply: response.output_text });
});

// 서버 상태 확인 API 추가
app.get("/status", (req, res) => {
  res.json({
    message: "백엔드 서버와 성공적으로 연동되었습니다! 🎉",
    timestamp: new Date().toLocaleString("ko-KR"),
    status: "connected",
  });
});

// 회원가입
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "필수 정보 누락" });
  }
  // 이메일 중복 체크
  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "이미 가입된 이메일입니다." });
  }
  // (테스트용) 이메일 인증 확인 생략
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // 실제 서비스는 해시 필요
  };
  users.push(newUser);
  writeUsers(users);
  delete emailCodes[email];
  res
    .status(201)
    .json({ message: "회원가입 성공", user: { id: newUser.id, name, email } });
});

// 로그인
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log("[로그인 시도] 프론트에서 받은 값:", { email, password });
  if (!email || !password) {
    console.log("[로그인 실패] 필수 정보 누락");
    return res.status(400).json({ message: "필수 정보 누락" });
  }
  const users = readUsers();
  console.log("[로그인] user.json 전체:", users);
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    console.log("[로그인 실패] 일치하는 사용자 없음");
    return res.status(401).json({ message: "이메일 또는 비밀번호 오류" });
  }
  console.log("[로그인 성공]", user);
  // 실제 서비스는 JWT 등 토큰 발급
  res.status(200).json({
    message: "로그인 성공",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// 이메일 인증번호 발송 (테스트용: 항상 123456)
app.post("/api/send-code", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "이메일 필요" });
  // 실제 서비스는 이메일 전송 구현 필요
  emailCodes[email] = { code: "123456", verified: false };
  res.json({ message: "인증번호 전송됨 (테스트용)", code: "123456" });
});

// 이메일 인증번호 확인
app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "필수 정보 누락" });
  if (emailCodes[email] && emailCodes[email].code === code) {
    emailCodes[email].verified = true;
    return res.json({ message: "이메일 인증 성공" });
  }
  res.status(400).json({ message: "인증번호 오류" });
});

// /api/status 라우트 추가 (프론트엔드 상태 확인용)
app.get("/api/status", (req, res) => {
  res.json({
    message: "백엔드 서버와 성공적으로 연동되었습니다! 🎉",
    timestamp: new Date().toLocaleString("ko-KR"),
    status: "connected",
  });
});
// ...기존 코드...
// 배우고 싶은 재능에 대한 배경지식 안내 챗봇
app.post("/api/knowledge-bot", async (req, res) => {
  const { talent } = req.body;
  if (!talent || typeof talent !== "string" || !talent.trim()) {
    return res.status(400).json({ message: "재능을 입력하세요." });
  }
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `"${talent}"을(를) 배우고 싶은 사람이 먼저 알고 가면 좋은 배경지식, 기초 개념, 준비사항을 3~5문장으로 친절하게 안내해줘. 너무 어려운 용어는 피하고, 초보자도 이해할 수 있게 설명해줘.`;
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "너는 친절한 배경지식 안내 챗봇이야." },
        { role: "user", content: prompt },
      ],
      max_output_tokens: 512,
      temperature: 0.7,
    });
    res.json({ background: response.output_text });
  } catch (err) {
    console.error("[배경지식 챗봇 오류]", err);
    res.status(500).json({ message: "챗봇 응답 생성에 실패했습니다." });
  }
});

// 재능 질문 5개 생성 API
app.post("/api/talent-questions", async (req, res) => {
  const { talent } = req.body;
  if (!talent) return res.status(400).json({ message: "재능이 필요합니다." });
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
"${talent}"에 대해 본인의 지식 수준을 1~5단계로 구분할 수 있는 5개의 질문을 만들어줘.
각 질문은 매우 아님, 아님, 맞음, 매우 맞음 4지선다로 답할 수 있어야 해.
아래와 같은 JSON 배열만, 다른 말 없이, 코드블록 없이, 반드시 반환해줘.
예시: [
  {"question": "기본 개념을 알고 있나요?"},
  {"question": "기초 기술을 실습해 본 적이 있나요?"},
  {"question": "중급 과제를 해결할 수 있나요?"},
  {"question": "프로젝트를 해본 경험이 있나요?"},
  {"question": "남에게 가르칠 수 있나요?"}
]
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "너는 재능 수준 평가 질문을 만드는 AI야. 반드시 JSON 배열로만 답해.",
        },
        { role: "user", content: prompt },
      ],
      max_output_tokens: 1024,
      temperature: 0.7,
    });

    let output = response.output_text.trim();

    // 코드블록(````json ... ````)이 있을 경우 추출
    const codeBlockMatch = output.match(/```json([\s\S]*?)```/i);
    if (codeBlockMatch) {
      output = codeBlockMatch[1].trim();
    }

    // JSON 배열 부분만 추출
    const match = output.match(/\[([\s\S]*?)\]/);
    let questions = [];
    if (match) {
      try {
        questions = JSON.parse("[" + match[1] + "]");
      } catch (e) {
        return res
          .status(500)
          .json({ message: "AI 응답 파싱 실패", raw: output });
      }
    } else {
      return res
        .status(500)
        .json({ message: "AI 응답에 JSON 배열이 없습니다.", raw: output });
    }

    res.json({ questions });
  } catch (err) {
    console.error("[재능 질문 AI 오류]", err);
    res.status(500).json({ message: "질문 생성 실패" });
  }
});

// 재능 수준 저장 API
app.post("/api/save-talent", (req, res) => {
  const { email, talent, talentQuestions, talentAnswers, talentLevel } = req.body;
  if (!email || !talent || !talentQuestions || !talentAnswers || !talentLevel) {
    return res.status(400).json({ message: "필수 정보 누락" });
  }

  const users = readUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) {
    return res.status(404).json({ message: "사용자 없음" });
  }

  users[idx].talent = talent;
  users[idx].talentQuestions = talentQuestions;
  users[idx].talentAnswers = talentAnswers;
  users[idx].talentLevel = talentLevel;
  writeUsers(users);

  res.json({ success: true });
});

app.get("/api/user-talent", (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "이메일 필요" });
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "사용자 없음" });
  res.json({
    talent: user.talent || null,
    talentLevel: user.talentLevel || null,
  });
});

// rooms.json 파일 경로
const roomsFile = path.join(process.cwd(), "rooms.json");

// 유틸: rooms.json 읽기/쓰기
function readRooms() {
  try {
    const data = fs.readFileSync(roomsFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function writeRooms(rooms) {
  fs.writeFileSync(roomsFile, JSON.stringify(rooms, null, 2));
}

// 궁금한 재능으로 방 찾기/생성 API
app.post("/api/find-or-create-room", (req, res) => {
  const { talent, guestEmail, guestTalent } = req.body;
  if (!talent || !guestEmail || !guestTalent) {
    return res.status(400).json({ message: "기부 재능, 게스트 이메일, 배우고자 하는 재능 모두 필요" });
  }
  // 1. 이미 해당 재능의 방이 있는지 확인 (게스트가 아직 없는 방만, guestTalent도 일치해야 함)
  let rooms = readRooms();
  let room = rooms.find(
    (r) => r.talent === talent && r.guestTalent === guestTalent && (!r.guestEmail || r.guestEmail === guestEmail)
  );
  if (room) {
    // 게스트가 아직 없는 방이면 게스트로 등록
    if (!room.guestEmail) {
      room.guestEmail = guestEmail;
      writeRooms(rooms);
    }
    return res.json({ room, created: false });
  }
  // 2. 해당 재능을 가진 유저(방장) 찾기 (레벨 높은 순)
  const users = readUsers();
  const host = users
    .filter((u) => u.talent === talent && u.talentLevel)
    .sort((a, b) => b.talentLevel - a.talentLevel)[0];
  if (!host) {
    return res.status(404).json({ message: "해당 재능을 가진 사용자가 없습니다." });
  }
  // 3. 방 생성 (guestTalent 포함)
  const newRoom = {
    id: Date.now(),
    talent, // 기부 재능
    hostEmail: host.email,
    hostTalentLevel: host.talentLevel,
    guestEmail,
    guestTalent, // 배우고자 하는 재능
  };
  rooms.push(newRoom);
  writeRooms(rooms);
  res.json({ room: newRoom, created: true });
});

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
