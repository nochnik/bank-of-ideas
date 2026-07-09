package kz.kmg.dmaic.dto;

import java.time.LocalDateTime;
import java.util.List;

public record AdminDashboardResponse(
        int totalParticipants,
        int totalStagesSubmitted,
        int totalStagesApproved,
        int totalStagesRejected,
        int totalStagesDraft,
        List<ParticipantProgress> participants
) {
    public record ParticipantProgress(
            Long userId,
            String fullName,
            String position,
            String avatarUrl,
            List<StageProgressItem> stages,
            int totalBarrels
    ) {}

    public record StageProgressItem(
            String stage,
            String status,
            Integer score,
            LocalDateTime submittedAt
    ) {}
}
