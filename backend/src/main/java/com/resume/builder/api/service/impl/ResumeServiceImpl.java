package com.resume.builder.api.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.builder.api.dto.ResumeRequestDTO;
import com.resume.builder.api.dto.ResumeResponseDTO;
import com.resume.builder.api.entity.Resume;
import com.resume.builder.api.entity.Template;
import com.resume.builder.api.entity.User;
import com.resume.builder.api.repository.ResumeRepository;
import com.resume.builder.api.repository.TemplateRepository;
import com.resume.builder.api.repository.UserRepository;
import com.resume.builder.api.service.ResumeService;
import com.resume.builder.api.util.SecurityUtil;
import com.resume.builder.api.util.SubscriptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {
    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;        // ✅ ADD
    private final TemplateRepository templateRepository;
    private final ImageUploadServiceImpl imageUploadService;


    @Override
    public ResumeResponseDTO createResume(ResumeRequestDTO request) {
        log.info("Template ID from request: {}", request.getTemplateId());

        try {

            // 1️⃣ Get logged-in user email from JWT
            String userEmail = SecurityUtil.getCurrentUserEmail();

            // 2️⃣ Fetch user from DB
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 3️⃣ BASIC Plan Restriction → Allow only 1 resume
            if (SubscriptionUtil.isBasic(user)) {

                long resumeCount = resumeRepository.countByUser(user);
                log.info("Resume count for {} = {}", userEmail, resumeCount);


                if (resumeCount >= 1) {
                    throw new RuntimeException("Upgrade to Premium to create multiple resumes");
                }
            }

            // 4️⃣ Validate Template Access
            Template template = templateRepository.findById(request.getTemplateId())
                    .orElseThrow(() -> new RuntimeException("Template not found"));

            if (template.isPremium() && SubscriptionUtil.isBasic(user)) {
                throw new RuntimeException("Upgrade to access this premium template");
            }

            // 5️⃣ Convert full request DTO into JSON string
            String resumeJson = objectMapper.writeValueAsString(request);



            Resume resume = Resume.builder()
                    .title(request.getTitle())
                    .thumbNailLink(request.getThumbNailLink())
                    .template(template)
                    .user(user)
                    .resumeData(objectMapper.writeValueAsString(request))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // 7️⃣ Save to database
            Resume savedResume = resumeRepository.save(resume);

            // 8️⃣ Convert back to response DTO
            return mapToResponse(savedResume);

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Upgrade to Premium to create multiple resumes"
            );
        }
    }

    // ✅ Get All My Resumes
    @Override
    public List<ResumeResponseDTO> getMyResumes() {

        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return resumeRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ✅ Get Resume By ID (SECURE)
    @Override
    public ResumeResponseDTO getResumeById(Long id) {

        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        return mapToResponse(resume);
    }

    // ✅ Delete Resume
    @Override
    public void deleteResume(Long id) {

        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        resumeRepository.delete(resume);
    }

    @Override
    public ResumeResponseDTO updateResume(Long id, ResumeRequestDTO request) {

        try {

            String email = SecurityUtil.getCurrentUserEmail();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Resume resume = resumeRepository.findByIdAndUser(id, user)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            // 🔥 Save resume JSON
            String json = objectMapper.writeValueAsString(request);

            resume.setResumeData(json);
            resume.setTitle(request.getTitle());
            resume.setThumbNailLink(request.getThumbNailLink());
            resume.setUpdatedAt(LocalDateTime.now());

            // 🔥 Update template
            if (request.getTemplateId() != null) {

                Template template = templateRepository.findById(request.getTemplateId())
                        .orElseThrow(() -> new RuntimeException("Template not found"));

                resume.setTemplate(template);
            }

            Resume saved = resumeRepository.save(resume);

            return mapToResponse(saved);

        } catch (Exception e) {

            log.error("Resume update failed", e);
            throw new RuntimeException("Failed to update resume");

        }
    }


    @Override
    public String uploadResumeImage(Long resumeId, MultipartFile file) {

        try {

            String email = SecurityUtil.getCurrentUserEmail();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Resume resume = resumeRepository.findByIdAndUser(resumeId, user)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            // Upload to Cloudinary
            String imageUrl = imageUploadService.uploadProfileImage(file);

            return imageUrl;

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image");
        }
    }




    // 🔁 JSON → DTO Conversion
    private ResumeResponseDTO mapToResponse(Resume resume) {

        try {
            ResumeRequestDTO resumeDTO =
                    objectMapper.readValue(resume.getResumeData(), ResumeRequestDTO.class);

            return ResumeResponseDTO.builder()
                    .id(resume.getId())
                    .title(resume.getTitle())
                    .thumbNailLink(resume.getThumbNailLink())
                    .resumeData(resumeDTO)
                    .templateId(resume.getTemplate().getId())
                    .createdAt(resume.getCreatedAt())
                    .updatedAt(resume.getUpdatedAt())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse resume data");
        }
    }
}
