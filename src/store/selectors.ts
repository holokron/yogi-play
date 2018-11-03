import { createSelector } from 'reselect'
import AppState from './state'
import Sound from '../types/Sound'
import SoundsCollection from '../types/SoundsCollection'
import TagsCollection from '../types/TagsCollection'
import Tag from '../types/Tag'

export const getSoundsCollection = createSelector<AppState, SoundsCollection, SoundsCollection>(
    (state: AppState): SoundsCollection => state.sounds,
    (sounds: SoundsCollection): SoundsCollection => sounds,
)

export const getSounds = createSelector<AppState, SoundsCollection, Sound[]>(
    getSoundsCollection,
    (soundsCollection: SoundsCollection): Sound[] => {
        const sounds = Object.values(soundsCollection)

        sounds.sort((soundA: Sound, soundB: Sound): number => {
            const isNewA: boolean = soundA.isNew || false
            const isNewB: boolean = soundB.isNew || false
            const orderA: number = soundA.order || 0
            const orderB: number = soundB.order || 0

            if (isNewA !== isNewB) {
                return isNewA ? -1 : 1
            }

            if (orderA !== orderB) {
                return orderA < orderB ? -1 : 1
            }

            if (soundA.name === soundB.name) {
                return 0
            }

            return soundA.name < soundB.name ? -1 : 1

        })

        return sounds
    }
)

export function createGetSoundsForTag(tag: Tag) {
    return createSelector<AppState, Sound[], Sound[]>(
        getSounds,
        (sounds: Sound[]): Sound[] => sounds
            .filter((sound: Sound) => {
                if ('all' === tag.slug) {
                    return true
                }

                if ('recent' === tag.slug) {
                    return sound.isNew || false
                }

                if ('misc' === tag.slug) {
                    return !sound.tags || !Object.values(sound.tags).length
                }
            
                return sound.tags && sound.tags[tag.id]
            })
    )
}

export function createGetSound(soundId: string) {
    return createSelector<AppState, SoundsCollection, Sound | null>(
        getSoundsCollection,
        (sounds: SoundsCollection): Sound | null => sounds[soundId] || null,
    )
}

export function getSound(state: AppState, soundId: string): Sound | null {
    return state.sounds[soundId] || null
}

export const getTagsCollection = createSelector<AppState, TagsCollection, TagsCollection>(
    (state: AppState): TagsCollection => state.tags,
    (tags: TagsCollection): TagsCollection => tags,
)

export const getTagsByOrder = createSelector<AppState, TagsCollection, Tag[]>(
    getTagsCollection,
    (tagsCollection: TagsCollection): Tag[] => {
        const tags = Object.values(tagsCollection)
        
        tags.sort((tagA: Tag, tagB: Tag) => {
            const orderA = tagA.order || 0
            const orderB = tagB.order || 0

            if (orderA !== orderB) {
                return orderA < orderB ? -1 : 1
            }

            if (tagA.name === tagB.name) {
                return 0
            }

            return tagA.name < tagB.name ? -1 : 1
        })

        return tags
    }
)