import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './pages/auth/Axios'
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import ExperienceAdd from './pages/resume/ExperienceAdd';
import ResumeGenerate from './pages/resume/ResumeGenerate';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    window.location.href = '/';
  };

  // 스타일 정의
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)', // 아이폰 스타일 유리 효과
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const bottomTabStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65px',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #eee',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)', // 상단 그림자
    paddingBottom: 'env(safe-area-inset-bottom)', // 아이폰 하단 바 대응
    zIndex: 1000
  };

  const tabItemStyle = {
    textDecoration: 'none',
    color: '#8E8E93',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  };

  const loginBtnStyle = {
    padding: '6px 14px',
    borderRadius: '20px',
    backgroundColor: '#007AFF',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 122, 255, 0.2)'
  };

  return (
    <Router>
      {/* 상단 헤더 */}
      <header style={headerStyle}>
        <Link to="/" style={{ fontSize: '20px', fontWeight: '800', textDecoration: 'none', color: '#000' }}>
          🚀 Booster
        </Link>
        <div>
          {isLoggedIn ? (
            <button onClick={handleLogout} style={{ border: 'none', background: 'none', color: '#FF3B30', fontSize: '14px' }}>로그아웃</button>
          ) : (
            <Link to="/signin" style={loginBtnStyle}>로그인</Link>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>반가워요! 👋</h1>
                <p style={{ color: '#666', lineHeight: '1.5' }}>AI와 함께 당신의 커리어를<br/>한 단계 더 높여보세요.</p>
              </div>
            } />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-experience" element={<ExperienceAdd />} />
            <Route path="/generate-resume" element={<ResumeGenerate />} />
          </Routes>
        </div>
      </main>

      {/* 하단 탭 바 (로그인 시에만 노출하거나 항상 노출 선택 가능) */}
      <nav style={bottomTabStyle}>
        <Link to="/" style={{...tabItemStyle, color: '#007AFF'}}>
          <span style={{fontSize: '20px'}}>🏠</span>
          <span>홈</span>
        </Link>
        <Link to="/add-experience" style={tabItemStyle}>
          <span style={{fontSize: '20px'}}>📝</span>
          <span>경험등록</span>
        </Link>
        <Link to="/generate-resume" style={tabItemStyle}>
          <span style={{fontSize: '20px'}}>✨</span>
          <span>자소서생성</span>
        </Link>
        <Link to="/signup" style={tabItemStyle}>
          <span style={{fontSize: '20px'}}>👤</span>
          <span>마이</span>
        </Link>
      </nav>
    </Router>
  );
}

export default App;
