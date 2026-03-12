package com.resume.builder.api.controller;

import com.resume.builder.api.dto.LoginRequestDTO;
import com.resume.builder.api.dto.UserRegisterRequestDTO;
import com.resume.builder.api.dto.UserResponseDTO;
import com.resume.builder.api.security.JwtUtil;
import com.resume.builder.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.resume.builder.api.service.ImageUploadService;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.Authenticator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static com.resume.builder.api.util.ApiEndpoints.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(AUTH_BASE)
public class AuthController {

    private final UserService userService;
    private final ImageUploadService imageUploadService;
    private final AuthenticationManager authenticationManager; // 👈 ADD THIS
    private final JwtUtil jwtUtil;



    @PostMapping(REGISTER)
    public ResponseEntity<UserResponseDTO> registerUser(
            @Valid @RequestBody UserRegisterRequestDTO request) {

        UserResponseDTO response = userService.registerUser(request);
        log.info("Response from service :{}" , response);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(VERIFY_EMAIL)
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully");
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(
            @RequestParam("file") MultipartFile file) {

        String imageUrl = imageUploadService.uploadProfileImage(file);
        return ResponseEntity.ok(imageUrl);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequestDTO request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtUtil.generateToken(request.getEmail());

        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestParam String email) {

        userService.resendVerificationEmail(email);
        return ResponseEntity.ok("Verification email sent");
    }



}
