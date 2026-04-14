package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ExperienceResponse {
    private Long id;
    private String title;
    private String content;
    private String achievement;
    private List<String> tags;
}
