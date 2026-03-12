package com.resume.builder.api.service;

import com.resume.builder.api.entity.Template;
import org.springframework.stereotype.Service;

import java.util.List;

public interface TemplateService {

    Template createTemplate(Template template);

    List<Template> getAllTemplates();

    Template getTemplateById(Long id);
}
