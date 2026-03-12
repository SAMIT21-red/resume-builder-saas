package com.resume.builder.api.util;

public final class ApiEndpoints {

    private ApiEndpoints() {
        // prevent instantiation
    }

    // Base paths
    public static final String API_BASE = "/api";
    public static final String AUTH_BASE = API_BASE + "/auth";
    public static final String USER_BASE = API_BASE + "/users";
    public static final String RESUME_BASE = API_BASE + "/resumes";

    // Auth endpoints
    public static final String REGISTER = "/register";
    public static final String VERIFY_EMAIL = "/verify";
    public static final String LOGIN = "/login";

    // User endpoints
    public static final String PROFILE = "/profile";

    // Resume endpoints
    public static final String CREATE_RESUME = "/create";
    public static final String UPDATE_RESUME = "/update/{id}";
    public static final String GET_RESUME = "/{id}";
    public static final String DELETE_RESUME = "/delete/{id}";
}
