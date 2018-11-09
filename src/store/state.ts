import SoundsCollection from '../types/SoundsCollection'
import TagsCollection from '../types/TagsCollection'

export default interface AppState {
    sounds: SoundsCollection
    tags: TagsCollection
    chosenTagId: string | null
}

export const initialState: AppState = {
    sounds: {},
    tags: {},
    chosenTagId: null,
}