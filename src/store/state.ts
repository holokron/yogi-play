import SoundsCollection from '../types/SoundsCollection'
import TagsCollection from '../types/TagsCollection'
import User from '../types/User'

export default interface AppState {
    sounds: SoundsCollection
    tags: TagsCollection
    chosenTagSlug: string
    isInitialized: boolean
    user: User | null
}

export const initialState: AppState = {
    sounds: {},
    tags: {},
    chosenTagSlug: 'recent',
    isInitialized: false,
    user: null
}