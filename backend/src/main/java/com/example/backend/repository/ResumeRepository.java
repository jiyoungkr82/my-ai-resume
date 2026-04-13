package com.example.backend.repository;

import com.example.backend.domain.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByMemberId(Long memberId);

    Optional<Resume> findByMemberIdAndCompanyName(Long memberId, String companyName);
}