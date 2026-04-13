package com.example.backend.service;

import com.example.backend.domain.Experience;
import com.example.backend.domain.Member;
import com.example.backend.domain.Tag;
import com.example.backend.dto.ExperienceRequest;
import com.example.backend.repository.ExperienceRepository;
import com.example.backend.repository.MemberRepository;
import com.example.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExperienceService {
    private final ExperienceRepository experienceRepository;
    private final TagRepository tagRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void saveExperience(ExperienceRequest dto) {
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        // 1. 경험 본체 저장
        Experience experience = Experience.builder()
                .member(member)
                .title(dto.getTitle())
                .content(dto.getContent())
                .achievement(dto.getAchievement())
                .build();
        experienceRepository.save(experience);

        // 2. 태그 처리 (이름 기반으로 조회 및 생성)
        if (dto.getTagNames() != null) {
            for (String name : dto.getTagNames()) {
                // 이미 존재하면 가져오고, 없으면 새로 생성
                Tag tag = tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(new Tag(name)));

                // 연관관계 편의 메소드 활용
                experience.addExperienceTag(tag);
            }
        }

        // 3. CascadeType.ALL에 의해 ExperienceTag도 같이 저장됨
        experienceRepository.save(experience);
    }
}

