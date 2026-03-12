package com.resume.builder.api.service.impl;

import com.resume.builder.api.dto.UserProfileResponseDTO;
import com.resume.builder.api.dto.UserRegisterRequestDTO;
import com.resume.builder.api.dto.UserResponseDTO;
import com.resume.builder.api.entity.User;
import com.resume.builder.api.enums.SubscriptionPlan;
import com.resume.builder.api.exception.BadRequestException;
import com.resume.builder.api.mapper.UserMapper;
import com.resume.builder.api.repository.UserRepository;
import com.resume.builder.api.service.EmailService;
import com.resume.builder.api.util.SecurityUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.resume.builder.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public UserResponseDTO registerUser(UserRegisterRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .profileImageUrl(request.getProfileImageUrl())
                .subscriptionPlan(SubscriptionPlan.BASIC)
                .emailVerified(false)
                .verificationToken(UUID.randomUUID().toString())
                .verificationExpires(LocalDateTime.now().plusHours(24))
                .build();

        User savedUser = userRepository.save(user);

        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getVerificationToken()
        );

        return UserMapper.toDto(savedUser);
    }


    @Override
    public void verifyEmail(String token) {

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email already verified");
        }

        if (user.getVerificationExpires() == null ||
                user.getVerificationExpires().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token expired");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpires(null);

        userRepository.save(user);
    }

    @Override
    public void resendVerificationEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email already verified");
        }

        // generate new token
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationExpires(LocalDateTime.now().plusHours(24));

        User savedUser = userRepository.save(user);

        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getVerificationToken()
        );
    }
    @Override
    public UserProfileResponseDTO getCurrentUserProfile() {

        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return UserProfileResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .subscriptionPlan(user.getSubscriptionPlan().name())  // ✅ FIXED
                .emailVerified(user.isEmailVerified())
                .build();

    }

}


