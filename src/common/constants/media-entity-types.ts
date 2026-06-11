export const MEDIA_ENTITY_TYPES = [
  'cooperative',
  'cooperative_group',
  'irrigation',
  'effective_model',
  'ocop_entity',
  'ocop_product',
  'production_area',
] as const;

export type MediaEntityType =
  (typeof MEDIA_ENTITY_TYPES)[number];

export const MEDIA_FILE_TYPES = [
  'icon',
  'image',
] as const;

export type MediaFileType =
  (typeof MEDIA_FILE_TYPES)[number];
