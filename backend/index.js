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

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
