import Sound from './Sound'
import Tag from './Tag'

export default interface SoundsWithTag {
    tag: Tag
    sounds: Sound[]
}