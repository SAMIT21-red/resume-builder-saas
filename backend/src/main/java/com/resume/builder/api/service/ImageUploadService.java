package com.resume.builder.api.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageUploadService {
    String uploadProfileImage(MultipartFile file);
}
