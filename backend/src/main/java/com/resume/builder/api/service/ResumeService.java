package com.resume.builder.api.service;

import com.resume.builder.api.dto.ResumeRequestDTO;
import com.resume.builder.api.dto.ResumeResponseDTO;
import com.resume.builder.api.util.SubscriptionUtil;
import org.jspecify.annotations.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {

    ResumeResponseDTO createResume(ResumeRequestDTO request);

    List<ResumeResponseDTO> getMyResumes();

    ResumeResponseDTO getResumeById(Long id);

    void deleteResume(Long id);
    ResumeResponseDTO updateResume(Long id, ResumeRequestDTO request);

    String uploadResumeImage(Long resumeId, MultipartFile file);



}
