package kz.kmg.dmaic.dto;

public record LeaderboardEntry(
        Long userId,
        String fullName,
        String avatarUrl,
        String position,
        int totalBarrels,
        String reward
) {}
