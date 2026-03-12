package com.resume.builder.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String profileImageUrl;
    private String subscriptionPlan;
    private boolean emailVerified;
}
