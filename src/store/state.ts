import SoundsCollection from '../types/SoundsCollection'
import TagsCollection from '../types/TagsCollection'

export default interface AppState {
    sounds: SoundsCollection
    tags: TagsCollection
}

export const initialState: AppState = {
    sounds: {},
    tags: {},
}