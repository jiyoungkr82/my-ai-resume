import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeGenerate = () => {
  const [formData, setFormData] = useState({
    memberId: 1,
    companyName: '',
    question: '',
    selectedTags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 추가: 로딩 메시지 상태
  const [loadingMsg, setLoadingMsg] = useState('');

  const messages = [
    "🚀 AI가 등록하신 경험 데이터를 분석 중입니다...",
    "💡 선택하신 태그에 맞춰 핵심 역량을 추출하고 있습니다...",
    "✍️ 지원 기업의 문항에 최적화된 문장을 구성 중입니다...",
    "✨ 거의 다 되었습니다! 잠시만 기다려 주세요."
  ];

  // 로딩 메시지 순환 처리
  useEffect(() => {
    let timer;
    if (loading) {
      let i = 0;
      setLoadingMsg(messages[0]);
      timer = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMsg(messages[i]);
      }, 2500); // 2.5초마다 메시지 교체
    }
    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/tags')
      .then(res => setAvailableTags(res.data))
      .catch(err => console.error("태그 로드 실패", err));
  }, []);

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

    setResult(''); // 이전 결과 초기화
    setLoading(true);
    try {
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
        {/* ... (회사명, 문항 입력창은 기존과 동일) */}
        <div style={{ marginBottom: '15px' }}>
          <label>지원 기업명</label>
          <input
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
            placeholder="예: 구글 코리아"
            onChange={e => setFormData({...formData, companyName: e.target.value})}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>자기소개서 문항</label>
          <textarea
            style={{ width: '100%', height: '100px', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
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
                margin: '5px', padding: '8px 15px', borderRadius: '20px',
                border: '1px solid #2196F3', cursor: 'pointer',
                backgroundColor: formData.selectedTags.includes(tag.name) ? '#2196F3' : 'white',
                color: formData.selectedTags.includes(tag.name) ? 'white' : '#2196F3',
                transition: 'all 0.3s'
              }}
            >
              #{tag.name}
            </button>
          ))}
        </div>

        {/* 로딩 중일 때 메시지 표시 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '20px' }}>
            <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ margin: 0, color: '#1976d2', fontWeight: 'bold' }}>{loadingMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#ccc' : '#000', color: '#fff', fontSize: '16px', cursor: loading ? 'default' : 'pointer', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'AI 분석 중...' : '자소서 생성하기'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', border: '1px dashed #aaa', whiteSpace: 'pre-wrap', borderRadius: '8px' }}>
          <h3>✨ AI가 작성한 초안</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerate;
