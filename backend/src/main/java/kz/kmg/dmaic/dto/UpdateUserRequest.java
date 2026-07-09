package kz.kmg.dmaic.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank String fullName,
        String position
) {}
