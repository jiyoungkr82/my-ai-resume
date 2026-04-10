import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeGenerate = () => {
  const [formData, setFormData] = useState({
    memberId: 1, // 테스트용 하드코딩 (나중엔 로그인 정보에서 가져옴)
    companyName: '',
    question: '',
    selectedTags: [] // 선택된 태그 '이름' 리스트
  });
  const [availableTags, setAvailableTags] = useState([]); // DB에서 가져온 전체 태그
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. 페이지 로딩 시 선택 가능한 태그 목록 불러오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/tags')
      .then(res => setAvailableTags(res.data))
      .catch(err => console.error("태그 로드 실패", err));
  }, []);

  // 태그 선택/해제 핸들러
  const handleTagToggle = (tagName) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagName)
        ? prev.selectedTags.filter(t => t !== tagName)
        : [...prev.selectedTags, tagName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedTags.length === 0) {
      alert("최소 하나 이상의 경험 태그를 선택해주세요!");
      return;
    }

    setLoading(true);
    try {
      // ResumeService의 generateWithTags를 호출하는 API
      const response = await axios.post('http://localhost:8080/api/resumes/generate', formData);
      setResult(response.data);
    } catch (err) {
      alert("AI 자소서 생성 중 에러가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>🚀 AI 자소서 초안 생성기</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>지원 기업명</label>
          <input
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            placeholder="예: 구글 코리아"
            onChange={e => setFormData({...formData, companyName: e.target.value})}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>자기소개서 문항</label>
          <textarea
            style={{ width: '100%', height: '100px', padding: '10px', marginTop: '5px' }}
            placeholder="질문을 입력하세요 (예: 본인의 기술적 강점은?)"
            onChange={e => setFormData({...formData, question: e.target.value})}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p>활용할 나의 경험 태그 (다중 선택 가능):</p>
          {availableTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.name)}
              style={{
                margin: '5px',
                padding: '8px 15px',
                borderRadius: '20px',
                border: '1px solid #2196F3',
                cursor: 'pointer',
                backgroundColor: formData.selectedTags.includes(tag.name) ? '#2196F3' : 'white',
                color: formData.selectedTags.includes(tag.name) ? 'white' : '#2196F3',
                transition: 'all 0.3s'
              }}
            >
              #{tag.name}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'AI가 경험을 분석하여 작성 중...' : '자소서 생성하기'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', border: '1px dashed #aaa', whiteSpace: 'pre-wrap' }}>
          <h3>✨ AI가 작성한 초안</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerate;
