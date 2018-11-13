import SoundsCollection from '../types/SoundsCollection'
import TagsCollection from '../types/TagsCollection'

export default interface AppState {
    sounds: SoundsCollection
    tags: TagsCollection
    chosenTagSlug: string
}

export const initialState: AppState = {
    sounds: {},
    tags: {},
    chosenTagSlug: 'recent',
}