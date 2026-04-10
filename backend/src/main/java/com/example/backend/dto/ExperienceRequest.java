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
    private List<Long> tagIds; // 사용자가 선택한 태그의 ID 리스트 (예: [1, 2, 5])
}
