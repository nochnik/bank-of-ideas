package kz.kmg.dmaic.service;

import kz.kmg.dmaic.dto.*;
import kz.kmg.dmaic.entity.*;
import kz.kmg.dmaic.repository.DmaicStageRepository;
import kz.kmg.dmaic.repository.ProjectRepository;
import kz.kmg.dmaic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StageService {

    private final DmaicStageRepository stageRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final BarrelService barrelService;

    @Transactional
    public List<StageResponse> getMyStages(Long userId) {
        Project project = getOrCreateProject(userId);
        return stageRepository.findByProjectId(project.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public StageResponse saveContent(Long userId, Stage stage, StageContentRequest request) {
        Project project = getOrCreateProject(userId);
        DmaicStage dmaicStage = stageRepository
                .findByProjectIdAndStage(project.getId(), stage)
                .orElseGet(() -> DmaicStage.builder()
                        .project(project)
                        .stage(stage)
                        .status(StageStatus.DRAFT)
                        .build());

        if (dmaicStage.getStatus() == StageStatus.APPROVED || dmaicStage.getStatus() == StageStatus.SUBMITTED) {
            throw new IllegalStateException("Cannot edit a submitted or approved stage");
        }
        dmaicStage.setContent(request.content());
        // If previously rejected, reset back to DRAFT upon editing
        if (dmaicStage.getStatus() == StageStatus.REJECTED) {
            dmaicStage.setStatus(StageStatus.DRAFT);
        }
        return toResponse(stageRepository.save(dmaicStage));
    }

    @Transactional
    public StageResponse submitForReview(Long userId, Stage stage) {
        Project project = getOrCreateProject(userId);
        DmaicStage dmaicStage = stageRepository
                .findByProjectIdAndStage(project.getId(), stage)
                .orElseThrow(() -> new IllegalArgumentException("Stage not found"));

        dmaicStage.setStatus(StageStatus.SUBMITTED);
        dmaicStage.setSubmittedAt(LocalDateTime.now());
        return toResponse(stageRepository.save(dmaicStage));
    }

    @Transactional
    public StageResponse reviewStage(Long stageId, StageReviewRequest request) {
        DmaicStage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new IllegalArgumentException("Stage not found: " + stageId));

        stage.setAdminScore(request.score());
        stage.setAdminComment(request.comment());
        stage.setStatus(StageStatus.APPROVED);
        stage.setReviewedAt(LocalDateTime.now());
        return toResponse(stageRepository.save(stage));
    }

    @Transactional
    public StageResponse rejectStage(Long stageId, String comment) {
        DmaicStage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new IllegalArgumentException("Stage not found: " + stageId));

        stage.setStatus(StageStatus.REJECTED);
        stage.setAdminScore(null);
        stage.setAdminComment(comment);
        stage.setReviewedAt(LocalDateTime.now());
        return toResponse(stageRepository.save(stage));
    }

    public List<StageResponse> getSubmittedStages() {
        return stageRepository.findByStatus(StageStatus.SUBMITTED).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StageResponse> getUserStages(Long userId) {
        Project project = projectRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found for user: " + userId));
        return stageRepository.findByProjectId(project.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        List<DmaicStage> allStages = stageRepository.findAllWithUserDetails();
        List<User> allUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.PARTICIPANT)
                .toList();

        int submitted = 0, approved = 0, rejected = 0, draft = 0;
        for (DmaicStage s : allStages) {
            switch (s.getStatus()) {
                case SUBMITTED -> submitted++;
                case APPROVED -> approved++;
                case REJECTED -> rejected++;
                case DRAFT -> draft++;
            }
        }

        // Group stages by userId
        Map<Long, List<DmaicStage>> stagesByUser = allStages.stream()
                .collect(Collectors.groupingBy(s -> s.getProject().getUser().getId()));

        List<AdminDashboardResponse.ParticipantProgress> participants = allUsers.stream()
                .map(user -> {
                    List<DmaicStage> userStages = stagesByUser.getOrDefault(user.getId(), List.of());

                    List<AdminDashboardResponse.StageProgressItem> stageItems = userStages.stream()
                            .map(s -> new AdminDashboardResponse.StageProgressItem(
                                    s.getStage().name(),
                                    s.getStatus().name(),
                                    s.getAdminScore(),
                                    s.getSubmittedAt()
                            ))
                            .toList();

                    int totalBarrels = userStages.stream()
                            .mapToInt(s -> barrelService.calculateBarrels(s.getAdminScore()))
                            .sum();

                    return new AdminDashboardResponse.ParticipantProgress(
                            user.getId(),
                            user.getFullName(),
                            user.getPosition(),
                            user.getAvatarUrl(),
                            stageItems,
                            totalBarrels
                    );
                })
                .sorted(Comparator.comparingInt(AdminDashboardResponse.ParticipantProgress::totalBarrels).reversed())
                .toList();

        return new AdminDashboardResponse(
                allUsers.size(), submitted, approved, rejected, draft, participants
        );
    }

    @Transactional
    public DmaicStage getOrCreateDmaicStage(Long userId, Stage stage) {
        Project project = getOrCreateProject(userId);
        return stageRepository
                .findByProjectIdAndStage(project.getId(), stage)
                .orElseGet(() -> stageRepository.save(DmaicStage.builder()
                        .project(project)
                        .stage(stage)
                        .status(StageStatus.DRAFT)
                        .build()));
    }

    private Project getOrCreateProject(Long userId) {
        return projectRepository.findByUserId(userId)
                .orElseGet(() -> projectRepository.save(
                        Project.builder()
                                .user(userRepository.getReferenceById(userId))
                                .title("Мой проект")
                                .build()));
    }

    private StageResponse toResponse(DmaicStage s) {
        List<StageFileDto> fileDtos = s.getFiles() != null
                ? s.getFiles().stream()
                    .map(f -> new StageFileDto(
                            f.getId(), f.getFileName(), f.getFileUrl(),
                            f.getFileSize(), f.getContentType(), f.getUploadedAt()))
                    .toList()
                : List.of();

        User owner = s.getProject().getUser();
        return new StageResponse(
                s.getId(),
                s.getStage().name(),
                s.getContent(),
                s.getStatus().name(),
                s.getAdminScore(),
                s.getAdminComment(),
                s.getDeadline(),
                s.getSubmittedAt(),
                s.getReviewedAt(),
                barrelService.calculateBarrels(s.getAdminScore()),
                fileDtos,
                owner.getId(),
                owner.getFullName());
    }
}
