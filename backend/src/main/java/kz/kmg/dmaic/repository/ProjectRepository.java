package kz.kmg.dmaic.repository;

import kz.kmg.dmaic.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByUserId(Long userId);
}
