package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    private String title;

    // 핵심 변경 사항: AI가 검색할 키워드 (예: "Backend", "Communication", "Problem Solving")
    // 변경: 하나의 경험은 여러 개의 매핑 데이터를 가집니다.
    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL)
    private List<ExperienceTag> experienceTags = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String content; // 구체적인 경험 내용

    @Column(columnDefinition = "TEXT")
    private String achievement; // 성과

    @Builder
    public Experience(Member member, String title, String content, String achievement) {
        this.member = member;
        this.title = title;
        this.content = content;
        this.achievement = achievement;
    }
}
