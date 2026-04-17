import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Signup = () => {
  // 1. 상태 관리 (State Management)
  // 사용자가 입력한 값을 실시간으로 저장하는 '바구니'입니다.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  // 2. 입력값 변경 이벤트 핸들러
  // input에 글자를 칠 때마다 formData 상태를 업데이트합니다.
  const handleChange = (e) => {
    setFormData({
      ...formData, // 기존 값은 유지하고 (Spread Operator)
      [e.target.name]: e.target.value // 변경된 필드만 교체
    });
  };

  // 3. 백엔드 전송 함수 (API Call)
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    try {
      // Axios를 이용해 백엔드(Spring Boot) API를 호출합니다.
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
      alert(response.data); // "회원가입 완료" 메시지 출력
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>비밀번호:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>이름:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: '10px', width: '100%' }}>가입하기</button>
      </form>
    </div>
  );
};

export default Signup;
