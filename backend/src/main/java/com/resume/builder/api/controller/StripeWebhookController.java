package com.resume.builder.api.controller;

import com.resume.builder.api.entity.Payment;
import com.resume.builder.api.entity.User;
import com.resume.builder.api.enums.SubscriptionPlan;
import com.resume.builder.api.repository.PaymentRepository;
import com.resume.builder.api.repository.UserRepository;
import com.resume.builder.api.service.PaymentService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payment")
@Transactional
@RequiredArgsConstructor
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {

            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            if ("checkout.session.completed".equals(event.getType())) {

                Session session = (Session) event.getData().getObject();

                System.out.println("Webhook session ID: " + session.getId());

                String userEmail = session.getCustomerEmail();

                if (userEmail == null && session.getMetadata() != null) {
                    userEmail = session.getMetadata().get("userEmail");
                }

                System.out.println("User Email: " + userEmail);

                if (userEmail == null) {
                    return ResponseEntity.ok("Email missing");
                }

                User user = userRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                user.setSubscriptionPlan(SubscriptionPlan.PREMIUM);
                userRepository.save(user);

                Payment payment = Payment.builder()
                        .userEmail(userEmail)
                        .stripeSessionId(session.getId())
                        .amount(session.getAmountTotal() / 100.0)
                        .currency(session.getCurrency())
                        .status("SUCCESS")
                        .createdAt(LocalDateTime.now())
                        .build();

                paymentRepository.save(payment);

                System.out.println("🔥 User upgraded to PREMIUM");
            }
            return ResponseEntity.ok("Success");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Webhook error");
        }
    }}