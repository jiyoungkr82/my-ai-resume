package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ResumeItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @Column(columnDefinition = "TEXT")
    private String question;   // 사용자 지정 문항 내용

    @Column(columnDefinition = "TEXT")
    private String content;    // AI 답변 내용

    @Builder
    public ResumeItem(String question, String content) {
        this.question = question;
        this.content = content;
    }

    // setter는 필요한 경우만 최소한으로 생성 (연관관계용)
    protected void setResume(Resume resume) { this.resume = resume; }
}

