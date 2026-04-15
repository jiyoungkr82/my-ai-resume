package com.example.backend.repository;

import com.example.backend.domain.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience,Long> {
//    List<Experience> findByMemberId(Long memberId);
    // Fetch Join을 사용하여 Experience, ExperienceTag, Tag를 한 번에 조회 (N+1 예방)
//    @Query("select distinct e from Experience e " +
//            "join fetch e.experienceTags et " +
//            "join fetch et.tag " +
//            "where e.member.id = :memberId")

    // 태그 없는 데이터도 보여줘야 할 경우를 위해 left join fetch로 변경
    @Query("select distinct e from Experience e " +
            "left join fetch e.experienceTags et " +
            "left join fetch et.tag " +
            "where e.member.id = :memberId")
    List<Experience> findAllWithTagsByMemberId(@Param("memberId") Long memberId);

    @Query("select distinct e from Experience e " +
            "join fetch e.experienceTags et " +
            "join fetch et.tag t " +
            "where e.member.id = :memberId " +
            "and t.id in :tagIds") // 이름 대신 ID로 필터링
    List<Experience> findAllByMemberIdAndTagIds(@Param("memberId") Long memberId,
                                                @Param("tagIds") List<Long> tagIds);

}
