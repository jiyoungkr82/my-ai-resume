package com.example.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ResumeRequest {
    private Long memberId;
    private String companyName;
    private String question;
    private List<String> selectedTags; // 예: ["Backend", "Problem Solving"]
}
