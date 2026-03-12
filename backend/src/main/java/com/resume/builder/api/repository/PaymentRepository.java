package com.resume.builder.api.repository;

import com.resume.builder.api.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment,Long> {

    List<Payment> findByUserEmail(String email);

    Optional<Payment> findByStripeSessionId(String sessionId);
}
