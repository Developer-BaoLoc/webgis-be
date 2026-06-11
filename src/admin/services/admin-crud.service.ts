import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import {
  EntityAdminConfig,
  getEntityConfig,
} from '../config/entity-admin.config';

@Injectable()
export class AdminCrudService {
  private readonly logger = new Logger(
    AdminCrudService.name,
  );

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAllRecords(entityKey: string) {
    try {
      const config = this.getConfig(entityKey);

      return await this.dataSource.query(`
        SELECT ${this.buildSelectList(config)}
        FROM ${config.tableName} t
        ORDER BY t.id
      `);
    } catch (error) {
      this.logFailure('findAll', entityKey, undefined, error);
      throw this.toHttpException(error, 'findAll', entityKey);
    }
  }

  async findOneRecord(
    entityKey: string,
    id: number,
  ) {
    try {
      this.assertPositiveId(id);
      const config = this.getConfig(entityKey);
      const result = await this.dataSource.query(
        `
        SELECT ${this.buildSelectList(config)}
        FROM ${config.tableName} t
        WHERE t.id = $1
        `,
        [id],
      );

      if (!result.length) {
        throw new NotFoundException(
          `${entityKey} #${id} not found`,
        );
      }

      return result[0];
    } catch (error) {
      this.logFailure('findOne', entityKey, id, error);
      throw this.toHttpException(error, 'findOne', entityKey);
    }
  }

  async createRecord(
    entityKey: string,
    body: Record<string, unknown>,
  ) {
    try {
      const config = this.getConfig(entityKey);
      const payload = this.pickWritableFields(
        config,
        body,
        'create',
      );

      const columns = Object.keys(payload);
      const values: unknown[] = Object.values(payload);
      const placeholders = columns.map(
        (_, index) => `$${index + 1}`,
      );

      if (config.geometry !== 'none') {
        const geom = this.buildGeometry(
          config,
          body,
          true,
        );
        columns.push('geom');
        values.push(JSON.stringify(geom));
        placeholders.push(
          `ST_SetSRID(ST_GeomFromGeoJSON($${values.length}), 4326)`,
        );
      }

      if (!columns.length) {
        throw new BadRequestException(
          'No valid fields to create',
        );
      }

      const result = await this.dataSource.query(
        `
        INSERT INTO ${config.tableName} (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING ${this.buildReturningList(config)}
        `,
        values,
      );

      return result[0];
    } catch (error) {
      this.logFailure('create', entityKey, undefined, error, body);
      throw this.toHttpException(error, 'create', entityKey);
    }
  }

  async updateRecord(
    entityKey: string,
    id: number,
    body: Record<string, unknown>,
  ) {
    try {
      this.assertPositiveId(id);
      await this.findOneRecord(entityKey, id);

      const config = this.getConfig(entityKey);
      const payload = this.pickWritableFields(
        config,
        body,
        'update',
      );

      const entries = Object.entries(payload);
      const setClauses: string[] = [];
      const values: unknown[] = [];

      entries.forEach(([key, value], index) => {
        setClauses.push(`${key} = $${index + 1}`);
        values.push(value);
      });

      if (config.geometry !== 'none') {
        const geom = this.buildGeometry(
          config,
          body,
          false,
        );

        if (geom) {
          setClauses.push(
            `geom = ST_SetSRID(ST_GeomFromGeoJSON($${values.length + 1}), 4326)`,
          );
          values.push(JSON.stringify(geom));
        }
      }

      if (!setClauses.length) {
        throw new BadRequestException(
          'No valid fields to update',
        );
      }

      values.push(id);

      const result = await this.dataSource.query(
        `
        UPDATE ${config.tableName}
        SET ${setClauses.join(', ')}
        WHERE id = $${values.length}
        RETURNING ${this.buildReturningList(config)}
        `,
        values,
      );

      return result[0];
    } catch (error) {
      this.logFailure('update', entityKey, id, error, body);
      throw this.toHttpException(error, 'update', entityKey);
    }
  }

  async deleteRecord(
    entityKey: string,
    id: number,
  ) {
    try {
      this.assertPositiveId(id);
      await this.findOneRecord(entityKey, id);
      const config = this.getConfig(entityKey);

      await this.dataSource.query(
        `DELETE FROM ${config.tableName} WHERE id = $1`,
        [id],
      );

      return { success: true };
    } catch (error) {
      this.logFailure('delete', entityKey, id, error);
      throw this.toHttpException(error, 'delete', entityKey);
    }
  }

  private pickWritableFields(
    config: EntityAdminConfig,
    body: Record<string, unknown>,
    operation: 'create' | 'update',
  ) {
    const writable = config.columns.filter(
      (column) => column !== 'id',
    );
    const allowedFields = new Set([
      ...writable,
      'latitude',
      'longitude',
      'geom',
      'geomGeoJson',
    ]);

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new BadRequestException(
        'Request body must be an object',
      );
    }

    const unsupportedFields = Object.keys(body).filter(
      (field) => !allowedFields.has(field),
    );

    if (unsupportedFields.length) {
      throw new BadRequestException(
        `Unsupported field(s): ${unsupportedFields.join(', ')}`,
      );
    }

    if (operation === 'create') {
      const missingColumns = (
        config.requiredColumns ?? []
      ).filter((column) => this.isBlank(body[column]));

      if (missingColumns.length) {
        throw new BadRequestException(
          `Missing required field(s): ${missingColumns.join(', ')}`,
        );
      }
    }

    return writable.reduce<
      Record<string, unknown>
    >((acc, column) => {
      if (body[column] !== undefined) {
        acc[column] = this.normalizeFieldValue(
          config,
          column,
          body[column],
        );
      }

      return acc;
    }, {});
  }

  private buildGeometry(
    config: EntityAdminConfig,
    body: Record<string, unknown>,
    required: boolean,
  ) {
    if (body.geom) {
      return this.validateGeometry(config, body.geom);
    }

    if (
      config.geometry === 'point' &&
      body.latitude !== undefined &&
      body.longitude !== undefined
    ) {
      const longitude = Number(body.longitude);
      const latitude = Number(body.latitude);

      this.assertCoordinateRange(
        latitude,
        longitude,
      );

      return {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    if (
      config.geometry === 'point' &&
      (body.latitude !== undefined ||
        body.longitude !== undefined)
    ) {
      throw new BadRequestException(
        'Both latitude and longitude are required when updating coordinates',
      );
    }

    if (
      config.geometry === 'polygon' &&
      body.geomGeoJson
    ) {
      return this.validateGeometry(
        config,
        body.geomGeoJson,
      );
    }

    if (config.geometry === 'none') {
      return undefined;
    }

    if (!required) {
      return undefined;
    }

    throw new BadRequestException(
      'Geometry is required',
    );
  }

  private buildSelectList(config: EntityAdminConfig) {
    const columns = config.columns.map(
      (column) => `t.${column}`,
    );

    if (config.geometry === 'point') {
      columns.push(
        'ST_AsGeoJSON(t.geom)::json AS geom',
        'ST_Y(t.geom) AS latitude',
        'ST_X(t.geom) AS longitude',
      );
    }

    if (config.geometry === 'polygon') {
      columns.push('ST_AsGeoJSON(t.geom)::json AS geom');
    }

    return columns.join(', ');
  }

  private buildReturningList(config: EntityAdminConfig) {
    const columns = config.columns.join(', ');

    if (config.geometry === 'point') {
      return `${columns}, ST_AsGeoJSON(geom)::json AS geom, ST_Y(geom) AS latitude, ST_X(geom) AS longitude`;
    }

    if (config.geometry === 'polygon') {
      return `${columns}, ST_AsGeoJSON(geom)::json AS geom`;
    }

    return columns;
  }

  private getConfig(entityKey: string) {
    try {
      return getEntityConfig(entityKey);
    } catch {
      throw new BadRequestException(
        `Unknown admin entity: ${entityKey}`,
      );
    }
  }

  private normalizeFieldValue(
    config: EntityAdminConfig,
    column: string,
    value: unknown,
  ) {
    if (value === null) {
      return null;
    }

    if (this.isBlank(value)) {
      return null;
    }

    if (config.integerColumns?.includes(column)) {
      const numberValue = Number(value);

      if (!Number.isInteger(numberValue)) {
        throw new BadRequestException(
          `${column} must be an integer`,
        );
      }

      return numberValue;
    }

    if (config.numericColumns?.includes(column)) {
      const numberValue = Number(value);

      if (!Number.isFinite(numberValue)) {
        throw new BadRequestException(
          `${column} must be a valid number`,
        );
      }

      return numberValue;
    }

    if (
      typeof value === 'object' ||
      typeof value === 'function'
    ) {
      throw new BadRequestException(
        `${column} must be a text value`,
      );
    }

    return String(value);
  }

  private validateGeometry(
    config: EntityAdminConfig,
    value: unknown,
  ) {
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value)
    ) {
      throw new BadRequestException(
        'Geometry must be a GeoJSON object',
      );
    }

    const geometry = value as {
      type?: string;
      coordinates?: unknown;
    };

    if (config.geometry === 'point') {
      if (
        geometry.type !== 'Point' ||
        !Array.isArray(geometry.coordinates) ||
        geometry.coordinates.length < 2
      ) {
        throw new BadRequestException(
          'Point geometry must contain longitude and latitude coordinates',
        );
      }

      const longitude = Number(
        geometry.coordinates[0],
      );
      const latitude = Number(geometry.coordinates[1]);

      this.assertCoordinateRange(
        latitude,
        longitude,
      );

      return {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    if (
      config.geometry === 'polygon' &&
      geometry.type !== 'Polygon'
    ) {
      throw new BadRequestException(
        'Polygon GeoJSON is required',
      );
    }

    return geometry;
  }

  private assertCoordinateRange(
    latitude: number,
    longitude: number,
  ) {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      throw new BadRequestException(
        'Latitude and longitude must be valid numbers',
      );
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new BadRequestException(
        'Latitude or longitude is outside the valid range',
      );
    }
  }

  private assertPositiveId(id: number) {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(
        'ID must be a positive integer',
      );
    }
  }

  private isBlank(value: unknown) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    );
  }

  private toHttpException(
    error: unknown,
    action: string,
    entityKey: string,
  ) {
    if (error instanceof HttpException) {
      return error;
    }

    const pgError = error as {
      code?: string;
      column?: string;
      constraint?: string;
      detail?: string;
      message?: string;
    };

    switch (pgError.code) {
      case '23502':
        return new BadRequestException(
          `${pgError.column ?? 'A required field'} is missing`,
        );
      case '23503':
        return new BadRequestException(
          pgError.detail ??
            'Referenced record does not exist',
        );
      case '23505':
        return new ConflictException(
          pgError.detail ??
            `${entityKey} already exists`,
        );
      case '22P02':
      case '22003':
        return new BadRequestException(
          pgError.message ?? 'Invalid field value',
        );
      case '23514':
        return new BadRequestException(
          pgError.detail ??
            'A database constraint was violated',
        );
      case '42501':
        return new InternalServerErrorException(
          `Database permission denied while trying to ${action} ${entityKey}. Check table and sequence grants for the application user.`,
        );
      default:
        return new InternalServerErrorException(
          `Unable to ${action} ${entityKey}`,
        );
    }
  }

  private logFailure(
    action: string,
    entityKey: string,
    id: number | undefined,
    error: unknown,
    body?: Record<string, unknown>,
  ) {
    const err = error as {
      code?: string;
      detail?: string;
      message?: string;
      stack?: string;
    };

    this.logger.error(
      JSON.stringify({
        action,
        entityKey,
        id,
        code: err.code,
        detail: err.detail,
        message: err.message ?? String(error),
        body,
      }),
      err.stack,
    );
  }
}
