export interface Sound {
  id: string;
  name: string;
  path: string;
  tags?: Record<string, boolean>;
  order?: number;
  isNew?: boolean;
}

export interface SoundsCollection {
  [soundId: string]: Sound;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  sounds?: Record<string, boolean>;
  order?: number;
}

export interface TagsCollection {
  [tagId: string]: Tag;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  sounds?: Record<string, boolean>;
}
