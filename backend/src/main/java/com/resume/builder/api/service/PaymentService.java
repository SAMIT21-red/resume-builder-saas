package com.resume.builder.api.service;

public interface PaymentService {
    String createCheckoutSession(String userEmail);

    void processStripeWebhook(String payload, String sigHeader);
}
