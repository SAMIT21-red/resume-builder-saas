package com.resume.builder.api.service;

import com.resume.builder.api.dto.UserProfileResponseDTO;
import com.resume.builder.api.dto.UserRegisterRequestDTO;
import com.resume.builder.api.dto.UserResponseDTO;

public interface UserService {

    UserResponseDTO registerUser(UserRegisterRequestDTO request);

    void verifyEmail(String token);
    UserProfileResponseDTO getCurrentUserProfile();

    void resendVerificationEmail(String email);
}
