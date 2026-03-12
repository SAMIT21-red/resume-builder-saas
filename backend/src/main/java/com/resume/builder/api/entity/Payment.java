package com.resume.builder.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // ✅ PRIMARY KEY (MANDATORY)

    private String userEmail;

    private String stripeSessionId;
    private String stripePaymentIntentId;

    private Double amount;
    private String currency;

    private String status; // SUCCESS, FAILED, PENDING

    private LocalDateTime createdAt;
}
