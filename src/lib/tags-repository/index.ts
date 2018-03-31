import Tag from '../../types/Tag'

export default class SoundsRepository {
    private tags: Tag[] = []
    private cache: Map<string, any> = new Map<string, any>()

    getTagsByOrder(): Tag[] {
        const key: string = 'tagsByOrder'
        if (!this.cache.has(key)) {                
            this.tags.sort((tagA: Tag, tagB: Tag) => {
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

            this.cache.set(key, true)
        }

        return this.tags
    }

    setTags(tags: Map<string, Tag>): void {
        this.tags = Object.values(tags)
        this.cache.clear()
    }

    getTags(): Tag[] {
        return this.tags
    }
}