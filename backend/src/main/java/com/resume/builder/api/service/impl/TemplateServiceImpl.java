package com.resume.builder.api.service.impl;

import com.resume.builder.api.entity.Template;
import com.resume.builder.api.repository.TemplateRepository;
import com.resume.builder.api.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {

    private final TemplateRepository templateRepository;

    @Override
    public Template createTemplate(Template template) {
        template.setCreatedAt(LocalDateTime.now());
        return templateRepository.save(template);
    }

    @Override
    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    @Override
    public Template getTemplateById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
    }
}
