package kz.kmg.dmaic.dto;

public record AuthResponse(String token, String role, Long userId) {}
