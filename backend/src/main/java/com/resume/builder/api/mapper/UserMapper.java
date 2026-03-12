package com.resume.builder.api.mapper;

import com.resume.builder.api.dto.UserResponseDTO;
import com.resume.builder.api.entity.User;

public class UserMapper {

    public static UserResponseDTO toDto(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .subscriptionPlan(user.getSubscriptionPlan())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
