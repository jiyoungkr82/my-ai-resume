import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import ExperienceAdd from './pages/resume/ExperienceAdd';
import ResumeGenerate from './pages/resume/ResumeGenerate';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/signup" style={{ marginRight: '10px' }}>회원가입</Link>
        <Link to="/add-experience" style={{ marginRight: '10px' }}>경험등록</Link>
        <Link to="/generate-resume">자소서생성</Link>
      </nav>

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-experience" element={<ExperienceAdd />} />
        <Route path="/generate-resume" element={<ResumeGenerate />} />
        {/* 기본 경로 설정 */}
        <Route path="/" element={<h1>AI Career Booster에 오신 것을 환영합니다!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
