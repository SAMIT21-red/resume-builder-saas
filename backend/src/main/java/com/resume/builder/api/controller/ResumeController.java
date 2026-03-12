package com.resume.builder.api.controller;

import com.resume.builder.api.dto.ResumeRequestDTO;
import com.resume.builder.api.dto.ResumeResponseDTO;
import com.resume.builder.api.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // ✅ Create Resume
    @PostMapping
    public ResponseEntity<ResumeResponseDTO> createResume(@RequestBody ResumeRequestDTO request) {

        return ResponseEntity.ok(resumeService.createResume(request));
    }

    // ✅ Get All My Resumes
    @GetMapping
    public ResponseEntity<List<ResumeResponseDTO>> getMyResumes() {

        return ResponseEntity.ok(resumeService.getMyResumes());
    }

    // ✅ Get Resume By ID
    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponseDTO> getResumeById(@PathVariable Long id) {

        return ResponseEntity.ok(resumeService.getResumeById(id));
    }

    // ✅ Delete Resume
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(
            @PathVariable Long id) {

        resumeService.deleteResume(id);
        return ResponseEntity.ok("Resume deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeResponseDTO> updateResume(
            @PathVariable Long id,
            @RequestBody ResumeRequestDTO request) {

        return ResponseEntity.ok(
                resumeService.updateResume(id, request)
        );
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<String> uploadResumeImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                resumeService.uploadResumeImage(id, file)
        );
    }

}
