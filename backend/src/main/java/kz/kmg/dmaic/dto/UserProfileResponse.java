package kz.kmg.dmaic.dto;

public record UserProfileResponse(
        Long id,
        String username,
        String fullName,
        String position,
        String avatarUrl,
        String role
) {}
