package com.resume.builder.api.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponseDTO {

    private Long id;
    private String title;
    private String thumbNailLink;
    private ResumeRequestDTO resumeData;
    private Long templateId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
