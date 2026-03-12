package com.resume.builder.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableJpaAuditing
public class ResumeBuilderApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResumeBuilderApiApplication.class, args);
	}

}
