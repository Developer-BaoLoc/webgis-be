import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';

import { UploadMediaDto } from './dto/upload-media.dto';
import { ENTITY_ADMIN_CONFIGS } from '../admin/config/entity-admin.config';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(
    MediaService.name,
  );

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return this.dataSource.query(`
      SELECT *
      FROM media
      ORDER BY id
    `);
  }

  async findByEntity(
    entityType: string,
    entityId: number,
  ) {
    return this.dataSource.query(
      `
      SELECT *
      FROM media
      WHERE entity_type = $1
      AND entity_id = $2
      ORDER BY sort_order, id
      `,
      [entityType, entityId],
    );
  }

  async upload(
    dto: UploadMediaDto,
    file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException(
          'File is required',
        );
      }

      this.assertPositiveEntityId(dto.entityId);
      await this.assertEntityExists(
        dto.entityType,
        dto.entityId,
      );

      const fileUrl = `/uploads/tmp/${file.filename}`;

      const sortOrder =
        dto.fileType === 'image'
          ? await this.nextImageSortOrder(
              dto.entityType,
              dto.entityId,
            )
          : 0;

      const result = await this.dataSource.query(
        `
        INSERT INTO media (
          entity_type,
          entity_id,
          file_type,
          file_url,
          original_name,
          description,
          sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          dto.entityType,
          dto.entityId,
          dto.fileType,
          fileUrl,
          file.originalname,
          dto.description ?? null,
          sortOrder,
        ],
      );

      const uploaded = result[0];

      if (dto.fileType === 'icon') {
        try {
          await this.removeExistingIcons(
            dto.entityType,
            dto.entityId,
            uploaded.id,
          );
        } catch (error) {
          const err = error as { message?: string };
          this.logger.warn(
            `Uploaded icon ${uploaded.id}, but failed to remove older icons for ${dto.entityType} #${dto.entityId}: ${err.message ?? String(error)}`,
          );
        }
      }

      return uploaded;
    } catch (error) {
      if (file?.path) {
        await this.unlinkFile(file.path);
      }

      this.logUploadFailure(dto, file, error);
      throw this.toHttpException(error, 'upload');
    }
  }

  async remove(id: number) {
    const existing = await this.dataSource.query(
      `SELECT * FROM media WHERE id = $1`,
      [id],
    );

    if (!existing.length) {
      throw new NotFoundException(
        `Media #${id} not found`,
      );
    }

    const record = existing[0];
    const relativePath = record.file_url.replace(
      '/uploads/',
      '',
    );

    await this.dataSource.query(
      `DELETE FROM media WHERE id = $1`,
      [id],
    );

    try {
      await unlink(
        join(
          process.cwd(),
          'uploads',
          relativePath,
        ),
      );
    } catch {
      // File may already be missing.
    }

    return { success: true };
  }

  private async removeExistingIcons(
    entityType: string,
    entityId: number,
    keepId?: number,
  ) {
    const icons = await this.dataSource.query(
      `
      SELECT id
      FROM media
      WHERE entity_type = $1
        AND entity_id = $2
        AND file_type = 'icon'
        AND ($3::bigint IS NULL OR id <> $3)
      `,
      [entityType, entityId, keepId ?? null],
    );

    for (const icon of icons) {
      await this.remove(icon.id);
    }
  }

  private async nextImageSortOrder(
    entityType: string,
    entityId: number,
  ) {
    const result = await this.dataSource.query(
      `
      SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
      FROM media
      WHERE entity_type = $1
        AND entity_id = $2
        AND file_type = 'image'
      `,
      [entityType, entityId],
    );

    return Number(result[0].next_order);
  }

  private async assertEntityExists(
    entityType: string,
    entityId: number,
  ) {
    const config = Object.values(
      ENTITY_ADMIN_CONFIGS,
    ).find(
      (entityConfig) =>
        entityConfig.mediaEntityType === entityType,
    );

    if (!config) {
      throw new BadRequestException(
        `Unsupported media entity type: ${entityType}`,
      );
    }

    const result = await this.dataSource.query(
      `SELECT id FROM ${config.tableName} WHERE id = $1 LIMIT 1`,
      [entityId],
    );

    if (!result.length) {
      throw new NotFoundException(
        `${entityType} #${entityId} not found`,
      );
    }
  }

  private assertPositiveEntityId(entityId: number) {
    if (!Number.isInteger(entityId) || entityId < 1) {
      throw new BadRequestException(
        'entityId must be a positive integer',
      );
    }
  }

  private async unlinkFile(path: string) {
    try {
      await unlink(path);
    } catch (error) {
      const err = error as { message?: string };
      this.logger.warn(
        `Failed to clean uploaded file ${path}: ${err.message ?? String(error)}`,
      );
    }
  }

  private toHttpException(
    error: unknown,
    action: string,
  ) {
    if (error instanceof HttpException) {
      return error;
    }

    const pgError = error as {
      code?: string;
      detail?: string;
      message?: string;
    };

    switch (pgError.code) {
      case '23503':
        return new BadRequestException(
          pgError.detail ??
            'Referenced media entity does not exist',
        );
      case '23514':
      case '22P02':
      case '22003':
        return new BadRequestException(
          pgError.message ?? 'Invalid media upload data',
        );
      case '42501':
        return new InternalServerErrorException(
          `Database permission denied during media ${action}. Check grants on media and media_id_seq for the application user.`,
        );
      default:
        return new InternalServerErrorException(
          `Media ${action} failed`,
        );
    }
  }

  private logUploadFailure(
    dto: UploadMediaDto,
    file: Express.Multer.File | undefined,
    error: unknown,
  ) {
    const err = error as {
      code?: string;
      detail?: string;
      message?: string;
      stack?: string;
    };

    this.logger.error(
      JSON.stringify({
        action: 'upload',
        entityType: dto?.entityType,
        entityId: dto?.entityId,
        fileType: dto?.fileType,
        filename: file?.filename,
        path: file?.path,
        code: err.code,
        detail: err.detail,
        message: err.message ?? String(error),
      }),
      err.stack,
    );
  }
}
