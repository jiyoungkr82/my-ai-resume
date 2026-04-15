package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
public class ExperienceResponse {
    private Long id;
    private String title;
    private String content;
    private String achievement;
    private String summary;
    private List<String> tags;

//    public ExperienceResponse(Long id, String title, String content, String achievement, String summary, List<String> list) {
//    }

    public static String createSummary(String content) {
        if (content == null || content.length() <= 50) return content;
        return content.substring(0, 50) + "...";
    }
}
