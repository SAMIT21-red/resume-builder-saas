package com.resume.builder.api.repository;

import com.resume.builder.api.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplateRepository extends JpaRepository<Template,Long> {
}
