package com.example.backend.service;

import com.example.backend.domain.Member;
import com.example.backend.dto.request.SigninRequest;
import com.example.backend.dto.request.SignupRequest;
import com.example.backend.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    // 나중에 Security 설정 후 BCryptPasswordEncoder를 주입받아 비밀번호를 암호화해야 합니다.

    public Long join(SignupRequest dto) {
        validateDuplicateMember(dto.getEmail());

        Member member = Member.builder()
                .email(dto.getEmail())
                .password(dto.getPassword()) // 우선 평문으로 저장 (나중에 암호화 추가)
                .name(dto.getName())
                .build();

        return memberRepository.save(member).getId();
    }

    public String login(SigninRequest dto) {

        Optional<Member> loginMember
                = memberRepository.findByEmailAndPassword(dto.getEmail(), dto.getPassword());

        if(loginMember != null) {
            return "Login_Success";
        }
        return "Login_Failed";
    }

    private void validateDuplicateMember(String email) {
        memberRepository.findByEmail(email)
                .ifPresent(m -> {
                    throw new IllegalStateException("이미 존재하는 회원입니다.");
                });
    }
}
