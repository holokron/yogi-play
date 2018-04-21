import * as React from 'react'
import * as firebase from 'firebase'
import database from '../lib/database'
import SoundsRepository from '../lib/sounds-repository'
import TagsRepository from '../lib/tags-repository'

export interface Props {
    children: {(
        soundsRepository: SoundsRepository,
        tagsRepository: TagsRepository,
    ): React.ReactElement<any>}
}

export interface State {
    fetchedSoundsAt: Date | null
    fetchedTagsAt: Date | null
}

export default class SoundsContainer extends React.PureComponent<Props, State> {
    private readonly soundsRepository: SoundsRepository = new SoundsRepository()
    private readonly tagsRepository: TagsRepository = new TagsRepository()

    constructor(props: Props) {
        super(props)

        this.state = {
            fetchedSoundsAt: null,
            fetchedTagsAt: null,
        }
    }

    async loadTags() {
        database.getTagsRef()
            .on(
                'value',
                (snapshot: firebase.database.DataSnapshot) => {
                    this.tagsRepository.setTags(snapshot.val())
                    this.setState((state: State) => ({
                        ...state,
                        fetchedTagsAt: new Date(),
                    }))
                }
            )
    }

    async loadSounds() {
        database.getSoundsRef()
            .on(
                'value',
                (snapshot: firebase.database.DataSnapshot) => {                    
                    this.soundsRepository.setSounds(snapshot.val())
                    this.setState((state: State) => ({
                        ...state,
                        fetchedSoundsAt: new Date(),
                    }))
                }
            )
    }

    componentDidMount() {
        this.loadTags()
        this.loadSounds()
    }

    render() {
        const {
            props: {
                children,
            },
            soundsRepository,
            tagsRepository,
        } = this

        return children(soundsRepository, tagsRepository)
    }
}