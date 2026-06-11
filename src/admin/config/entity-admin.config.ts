export type GeometryKind = 'point' | 'polygon' | 'none';

export interface EntityAdminConfig {
  key: string;
  tableName: string;
  mediaEntityType: string;
  geometry: GeometryKind;
  columns: string[];
  requiredColumns?: string[];
  numericColumns?: string[];
  integerColumns?: string[];
  geoJsonProperties: string[];
}

const SHARED_AGRICULTURE_COLUMNS = [
  'id',
  'name',
  'representative',
  'address',
  'business_type',
  'area_ha',
  'production_process',
  'members',
  'production',
  'sales_channel',
  'annual_cost',
  'annual_income',
  'annual_profit',
  'phone',
  'status',
  'note',
];

const SHARED_AGRICULTURE_GEOJSON_PROPERTIES = [
  'id',
  'name',
  'representative',
  'address',
  'business_type',
  'phone',
  'status',
];

export const ENTITY_ADMIN_CONFIGS: Record<
  string,
  EntityAdminConfig
> = {
  cooperatives: {
    key: 'cooperatives',
    tableName: 'cooperatives',
    mediaEntityType: 'cooperative',
    geometry: 'point',
    columns: SHARED_AGRICULTURE_COLUMNS,
    requiredColumns: ['name'],
    numericColumns: [
      'area_ha',
      'annual_cost',
      'annual_income',
      'annual_profit',
    ],
    integerColumns: ['members'],
    geoJsonProperties:
      SHARED_AGRICULTURE_GEOJSON_PROPERTIES,
  },
  'cooperative-groups': {
    key: 'cooperative-groups',
    tableName: 'cooperative_groups',
    mediaEntityType: 'cooperative_group',
    geometry: 'point',
    columns: SHARED_AGRICULTURE_COLUMNS,
    requiredColumns: ['name'],
    geoJsonProperties:
      SHARED_AGRICULTURE_GEOJSON_PROPERTIES,
  },
  irrigations: {
    key: 'irrigations',
    tableName: 'irrigations',
    mediaEntityType: 'irrigation',
    geometry: 'point',
    columns: SHARED_AGRICULTURE_COLUMNS,
    requiredColumns: ['name'],
    geoJsonProperties:
      SHARED_AGRICULTURE_GEOJSON_PROPERTIES,
  },
  'effective-models': {
    key: 'effective-models',
    tableName: 'effective_models',
    mediaEntityType: 'effective_model',
    geometry: 'point',
    columns: [
      ...SHARED_AGRICULTURE_COLUMNS,
      'type',
    ],
    requiredColumns: ['name'],
    geoJsonProperties: [
      'id',
      'name',
      'representative',
      'address',
      'business_type',
      'phone',
      'status',
      'type',
    ],
  },
  'ocop-entities': {
    key: 'ocop-entities',
    tableName: 'ocop_entities',
    mediaEntityType: 'ocop_entity',
    geometry: 'point',
    columns: [
      'id',
      'name',
      'representative',
      'address',
      'phone',
      'status',
      'note',
    ],
    requiredColumns: ['name'],
    geoJsonProperties: [
      'id',
      'name',
      'representative',
      'address',
      'phone',
      'status',
    ],
  },
  'ocop-products': {
    key: 'ocop-products',
    tableName: 'ocop_products',
    mediaEntityType: 'ocop_product',
    geometry: 'none',
    columns: [
      'id',
      'entity_id',
      'product_name',
      'ranking',
      'business_type',
      'area_ha',
      'production_process',
      'production',
      'sales_channel',
      'annual_cost',
      'annual_income',
      'annual_profit',
    ],
    requiredColumns: [
      'entity_id',
      'product_name',
    ],
    integerColumns: ['entity_id'],
    geoJsonProperties: [],
  },
  'production-areas': {
    key: 'production-areas',
    tableName: 'production_areas',
    mediaEntityType: 'production_area',
    geometry: 'polygon',
    columns: SHARED_AGRICULTURE_COLUMNS,
    requiredColumns: ['name'],
    geoJsonProperties:
      SHARED_AGRICULTURE_GEOJSON_PROPERTIES,
  },
};

export function getEntityConfig(
  key: string,
): EntityAdminConfig {
  const config = ENTITY_ADMIN_CONFIGS[key];

  if (!config) {
    throw new Error(`Unknown entity: ${key}`);
  }

  return config;
}
