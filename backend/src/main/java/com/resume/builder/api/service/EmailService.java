package com.resume.builder.api.service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String token);

    void sendEmailWithAttachment(String toEmail,
                                 String subject,
                                 String body,
                                 byte[] fileData,
                                 String fileName);

    void sendEmail(String to, String subject, String body);
}
