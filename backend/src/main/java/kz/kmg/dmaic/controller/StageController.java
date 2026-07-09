package kz.kmg.dmaic.controller;

import kz.kmg.dmaic.dto.StageContentRequest;
import kz.kmg.dmaic.dto.StageFileDto;
import kz.kmg.dmaic.dto.StageResponse;
import kz.kmg.dmaic.entity.DmaicStage;
import kz.kmg.dmaic.entity.Stage;
import kz.kmg.dmaic.entity.StageFile;
import kz.kmg.dmaic.entity.StageStatus;
import kz.kmg.dmaic.repository.StageFileRepository;
import kz.kmg.dmaic.service.StageService;
import kz.kmg.dmaic.service.StorageService;
import kz.kmg.dmaic.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
@RequiredArgsConstructor
public class StageController {

    private final StageService stageService;
    private final UserService userService;
    private final StorageService storageService;
    private final StageFileRepository stageFileRepository;

    @GetMapping("/my")
    public ResponseEntity<List<StageResponse>> getMyStages(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(stageService.getMyStages(resolveUserId(ud)));
    }

    @PutMapping("/{stage}")
    public ResponseEntity<StageResponse> saveContent(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Stage stage,
            @RequestBody StageContentRequest request) {
        return ResponseEntity.ok(stageService.saveContent(resolveUserId(ud), stage, request));
    }

    @PostMapping("/{stage}/submit")
    public ResponseEntity<StageResponse> submit(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Stage stage) {
        return ResponseEntity.ok(stageService.submitForReview(resolveUserId(ud), stage));
    }

    @PostMapping("/{stage}/files")
    public ResponseEntity<StageFileDto> uploadFile(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Stage stage,
            @RequestParam("file") MultipartFile file) {
        Long userId = resolveUserId(ud);
        DmaicStage dmaicStage = stageService.getOrCreateDmaicStage(userId, stage);

        if (dmaicStage.getStatus() == StageStatus.APPROVED || dmaicStage.getStatus() == StageStatus.SUBMITTED) {
            throw new IllegalStateException("Cannot upload files to a submitted or approved stage");
        }

        // Limit: max 5 files per stage
        if (dmaicStage.getFiles().size() >= 5) {
            throw new IllegalStateException("Maximum 5 files per stage");
        }

        String fileUrl = storageService.uploadStageFile(dmaicStage.getId(), file);

        StageFile stageFile = StageFile.builder()
                .dmaicStage(dmaicStage)
                .fileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file")
                .fileUrl(fileUrl)
                .fileSize(file.getSize())
                .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                .build();
        stageFile = stageFileRepository.save(stageFile);

        return ResponseEntity.ok(new StageFileDto(
                stageFile.getId(),
                stageFile.getFileName(),
                stageFile.getFileUrl(),
                stageFile.getFileSize(),
                stageFile.getContentType(),
                stageFile.getUploadedAt()
        ));
    }

    @DeleteMapping("/{stage}/files/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Stage stage,
            @PathVariable Long fileId) {
        Long userId = resolveUserId(ud);
        DmaicStage dmaicStage = stageService.getOrCreateDmaicStage(userId, stage);

        StageFile stageFile = stageFileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found: " + fileId));

        if (!stageFile.getDmaicStage().getId().equals(dmaicStage.getId())) {
            throw new IllegalArgumentException("File does not belong to this stage");
        }

        if (dmaicStage.getStatus() == StageStatus.APPROVED || dmaicStage.getStatus() == StageStatus.SUBMITTED) {
            throw new IllegalStateException("Cannot delete files from a submitted or approved stage");
        }

        storageService.deleteFile(stageFile.getFileUrl());
        stageFileRepository.delete(stageFile);
        return ResponseEntity.noContent().build();
    }

    private Long resolveUserId(UserDetails ud) {
        return userService.findIdByUsername(ud.getUsername());
    }
}
