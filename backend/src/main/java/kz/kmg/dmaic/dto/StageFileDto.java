package kz.kmg.dmaic.dto;

import java.time.LocalDateTime;

public record StageFileDto(
        Long id,
        String fileName,
        String fileUrl,
        Long fileSize,
        String contentType,
        LocalDateTime uploadedAt
) {}
