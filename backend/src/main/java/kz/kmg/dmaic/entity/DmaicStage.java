package kz.kmg.dmaic.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "dmaic_stages",
       uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "stage"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DmaicStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Stage stage;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StageStatus status = StageStatus.DRAFT;

    @Column(name = "admin_score")
    private Integer adminScore;

    @Column(columnDefinition = "TEXT")
    private String adminComment;

    private LocalDate deadline;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;

    @OneToMany(mappedBy = "dmaicStage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<StageFile> files = new ArrayList<>();
}
