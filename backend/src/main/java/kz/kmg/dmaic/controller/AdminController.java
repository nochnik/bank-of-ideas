package kz.kmg.dmaic.controller;

import jakarta.validation.Valid;
import kz.kmg.dmaic.dto.*;
import kz.kmg.dmaic.service.StageService;
import kz.kmg.dmaic.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final StageService stageService;

    @PostMapping("/users")
    public ResponseEntity<UserProfileResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.createParticipant(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllParticipants());
    }

    @GetMapping("/stages/submitted")
    public ResponseEntity<List<StageResponse>> getSubmittedStages() {
        return ResponseEntity.ok(stageService.getSubmittedStages());
    }

    @GetMapping("/users/{userId}/stages")
    public ResponseEntity<List<StageResponse>> getUserStages(@PathVariable Long userId) {
        return ResponseEntity.ok(stageService.getUserStages(userId));
    }

    @PutMapping("/stages/{stageId}/review")
    public ResponseEntity<StageResponse> reviewStage(
            @PathVariable Long stageId,
            @Valid @RequestBody StageReviewRequest request) {
        return ResponseEntity.ok(stageService.reviewStage(stageId, request));
    }

    @PutMapping("/stages/{stageId}/reject")
    public ResponseEntity<StageResponse> rejectStage(
            @PathVariable Long stageId,
            @RequestBody RejectStageRequest request) {
        return ResponseEntity.ok(stageService.rejectStage(stageId, request.comment()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(stageService.getAdminDashboard());
    }
}
