package com.example.backend.controller;

import com.example.backend.domain.Experience;
import com.example.backend.dto.request.ExperienceRequest;
import com.example.backend.dto.response.ExperienceResponse;
import com.example.backend.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExperienceController {
    private final ExperienceService experienceService;

    @PostMapping("/experiences")
    public ResponseEntity<String> setExperience(@RequestBody ExperienceRequest request) {
        experienceService.saveExperience(request);
        return ResponseEntity.ok("등록이 완료되었습니다.");
    }

    @GetMapping("/experiences")
    public ResponseEntity<List<ExperienceResponse>> getExperiences(@RequestParam Long memberId) {
        List<ExperienceResponse> experiences = experienceService.getExperiences(memberId);
        return ResponseEntity.ok(experiences);
    }
}
