import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExperienceAdd = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [achievement, setAchievement] = useState('');
    const [availableTags, setAvailableTags] = useState([]); // DB의 기존 태그들
    const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 '이름' 리스트
    const [customTag, setCustomTag] = useState(''); // 직접 입력 중인 태그
    {/* 테스트용 MemberId */}
    const TEMP_MEMBER_ID = 1;

    // 1. 초기 로딩 시 태그 리스트 가져오기
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/tags`)
            .then(res => setAvailableTags(res.data))
            .catch(err => console.error("태그 로드 실패", err));
    }, []);

    // 태그 선택/해제 토글 (이름 기준)
    const handleTagToggle = (tagName) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(name => name !== tagName)
                : [...prev, tagName]
        );
    };

    // 직접 태그 입력 후 Enter 시 추가
    const handleAddCustomTag = (e) => {
        if (e.key === 'Enter' && customTag.trim() !== '') {
            e.preventDefault();
            const trimmedTag = customTag.trim();
            if (!selectedTags.includes(trimmedTag)) {
                setSelectedTags([...selectedTags, trimmedTag]);
            }
            setCustomTag(''); // 입력창 초기화
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            memberId: TEMP_MEMBER_ID, // 테스트용 하드코딩
            title,
            content,
            achievement,
            tagNames: selectedTags // ID 대신 이름 리스트 전송
        };

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/experiences`, payload);
            alert("경험이 성공적으로 등록되었습니다!");
            // 등록 후 초기화
            setTitle(''); setContent(''); setAchievement(''); setSelectedTags([]);
        } catch (err) {
            alert("등록 실패");
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '30px', border: '1px solid #eee', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Step 1. 나의 경험 등록하기</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>프로젝트 제목</label>
                    <input
                        style={{ width: '100%', padding: '12px', marginTop: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px' }}
                        placeholder="경험의 제목을 입력하세요"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>수행 내용</label>
                    <textarea
                        style={{ width: '100%', height: '120px', padding: '12px', marginTop: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px' }}
                        placeholder="어떤 역할을 수행했나요?"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>핵심 성과</label>
                    <textarea
                        style={{ width: '100%', height: '100px', padding: '12px', marginTop: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px' }}
                        placeholder="구체적인 수치나 성과를 적어주세요 (AI 분석 시 중요)"
                        value={achievement}
                        onChange={e => setAchievement(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>연관 태그 선택 및 추가:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {availableTags.map(tag => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleTagToggle(tag.name)}
                                style={{
                                    padding: '6px 15px', borderRadius: '20px', border: '1px solid #2196F3', cursor: 'pointer',
                                    backgroundColor: selectedTags.includes(tag.name) ? '#2196F3' : 'white',
                                    color: selectedTags.includes(tag.name) ? 'white' : '#2196F3',
                                    transition: 'all 0.2s'
                                }}
                            >
                                # {tag.name}
                            </button>
                        ))}
                        {/* 직접 추가한 태그 중 availableTags에 없는 태그들 표시 */}
                        {selectedTags.filter(name => !availableTags.some(t => t.name === name)).map(name => (
                             <button
                                key={name}
                                type="button"
                                onClick={() => handleTagToggle(name)}
                                style={{
                                    padding: '6px 15px', borderRadius: '20px', border: '1px solid #4CAF50', cursor: 'pointer',
                                    backgroundColor: '#4CAF50', color: 'white', border: '1px solid #4CAF50'
                                }}
                            >
                                # {name}
                            </button>
                        ))}
                    </div>
                    <input
                        style={{ width: '100%', padding: '10px', border: '1px dashed #aaa', borderRadius: '8px' }}
                        placeholder="원하는 태그가 없나요? 직접 입력 후 Enter를 눌러보세요!"
                        value={customTag}
                        onChange={e => setCustomTag(e.target.value)}
                        onKeyDown={handleAddCustomTag}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    나의 경험 저장하기
                </button>
            </form>
        </div>
    );
};

export default ExperienceAdd;
