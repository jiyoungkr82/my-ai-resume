package com.example.backend.service;

import com.example.backend.domain.Experience;
import com.example.backend.dto.ResumeRequest;
import com.example.backend.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    @Value("${service.prompt.resume-gen}")
    private String resumePromptTemplate;
    private final ChatModel chatModel;
    private final ExperienceRepository experienceRepository;

    public String generateWithTags(Long memberId, ResumeRequest dto) {
        List<Experience> allExps = experienceRepository.findByMemberId(memberId);

        // 필터링된 컨텍스트 생성
        String filteredContext = allExps.stream()
                .filter(exp -> {
                    List<String> tagNames = exp.getExperienceTags().stream()
                            .map(et -> et.getTag().getName())
                            .toList();
                    return isTagMatched(tagNames, dto.getSelectedTags());
                })
                .map(exp -> String.format("[%s]\n내용: %s\n성과: %s",
                        exp.getTitle(), exp.getContent(), exp.getAchievement()))
                .collect(Collectors.joining("\n\n"));

        // 태그 리스트를 보기 좋게 문자열로 변환 (예: "Backend, Problem Solving")
        String selectedTagsStr = String.join(", ", dto.getSelectedTags());

        // 2. 최적화된 프롬프트 생성
        String finalPrompt = String.format(resumePromptTemplate,
                filteredContext,
                dto.getCompanyName(),
                dto.getQuestion(),
                selectedTagsStr); // 리스트 대신 문자열 주입

        return chatModel.call(finalPrompt);
    }


    private boolean isTagMatched(List<String> expTags, List<String> selectedTags) {
        if (expTags == null || selectedTags == null) return false;
        // 경험에 달린 태그 중 하나라도 사용자가 선택한 태그에 포함되면 pass
        return selectedTags.stream().anyMatch(expTags::contains);
    }
}
