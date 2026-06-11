/**
 * Migration Script: Update Media URLs from uploads/images and uploads/icons to uploads/tmp
 * 
 * This script updates any existing media records that have URLs pointing to the old
 * uploads/images or uploads/icons directories to use the new uploads/tmp directory.
 * 
 * Usage:
 *   npx ts-node src/migrations/migrate-media-urls.ts
 */

import { DataSource } from 'typeorm';

async function migrateMediaUrls() {
  // Create a direct database connection for this migration
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'webgis',
    synchronize: false,
  });

  await dataSource.initialize();

  try {
    console.log('Starting media URL migration...');

    // Check how many records need updating
    const countResult = await dataSource.query(
      `
      SELECT COUNT(*) as count
      FROM media
      WHERE file_url LIKE '/uploads/images/%'
         OR file_url LIKE '/uploads/icons/%'
      `,
    );

    const recordsToUpdate = Number(countResult[0].count);

    if (recordsToUpdate === 0) {
      console.log('✓ No media URLs need updating');
      return;
    }

    console.log(`Found ${recordsToUpdate} media records to update`);

    // Update URLs that start with /uploads/images/
    const updateImages = await dataSource.query(
      `
      UPDATE media
      SET file_url = '/uploads/tmp/' || SUBSTRING(file_url FROM LENGTH('/uploads/images/') + 1)
      WHERE file_url LIKE '/uploads/images/%'
      `,
    );

    console.log(
      `✓ Updated ${updateImages.length || updateImages} image URLs`,
    );

    // Update URLs that start with /uploads/icons/
    const updateIcons = await dataSource.query(
      `
      UPDATE media
      SET file_url = '/uploads/tmp/' || SUBSTRING(file_url FROM LENGTH('/uploads/icons/') + 1)
      WHERE file_url LIKE '/uploads/icons/%'
      `,
    );

    console.log(
      `✓ Updated ${updateIcons.length || updateIcons} icon URLs`,
    );

    // Verify the updates
    const verifyResult = await dataSource.query(
      `
      SELECT COUNT(*) as count
      FROM media
      WHERE file_url LIKE '/uploads/images/%'
         OR file_url LIKE '/uploads/icons/%'
      `,
    );

    const remainingOld = Number(verifyResult[0].count);

    if (remainingOld === 0) {
      console.log('✓ Migration complete: All media URLs have been updated');
    } else {
      console.warn(
        `⚠ Warning: ${remainingOld} media URLs still have old paths`,
      );
    }

    // Show sample of updated URLs
    const samples = await dataSource.query(
      `
      SELECT id, file_url
      FROM media
      WHERE file_url LIKE '/uploads/tmp/%'
      LIMIT 5
      `,
    );

    console.log('\nSample updated URLs:');
    samples.forEach((record: any) => {
      console.log(`  ID ${record.id}: ${record.file_url}`);
    });
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Run the migration
migrateMediaUrls()
  .then(() => {
    console.log('\n✓ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration script failed');
    process.exit(1);
  });
