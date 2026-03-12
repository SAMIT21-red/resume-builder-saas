package com.resume.builder.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {

    private String token;
    private String name;
    private String email;
    private String profileImageUrl;
    private String subscriptionPlan;
}