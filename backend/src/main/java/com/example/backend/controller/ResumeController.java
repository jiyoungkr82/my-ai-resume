package com.example.backend.controller;

import com.example.backend.domain.Member;
import com.example.backend.dto.request.ResumeRequest;
import com.example.backend.repository.MemberRepository;
import com.example.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;
    private final MemberRepository memberRepository;

    @PostMapping("/generate")
    public ResponseEntity<String> generateResume(@AuthenticationPrincipal String email,
                                                 @RequestBody ResumeRequest request)
    {
        System.out.println("email: "+email);
        // 1. DB에서 이메일로 사용자 ID 찾기
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        String result = resumeService.generateWithTags(member.getId(), request);
        return ResponseEntity.ok(result);
    }
}
