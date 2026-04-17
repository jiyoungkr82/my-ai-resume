package com.example.backend.service;

import com.example.backend.domain.Member;
import com.example.backend.domain.Role;
import com.example.backend.dto.request.SigninRequest;
import com.example.backend.dto.request.SignupRequest;
import com.example.backend.repository.MemberRepository;
import com.example.backend.service.auth.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public Long join(SignupRequest dto) {
        validateDuplicateMember(dto.getEmail());

        Member member = Member.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword())) // 우선 평문으로 저장 (나중에 암호화 추가)
                .name(dto.getName())
                .role(Role.USER)
                .build();

        return memberRepository.save(member).getId();
    }

//    public String login(SigninRequest dto) {
//
//        Optional<Member> loginMember
//                = memberRepository.findByEmailAndPassword(dto.getEmail(), dto.getPassword());
//
//        if(loginMember != null) {
//            return "Login_Success";
//        }
//        return "Login_Failed";
//    }

    public String login(SigninRequest dto) {
        Member member = memberRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 시 JWT 반환
        return jwtTokenProvider.createToken(member.getEmail(), member.getRole().getValue());
    }

    private void validateDuplicateMember(String email) {
        memberRepository.findByEmail(email)
                .ifPresent(m -> {
                    throw new IllegalStateException("이미 존재하는 회원입니다.");
                });
    }
}
