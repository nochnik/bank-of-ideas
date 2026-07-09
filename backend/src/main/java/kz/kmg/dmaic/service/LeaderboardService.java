package kz.kmg.dmaic.service;

import kz.kmg.dmaic.dto.LeaderboardEntry;
import kz.kmg.dmaic.entity.DmaicStage;
import kz.kmg.dmaic.entity.Role;
import kz.kmg.dmaic.entity.User;
import kz.kmg.dmaic.repository.DmaicStageRepository;
import kz.kmg.dmaic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;
    private final DmaicStageRepository stageRepository;
    private final BarrelService barrelService;

    public List<LeaderboardEntry> getLeaderboard() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.PARTICIPANT)
                .map(this::toEntry)
                .sorted(Comparator.comparingInt(LeaderboardEntry::totalBarrels).reversed())
                .toList();
    }

    private LeaderboardEntry toEntry(User user) {
        int totalBarrels = 0;
        if (user.getProject() != null) {
            List<DmaicStage> stages = stageRepository.findByProjectId(user.getProject().getId());
            totalBarrels = stages.stream()
                    .mapToInt(s -> barrelService.calculateBarrels(s.getAdminScore()))
                    .sum();
        }
        return new LeaderboardEntry(
                user.getId(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getPosition(),
                totalBarrels,
                barrelService.calculateReward(totalBarrels));
    }
}
