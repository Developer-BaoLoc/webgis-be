import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  MEDIA_ENTITY_TYPES,
  MEDIA_FILE_TYPES,
} from '../../common/constants/media-entity-types';

export class UploadMediaDto {
  @IsIn(MEDIA_ENTITY_TYPES)
  entityType: string;

  @Type(() => Number)
  @IsInt()
  entityId: number;

  @IsIn(MEDIA_FILE_TYPES)
  fileType: 'icon' | 'image';

  @IsOptional()
  @IsString()
  description?: string;
}
