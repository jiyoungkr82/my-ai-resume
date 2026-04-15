package com.example.backend.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ResumeRequest {
    private Long memberId;
    private String companyName;
    private String question;
    private List<Long> selectedTagIds;
}
