package kz.kmg.dmaic.repository;

import kz.kmg.dmaic.entity.DmaicStage;
import kz.kmg.dmaic.entity.Stage;
import kz.kmg.dmaic.entity.StageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface DmaicStageRepository extends JpaRepository<DmaicStage, Long> {
    Optional<DmaicStage> findByProjectIdAndStage(Long projectId, Stage stage);
    List<DmaicStage> findByProjectId(Long projectId);
    List<DmaicStage> findByStatus(StageStatus status);

    @Query("SELECT s FROM DmaicStage s JOIN FETCH s.project p JOIN FETCH p.user")
    List<DmaicStage> findAllWithUserDetails();
}

