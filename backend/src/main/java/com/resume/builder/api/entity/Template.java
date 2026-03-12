package com.resume.builder.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Modern, Classic, Minimal
    private String theme;       // light, dark
    private String previewImage;

    @ElementCollection
    private List<String> colorPalette;

    @Lob
    private String layoutConfig;  // JSON config for layout

    private LocalDateTime createdAt;
    private boolean premium;

}
