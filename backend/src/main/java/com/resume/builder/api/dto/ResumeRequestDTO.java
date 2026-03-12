package com.resume.builder.api.dto;

import com.resume.builder.api.entity.Template;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeRequestDTO {

    private Long templateId;   // ✅ only ID

    private String title;
    private String thumbNailLink;

    private ProfileInfo profileInfo;
    private ContactInfo contactInfo;
    private List<WorkExperience> workExperience;
    private List<Education> education;
    private List<Skill> skills;
    private List<Project> projects;
    private List<Certification> certifications;
    private List<Language> languages;
    private List<String> interests;

//    public com.resume.builder.api.entity.Template getTemplate() {
//    }


    // ---------------- NESTED STRUCTURES ----------------

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Template {
        private String theme;
        private List<String> colorPalette;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProfileInfo {
        private String profilePreviewUrl;
        private String fullName;
        private String designation;
        private String summary;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ContactInfo {
        private String email;
        private String phone;
        private String location;
        private String linkedin;
        private String github;
        private String website;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkExperience {
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Education {
        private String degree;
        private String institution;
        private String startDate;
        private String endDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Skill {
        private String name;
        private Integer progress;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Project {
        private String title;
        private String description;
        private String github;
        private String livedemo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Certification {
        private String title;
        private String issuer;
        private String year;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Language {
        private String name;
        private String progress;
    }
}
