package com.resume.builder.api.repository;

import com.resume.builder.api.entity.Resume;
import com.resume.builder.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    // Get all resumes of a user
    List<Resume> findByUser(User user);

    // Count resumes of a user (for BASIC restriction)
    long countByUser(User user);

    // Get resume by ID + User (secure access)
    Optional<Resume> findByIdAndUser(Long id, User user);

}