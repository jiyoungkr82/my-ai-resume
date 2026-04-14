package com.example.backend.controller;

import com.example.backend.dto.request.ResumeRequest;
import com.example.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateResume(@RequestBody ResumeRequest request) {
        String result = resumeService.generateWithTags(request.getMemberId(), request);
        return ResponseEntity.ok(result);
    }
}
