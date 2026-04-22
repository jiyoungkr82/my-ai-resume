package com.example.backend.controller;

import com.example.backend.domain.Member;
import com.example.backend.dto.request.ExperienceRequest;
import com.example.backend.dto.response.ExperienceResponse;
import com.example.backend.repository.MemberRepository;
import com.example.backend.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExperienceController {
    private final ExperienceService experienceService;
    private final MemberRepository memberRepository;

    @PostMapping("/experiences")
    public ResponseEntity<String> setExperience(@AuthenticationPrincipal String email,
                                                @RequestBody ExperienceRequest dto
    ) {
        // 1. DB에서 이메일로 사용자 ID 찾기
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 2. DTO에 담겨온 memberId 무시하고, '진짜' member.getId()를 사용
        experienceService.saveExperience(member.getId(), dto);

        return ResponseEntity.ok("성공");
    }

    @GetMapping("/experiences")
    public ResponseEntity<List<ExperienceResponse>> getExperiences(@AuthenticationPrincipal String email) {
        // 1. 토큰의 주인공이 누구인지 확인
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 2. 그 사용자의 ID로만 조회 (보안 격리 완료)
        List<ExperienceResponse> experiences = experienceService.getExperiences(member.getId());

        return ResponseEntity.ok(experiences);
    }
}
