import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

// env 파일 로드
dotenv.config();
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
    timestamp: new Date().toLocaleString('ko-KR'),
    status: "connected"
  });
});


// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});