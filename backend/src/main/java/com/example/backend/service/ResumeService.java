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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional // DB 쓰기 작업이 있으므로 추가 권장
    public String generateWithTags(Long memberId, ResumeRequest dto) {
        // 1. DB에서 선택한 태그 ID를 가진 경험들만 fetch join으로 가져옴
        List<Experience> matchedExps = experienceRepository.findAllByMemberIdAndTagIds(memberId, dto.getSelectedTagIds());

        if (matchedExps.isEmpty()) {
            throw new RuntimeException("선택한 태그에 해당하는 경험 데이터가 없습니다.");
        }

        // 2. 필터링된 컨텍스트 생성 (이미 DB에서 필터링되었으므로 filter 로직 삭제)
        String filteredContext = matchedExps.stream()
                .map(exp -> String.format("[%s]\n내용: %s\n성과: %s",
                        exp.getTitle(), exp.getContent(), exp.getAchievement()))
                .collect(Collectors.joining("\n\n"));

        // 3. 프롬프트에 주입할 태그 이름들 추출 (ID가 아닌 이름으로 AI에게 전달)
        String selectedTagsStr = matchedExps.stream()
                .flatMap(exp -> exp.getExperienceTags().stream())
                .map(et -> et.getTag().getName())
                .distinct()
                .collect(Collectors.joining(", "));

        // 4. 최종 프롬프트 생성 및 AI 호출
        String finalPrompt = String.format(resumePromptTemplate,
                filteredContext,
                dto.getCompanyName(),
                dto.getQuestion(),
                selectedTagsStr);

        String aiResult = chatModel.call(finalPrompt);

        // 5. 기존 Resume 조회 또는 신규 생성
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

        // 6. ResumeItem 추가 및 연관관계 설정
        ResumeItem newItem = ResumeItem.builder()
                .question(dto.getQuestion())
                .content(aiResult)
                .build();
        resume.addItem(newItem);

        // 7. 저장 (Cascade 설정에 의해 Item 함께 저장)
        resumeRepository.save(resume);

        return aiResult;
    }

}

