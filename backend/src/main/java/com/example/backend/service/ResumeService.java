package com.example.backend.service;

import com.example.backend.domain.Experience;
import com.example.backend.domain.Member;
import com.example.backend.domain.Resume;
import com.example.backend.domain.ResumeItem;
import com.example.backend.dto.request.ResumeRequest;
import com.example.backend.repository.ExperienceRepository;
import com.example.backend.repository.MemberRepository;
import com.example.backend.repository.ResumeRepository;
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
    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;

    public String generateWithTags(Long memberId, ResumeRequest dto) {
        // N+1 문제 해결을 위해 Fetch join 사용
        // List<Experience> allExps = experienceRepository.findByMemberId(memberId); // 기존
        List<Experience> allExps = experienceRepository.findAllWithTagsByMemberId(memberId); // 변경 후

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

        // 3. AI 호출
        String aiResult = chatModel.call(finalPrompt);

        // 2. [핵심] 기존 Resume가 있는지 확인 (회원 ID + 회사명 기준)
        // 리포지토리에 Optional<Resume> findByMemberIdAndCompanyName(Long memberId, String companyName) 필요
        Resume resume = resumeRepository.findByMemberIdAndCompanyName(memberId, dto.getCompanyName())
                .orElseGet(() -> {
                    Member member = memberRepository.findById(memberId)
                            .orElseThrow(() -> new RuntimeException("회원 없음"));
                    return resumeRepository.save(Resume.builder()
                            .member(member)
                            .companyName(dto.getCompanyName())
                            .title(dto.getCompanyName() + " 지원서")
                            .build());
                });

        // 3. 신규 문항(ResumeItem) 생성 및 추가
        ResumeItem newItem = ResumeItem.builder()
                .question(dto.getQuestion())
                .content(aiResult)
                .build();

        resume.addItem(newItem); // ResumeItem이 Resume를 참조하도록 연관관계 설정

        // 4. 저장 (CascadeType.ALL에 의해 ResumeItem도 자동 저장)
        resumeRepository.save(resume);

        return aiResult;
    }


    private boolean isTagMatched(List<String> expTags, List<String> selectedTags) {
        if (expTags == null || selectedTags == null) return false;
        // 경험에 달린 태그 중 하나라도 사용자가 선택한 태그에 포함되면 pass
        return selectedTags.stream().anyMatch(expTags::contains);
    }
}
