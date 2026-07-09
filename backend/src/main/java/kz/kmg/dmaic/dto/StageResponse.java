package kz.kmg.dmaic.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record StageResponse(
        Long id,
        String stage,
        Map<String, Object> content,
        String status,
        Integer adminScore,
        String adminComment,
        LocalDate deadline,
        LocalDateTime submittedAt,
        LocalDateTime reviewedAt,
        int barrels,
        List<StageFileDto> files,
        Long ownerId,
        String ownerFullName
) {}

