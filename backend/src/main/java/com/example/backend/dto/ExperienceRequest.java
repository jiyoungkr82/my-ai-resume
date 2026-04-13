package com.example.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ExperienceRequest {
    private Long memberId;
    private String title;
    private String content;
    private String achievement;
    private List<String> tagNames; // ID 대신 이름(String) 리스트로 받음
}
