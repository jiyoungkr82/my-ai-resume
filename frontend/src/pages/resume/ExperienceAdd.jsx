import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExperienceAdd = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [achievement, setAchievement] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    // 1. 초기 로딩 시 태그 리스트 가져오기
    useEffect(() => {
        axios.get('http://localhost:8080/api/tags')
            .then(res => setAvailableTags(res.data))
            .catch(err => console.error("태그 로드 실패", err));
    }, []);

    const handleTagToggle = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            memberId: 1, // 테스트용 하드코딩
            title,
            content,
            achievement,
            tagIds: selectedTags
        };

        try {
            await axios.post('http://localhost:8080/api/experiences', payload);
            alert("경험이 성공적으로 등록되었습니다!");
            // 등록 후 초기화 로직...
        } catch (err) {
            alert("등록 실패");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Step 1. 나의 경험 등록하기</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="프로젝트/경험 제목" value={title} onChange={e => setTitle(e.target.value)} style={{width:'100%', marginBottom:'10px'}} />
                <textarea placeholder="구체적인 수행 내용" value={content} onChange={e => setContent(e.target.value)} style={{width:'100%', height:'100px', marginBottom:'10px'}} />
                <textarea placeholder="핵심 성과 (AI가 강조할 부분)" value={achievement} onChange={e => setAchievement(e.target.value)} style={{width:'100%', height:'100px', marginBottom:'10px'}} />

                <div>
                    <p>연관 태그 선택:</p>
                    {availableTags.map(tag => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagToggle(tag.id)}
                            style={{
                                margin: '2px',
                                backgroundColor: selectedTags.includes(tag.id) ? '#4CAF50' : '#ddd',
                                color: selectedTags.includes(tag.id) ? 'white' : 'black'
                            }}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
                <button type="submit" style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#2196F3', color: 'white' }}>
                    경험 데이터 저장
                </button>
            </form>
        </div>
    );
};

export default ExperienceAdd;
