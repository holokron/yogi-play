export type CatalogTag = { id: string; slug: string; name: string };

export type CatalogSound = {
  id: string;
  name: string;
  path: string;
  tags: string[];
  isNew?: boolean;
};

export type Catalog = { sounds: CatalogSound[]; tags: CatalogTag[] };

export type DbSound = {
  id: string;
  name: string;
  path: string;
  order: number;
  tags?: Record<string, true>;
  isNew?: boolean;
};

export type DbTag = {
  id: string;
  name: string;
  slug: string;
  order: number;
  sounds?: Record<string, true>;
};

export type DbShape = {
  sounds: Record<string, DbSound>;
  tags: Record<string, DbTag>;
};
