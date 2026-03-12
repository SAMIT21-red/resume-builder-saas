package com.resume.builder.api.controller;

import com.resume.builder.api.dto.UserProfileResponseDTO;
import com.resume.builder.api.dto.UserResponseDTO;
import com.resume.builder.api.entity.User;
import com.resume.builder.api.mapper.UserMapper;
import com.resume.builder.api.repository.UserRepository;
import com.resume.builder.api.service.UserService;
import com.resume.builder.api.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;


    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> getProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }


}
