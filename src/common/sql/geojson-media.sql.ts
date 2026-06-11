export function geojsonIconSubquery(
  entityType: string,
  tableAlias: string,
): string {
  return `(
    SELECT CASE
      WHEN m.file_url LIKE '/uploads/images/%' 
        THEN '/uploads/tmp/' || SUBSTRING(m.file_url FROM LENGTH('/uploads/images/') + 1)
      WHEN m.file_url LIKE '/uploads/icons/%'
        THEN '/uploads/tmp/' || SUBSTRING(m.file_url FROM LENGTH('/uploads/icons/') + 1)
      ELSE m.file_url
    END as normalized_url
    FROM media m
    WHERE
      m.entity_type = '${entityType}'
      AND m.entity_id = ${tableAlias}.id
      AND m.file_type = 'icon'
    ORDER BY m.id
    LIMIT 1
  )`;
}

export function geojsonImagesSubquery(
  entityType: string,
  tableAlias: string,
): string {
  return `COALESCE(
    (
      SELECT json_agg(
        CASE
          WHEN m.file_url LIKE '/uploads/images/%'
            THEN '/uploads/tmp/' || SUBSTRING(m.file_url FROM LENGTH('/uploads/images/') + 1)
          WHEN m.file_url LIKE '/uploads/icons/%'
            THEN '/uploads/tmp/' || SUBSTRING(m.file_url FROM LENGTH('/uploads/icons/') + 1)
          ELSE m.file_url
        END
        ORDER BY m.sort_order, m.id
      )
      FROM media m
      WHERE
        m.entity_type = '${entityType}'
        AND m.entity_id = ${tableAlias}.id
        AND m.file_type = 'image'
    ),
    '[]'::json
  )`;
}
