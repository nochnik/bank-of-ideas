package kz.kmg.dmaic.repository;

import kz.kmg.dmaic.entity.StageFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StageFileRepository extends JpaRepository<StageFile, Long> {
    List<StageFile> findByDmaicStageId(Long stageId);
}
