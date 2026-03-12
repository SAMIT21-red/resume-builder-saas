package com.resume.builder.api.controller;

import com.resume.builder.api.repository.UserRepository;
import com.resume.builder.api.service.PaymentService;
import com.resume.builder.api.service.impl.EmailServiceImpl;
import com.resume.builder.api.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import com.resume.builder.api.entity.User;
import com.resume.builder.api.enums.SubscriptionPlan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final  EmailServiceImpl emailService;

    @PostMapping("/create-checkout")
    public ResponseEntity<String> createCheckout() {

        String email = SecurityUtil.getCurrentUserEmail();

        String checkoutUrl = paymentService.createCheckoutSession(email);

        return ResponseEntity.ok(checkoutUrl);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestParam String sessionId) {

        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setSubscriptionPlan(SubscriptionPlan.PREMIUM);
        userRepository.save(user);

        return ResponseEntity.ok("Subscription upgraded to PREMIUM");
    }

    @GetMapping("/success")
    public String success() {
        return "Payment Successful!";
    }

    @GetMapping("/cancel")
    public String cancel() {
        return "Payment Cancelled!";
    }

    // ⭐ ADD THIS METHOD
    @PostMapping("/send-attachment")
    public ResponseEntity<String> sendAttachment(
            @RequestParam String to,
            @RequestParam("file") MultipartFile file
    ) throws IOException {


        emailService.sendEmailWithAttachment(
                to,
                "Your Resume",
                "<h3>Your resume is attached.</h3>",
                file.getBytes(),
                "Resume.pdf"
        );

        return ResponseEntity.ok("Email sent successfully");
    }
}