package com.example.backend.controller;

import com.example.backend.dto.ExperienceRequest;
import com.example.backend.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
