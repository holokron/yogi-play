import { createSelector } from "reselect";
import AppState from "./state";
import Sound from "../types/Sound";
import SoundsCollection from "../types/SoundsCollection";
import TagsCollection from "../types/TagsCollection";
import Tag from "../types/Tag";
import User from "../types/User";

export const getSoundsCollection = createSelector<
  AppState,
  SoundsCollection,
  SoundsCollection
>(
  (state: AppState): SoundsCollection => state.sounds,
  (sounds: SoundsCollection): SoundsCollection => sounds
);

export const getSounds = createSelector<AppState, SoundsCollection, Sound[]>(
  getSoundsCollection,
  (soundsCollection: SoundsCollection): Sound[] => {
    const sounds = Object.values(soundsCollection);

    sounds.sort((soundA: Sound, soundB: Sound): number => {
      const isNewA: boolean = soundA.isNew || false;
      const isNewB: boolean = soundB.isNew || false;
      const orderA: number = soundA.order || 0;
      const orderB: number = soundB.order || 0;

      if (isNewA !== isNewB) {
        return isNewA ? -1 : 1;
      }

      if (orderA !== orderB) {
        return orderA < orderB ? -1 : 1;
      }

      if (soundA.name === soundB.name) {
        return 0;
      }

      return soundA.name < soundB.name ? -1 : 1;
    });

    return sounds;
  }
);

export const getSoundsFilter = createSelector<
  AppState,
  string | null,
  string | null
>(
  (state: AppState) => state.soundsFilter,
  (soundsFilter: string | null) => soundsFilter
);

export const filterSounds = createSelector<
  AppState,
  string | null,
  Sound[],
  Sound[]
>(
  getSoundsFilter,
  getSounds,
  (soundsfilter: string | null, sounds: Sound[]): Sound[] => {
    if (null === soundsfilter) {
      return sounds;
    }

    const regexp = new RegExp(soundsfilter.trim().toLowerCase(), "ig");

    return sounds.filter((sound: Sound) => regexp.test(sound.name));
  }
);

export function getSound(state: AppState, soundId: string): Sound | null {
  return state.sounds[soundId] || null;
}

export const getTagsCollection = createSelector<
  AppState,
  TagsCollection,
  TagsCollection
>(
  (state: AppState): TagsCollection => state.tags,
  (tags: TagsCollection): TagsCollection => tags
);

export const getTagsByOrder = createSelector<AppState, TagsCollection, Tag[]>(
  getTagsCollection,
  (tagsCollection: TagsCollection): Tag[] => {
    const tags = Object.values(tagsCollection);

    tags.sort((tagA: Tag, tagB: Tag) => {
      const orderA = tagA.order || 0;
      const orderB = tagB.order || 0;

      if (orderA !== orderB) {
        return orderA < orderB ? -1 : 1;
      }

      if (tagA.name === tagB.name) {
        return 0;
      }

      return tagA.name < tagB.name ? -1 : 1;
    });

    return tags.filter(
      (tag: Tag) =>
        tag.sounds || ["all", "recent", "misc"].includes(tag.slug) || false
    );
  }
);

export const getChosenTag = createSelector<
  AppState,
  string | null,
  TagsCollection,
  Tag | null
>(
  (state: AppState): string => state.chosenTagSlug,
  getTagsCollection,
  (chosenTagSlug: string | null, tags: TagsCollection): Tag | null => {
    const chosenTags = Object.values(tags).filter(
      (tag: Tag): boolean => chosenTagSlug === tag.slug
    );

    return chosenTags[0] || null;
  }
);

export const getChosenSounds = createSelector<
  AppState,
  Sound[],
  Tag | null,
  Sound[]
>(filterSounds, getChosenTag, (sounds: Sound[], tag: Tag | null): Sound[] => {
  if (!tag) {
    return [];
  }

  if ("all" === tag.slug) {
    return sounds;
  }

  if ("recent" === tag.slug) {
    return sounds.filter((sound: Sound): boolean => sound.isNew || false);
  }

  if ("misc" === tag.slug) {
    return sounds.filter((sound: Sound): boolean => !sound.tags || false);
  }

  return sounds.filter(
    (sound: Sound): boolean => (sound.tags && sound.tags[tag.id]) || false
  );
});

export const getUser = createSelector<AppState, User | null, User | null>(
  (state: AppState) => state.user,
  (user: User | null) => user
);

export const hasUserSound = (state: AppState, soundId: string): boolean => {
  const user: User | null = getUser(state);

  return (user && user.sounds && user.sounds[soundId]) || false;
};

export const getUserSounds = createSelector<
  AppState,
  User | null,
  Sound[],
  Sound[]
>(getUser, filterSounds, (user: User | null, sounds: Sound[]) => {
  if (!user || !user.sounds) {
    return [];
  }

  const keys: string[] = Object.keys(user.sounds);

  return sounds.filter((sound: Sound): boolean => keys.includes(sound.id));
});
