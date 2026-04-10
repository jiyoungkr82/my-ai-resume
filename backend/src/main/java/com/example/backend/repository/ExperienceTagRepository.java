package com.example.backend.repository;

import com.example.backend.domain.ExperienceTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperienceTagRepository extends JpaRepository<ExperienceTag, Long> {
}
