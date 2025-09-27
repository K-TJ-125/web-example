import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Test from './pages/test';
import MainPage from './pages/MainPage';
// 페이지 라우터가 설정된 최상위 컴포넌트

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
