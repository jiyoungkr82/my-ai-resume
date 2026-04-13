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
public class Resume {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    private String title; // 예: "삼성전자 백엔드 지원서"
    private String companyName;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeItem> items = new ArrayList<>();

    @Builder
    public Resume(Member member, String title, String companyName, List<ResumeItem> items) {
        this.member = member;
        this.title = title;
        this.companyName = companyName;
        this.items = items;
    }

    // 비즈니스 로직용 편의 메소드
    public void addItem(ResumeItem item) {
        this.items.add(item);
        item.setResume(this);
    }
}