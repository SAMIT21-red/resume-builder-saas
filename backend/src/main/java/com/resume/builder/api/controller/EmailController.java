package com.resume.builder.api.controller;

import com.resume.builder.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    // ✅ 1️⃣ Send Simple Email
    @PostMapping("/send")
    public ResponseEntity<String> sendSimpleEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body
    ) {

        emailService.sendEmail(to, subject, body);

        return ResponseEntity.ok("Email sent successfully");
    }

    // ✅ 2️⃣ Send Verification Email
    @PostMapping("/send-verification")
    public ResponseEntity<String> sendVerification(
            @RequestParam String to,
            @RequestParam String token
    ) {

        emailService.sendVerificationEmail(to, token);

        return ResponseEntity.ok("Verification email sent");
    }

    // ✅ 3️⃣ Send Attachment Email
    @PostMapping("/send-attachment")
    public ResponseEntity<String> sendAttachment(
            @RequestParam String to,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        emailService.sendEmailWithAttachment(
                to,
                "Your Resume is Ready",
                "<h3>Your resume is attached below.</h3>",
                file.getBytes(),
                "Resume.pdf"
        );

        return ResponseEntity.ok("Email sent successfully");
    }
}