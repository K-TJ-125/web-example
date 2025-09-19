import express from "express";
import dotenv from "dotenv";

// env 파일 로드
dotenv.config();

// 서버 실행 포트
const PORT = Number(process.env.SERVER_PORT);

// Express 앱 생성
const app = express();

// JSON 요청 바디 파싱 미들웨어
app.use(express.json());

// 기본 라우트 설정
app.get("/", (req, res) => {
  res.send("Web Example Server!");
});

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
