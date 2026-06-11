-- Migration SQL: Update Media URLs from uploads/images and uploads/icons to uploads/tmp
-- 
-- This script updates any existing media records that have URLs pointing to the old
-- uploads/images or uploads/icons directories to use the new uploads/tmp directory.

-- Count records to update
SELECT COUNT(*) as records_to_update
FROM media
WHERE file_url LIKE '/uploads/images/%'
   OR file_url LIKE '/uploads/icons/%';

-- Update /uploads/images/* to /uploads/tmp/*
UPDATE media
SET file_url = '/uploads/tmp/' || SUBSTRING(file_url FROM LENGTH('/uploads/images/') + 1)
WHERE file_url LIKE '/uploads/images/%';

-- Update /uploads/icons/* to /uploads/tmp/*
UPDATE media
SET file_url = '/uploads/tmp/' || SUBSTRING(file_url FROM LENGTH('/uploads/icons/') + 1)
WHERE file_url LIKE '/uploads/icons/%';

-- Verify all updates
SELECT COUNT(*) as remaining_old_paths
FROM media
WHERE file_url LIKE '/uploads/images/%'
   OR file_url LIKE '/uploads/icons/%';

-- Show sample of updated records
SELECT id, entity_type, entity_id, file_type, file_url, created_at
FROM media
WHERE file_url LIKE '/uploads/tmp/%'
ORDER BY id
LIMIT 10;
