package com.example.backend.service;

import com.example.backend.domain.Experience;
import com.example.backend.domain.ExperienceTag;
import com.example.backend.domain.Member;
import com.example.backend.domain.Tag;
import com.example.backend.dto.ExperienceRequest;
import com.example.backend.repository.ExperienceRepository;
import com.example.backend.repository.ExperienceTagRepository;
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
    private final ExperienceTagRepository experienceTagRepository;
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

        // 2. 태그 매핑 저장
        if (dto.getTagIds() != null) {
            dto.getTagIds().forEach(tagId -> {
                Tag tag = tagRepository.findById(tagId)
                        .orElseThrow(() -> new RuntimeException("태그 없음: " + tagId));
                experienceTagRepository.save(new ExperienceTag(experience, tag));
            });
        }
    }
}

