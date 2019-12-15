import Sound from "../../types/Sound";
import Tag from "../../types/Tag";

export default class SoundsRepository {
  private sounds: Sound[] = [];
  private cache: Map<string, any> = new Map<string, any>();

  getSoundsForTag(tag: Tag | null): Sound[] {
    if (!tag) {
      return [];
    }

    this.sounds.sort((soundA: Sound, soundB: Sound): number => {
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

    return this.sounds.filter((sound: Sound) => {
      if ("all" === tag.slug) {
        return true;
      }

      if ("recent" === tag.slug) {
        return sound.isNew || false;
      }

      if ("misc" === tag.slug) {
        return !sound.tags || !Object.values(sound.tags).length;
      }

      return sound.tags && sound.tags[tag.id];
    });
  }

  setSounds(sounds: Map<string, Sound>): void {
    this.sounds = Object.values(sounds);
    this.cache.clear();
  }

  getSounds(): Sound[] {
    return this.sounds;
  }
}
