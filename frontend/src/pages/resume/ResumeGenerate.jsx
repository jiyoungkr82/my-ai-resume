import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeGenerate = () => {
  // 선택된 경험 ID를 관리하는 상태 추가
  const [selectedExpIds, setSelectedExpIds] = useState([]);
  const [allExperiences, setAllExperiences] = useState([]);
  const [filteredExps, setFilteredExps] = useState([]);
  const [formData, setFormData] = useState({
    companyName: '',
    question: '',
    selectedTags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. 선택 토글 함수
  const handleExpToggle = (expId) => {
    setSelectedExpIds(prev =>
      prev.includes(expId) ? prev.filter(id => id !== expId) : [...prev, expId]
    );
  };

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
    axios.get(`${import.meta.env.VITE_API_URL}/api/tags`)
      .then(res => setAvailableTags(res.data))
      .catch(err => console.error("태그 로드 실패", err));

    // 전체 경험 로드 (memberId 1 가정)
    axios.get(`${import.meta.env.VITE_API_URL}/api/experiences`)
      .then(res => setAllExperiences(res.data))
      .catch(err => console.error("경험 로드 실패", err));
  }, []);

  // 태그가 바뀔 때마다 필터링된 리스트 업데이트
  useEffect(() => {
    if (formData.selectedTags.length === 0) {
      setFilteredExps([]);
    } else {
      const selectedTagNames = availableTags
            .filter(tag => formData.selectedTags.includes(tag.id))
            .map(tag => tag.name);

      const filtered = allExperiences.filter(exp =>
        exp.tags?.some(tagName => selectedTagNames.includes(tagName))
      );
      setFilteredExps(filtered);
    }
  }, [formData.selectedTags, allExperiences]);

  const handleTagToggle = (tagId) => { // name 대신 id를 인자로 받음
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
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

    const payload = {
          companyName: formData.companyName,
          question: formData.question,
          selectedTagIds: formData.selectedTags
    };

    try {
      const token = localStorage.getItem('accessToken'); // 저장된 토큰 가져오기
      console.log("Request URL:", `${import.meta.env.VITE_API_URL}/api/resumes/generate`);

      const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/resumes/generate`,
          payload
          );
      setResult(response.data);
    } catch (err) {
      alert("AI 자소서 생성 중 에러가 발생했습니다.");
      console.error("Error Detail:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', fontFamily: 'sans-serif' }}>
      <h2>🚀 AI 자소서 초안 생성기</h2>
      <form onSubmit={handleSubmit}>
        {/* 지원 기업명 & 문항 입력 */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>지원 기업명</label>
          <input
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '5px' }}
            placeholder="예: 구글 코리아"
            value={formData.companyName}
            onChange={e => setFormData({...formData, companyName: e.target.value})}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>자기소개서 문항</label>
          <textarea
            style={{ width: '100%', height: '100px', padding: '10px', marginTop: '5px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '5px' }}
            placeholder="질문을 입력하세요 (예: 본인의 기술적 강점은?)"
            value={formData.question}
            onChange={e => setFormData({...formData, question: e.target.value})}
            required
          />
        </div>

        {/* 태그 선택 섹션 (필터 역할) */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>🏷️ 활용할 나의 경험 태그 (필터):</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableTags?.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                style={{
                  padding: '8px 15px', borderRadius: '20px',
                  border: '1px solid #2196F3', cursor: 'pointer',
                  backgroundColor: formData.selectedTags.includes(tag.id) ? '#2196F3' : 'white',
                  color: formData.selectedTags.includes(tag.id) ? 'white' : '#2196F3',
                  transition: 'all 0.3s', fontSize: '14px'
                }}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* [수정된 포인트] 카드형 경험 리스트 미리보기 섹션 */}
        {filteredExps.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '10px', color: '#0d47a1' }}>
              📍 AI가 참고할 경험 리스트 ({filteredExps.length}건):
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '15px',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              {filteredExps.map(exp => (
                <div
                  key={exp.id}
                  style={{
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #d1e9ff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1565c0', marginBottom: '6px' }}>
                    {exp.title}
                  </div>
                  {/* 요약본 출력: 요약이 없으면 본문 일부 출력 */}
                  <div style={{
                    fontSize: '12px',
                    color: '#555',
                    marginBottom: '10px',
                    lineHeight: '1.5',
                    height: '2.8em', // 2줄 정도의 높이 강제 지정
                    overflow: 'hidden'
                  }}>
                    {exp.summary || (exp.content && exp.content.substring(0, 100) + "...")}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {exp.tags.map(t => (
                      <span key={t} style={{ fontSize: '10px', color: '#2196F3', backgroundColor: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              * 위 카드들에 담긴 내용이 AI의 프롬프트에 자동으로 주입됩니다.
            </p>
          </div>
        )}

        {/* 로딩 표시 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '20px' }}>
            <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ margin: 0, color: '#1976d2', fontWeight: 'bold', fontSize: '14px' }}>{loadingMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#ccc' : '#000', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'default' : 'pointer', border: 'none', borderRadius: '5px', transition: 'background 0.3s' }}
        >
          {loading ? 'AI가 열심히 작성 중...' : '자소서 생성하기'}
        </button>
      </form>

      {/* 결과 표시 */}
      {result && (
        <div style={{ marginTop: '30px', padding: '25px', backgroundColor: '#fff', border: '2px solid #2196F3', borderRadius: '8px', position: 'relative', boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)' }}>
          <h3 style={{ color: '#2196F3', marginTop: 0, borderBottom: '1px solid #e3f2fd', paddingBottom: '10px' }}>✨ AI가 작성한 초안</h3>
          <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '15px', color: '#333' }}>{result}</p>
          <button
            onClick={() => { navigator.clipboard.writeText(result); alert("복사되었습니다!"); }}
            style={{ position: 'absolute', top: '20px', right: '20px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#e3f2fd', border: '1px solid #2196F3', color: '#2196F3', borderRadius: '4px' }}
          >
            복사하기
          </button>
        </div>
      )}
    </div>
  );

};

export default ResumeGenerate;
