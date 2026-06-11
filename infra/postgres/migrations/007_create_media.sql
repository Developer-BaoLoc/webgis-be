CREATE TABLE media (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(255) NOT NULL,
  entity_id BIGINT NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('icon', 'image')),
  file_url TEXT NOT NULL,
  original_name TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_media_entity ON media(entity_type, entity_id);
CREATE INDEX idx_media_type ON media(file_type);
