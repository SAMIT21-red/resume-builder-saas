package com.resume.builder.api.service.impl;

import com.resume.builder.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(String toEmail, String token) {

        log.info("Sending verification email to: {}", toEmail);

        String verificationLink =
                "http://localhost:8080/api/auth/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("dubeysamit2@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Verify your email - Resume Builder");
        message.setText(
                "Click the link below to verify your email:\n\n" +
                        verificationLink
        );

        mailSender.send(message);
    }

    // 🔥 NEW METHOD FOR ATTACHMENT
    @Override
    public void sendEmailWithAttachment(String toEmail,
                                        String subject,
                                        String body,
                                        byte[] fileData,
                                        String fileName) {

        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, true);

            helper.setFrom("dubeysamit2@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            ByteArrayResource resource =
                    new ByteArrayResource(fileData);

            helper.addAttachment(
                    fileName,
                    resource,
                    "application/pdf"
            );

            mailSender.send(mimeMessage);

            log.info("Email with attachment sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send attachment email", e);
            throw new RuntimeException("Email sending failed");
        }
    }


    @Override
    public void sendEmail(String to, String subject, String body) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("dubeysamit2@gmail.com");  // must be verified in Brevo
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info("Simple email sent to {}", to);

        } catch (Exception e) {
            log.error("Failed to send simple email", e);
            throw new RuntimeException("Email sending failed");
        }
    }
}