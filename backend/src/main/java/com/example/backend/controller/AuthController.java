package com.example.backend.controller;

import com.example.backend.dto.request.SigninRequest;
import com.example.backend.dto.request.SignupRequest;
import com.example.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.logging.Log;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        memberService.join(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SigninRequest request) {
        String token = memberService.login(request);
        log.info("token : {}", token);
        return ResponseEntity.ok(Map.of("token", token));
    }
}

