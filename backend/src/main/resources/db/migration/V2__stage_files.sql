CREATE TABLE stage_files (
    id            BIGSERIAL PRIMARY KEY,
    stage_id      BIGINT       NOT NULL REFERENCES dmaic_stages(id) ON DELETE CASCADE,
    file_name     VARCHAR(255) NOT NULL,
    file_url      VARCHAR(500) NOT NULL,
    file_size     BIGINT       NOT NULL,
    content_type  VARCHAR(100) NOT NULL,
    uploaded_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stage_files_stage ON stage_files(stage_id);
