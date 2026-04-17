import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './pages/auth/Axios'
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import ExperienceAdd from './pages/resume/ExperienceAdd';
import ResumeGenerate from './pages/resume/ResumeGenerate';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 상태 체크
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        alert("로그아웃 되었습니다.");
        window.location.href = '/'; // 상태 초기화를 위해 새로고침 포함 이동 추천
    };

 return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold', textDecoration: 'none' }}>🚀 AI Booster</Link>
          <Link to="/add-experience" style={{ marginRight: '15px' }}>경험등록</Link>
          <Link to="/generate-resume">자소서생성</Link>
        </div>

        <div>
          {isLoggedIn ? (
            <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}>로그아웃</button>
          ) : (
            <>
              <Link to="/signin" style={{ marginRight: '10px' }}>로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<h1 style={{ textAlign: 'center' }}>AI Career Booster에 오신 것을 환영합니다!</h1>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-experience" element={<ExperienceAdd />} />
        <Route path="/generate-resume" element={<ResumeGenerate />} />
      </Routes>
    </Router>
  );
}

export default App;