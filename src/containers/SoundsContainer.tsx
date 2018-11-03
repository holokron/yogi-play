import * as React from 'react'
import { connect } from 'react-redux'
import SoundsRepository from '../lib/sounds-repository'
import SoundsCollection from '../types/SoundsCollection'
import Tag from '../types/Tag'
import { getSoundsCollection, getTagsByOrder } from '../store/selectors'
import { loadSounds, loadTags, AppDispatch } from '../store/actions'
import AppState from '../store/state'

export interface Props {
    children: {(
        soundsRepository: SoundsRepository,
        tags: Tag[],
    ): React.ReactElement<any>}
    loadSounds: () => void
    loadTags: () => void
    sounds: SoundsCollection
    tags: Tag[]
}

class SoundsContainer extends React.PureComponent<Props> {
    private readonly soundsRepository: SoundsRepository = new SoundsRepository()

    componentDidMount() {
        this.props.loadTags()
        this.props.loadSounds()
    }

    render() {
        const {
            props: {
                children,
                tags,
            },
            soundsRepository,
        } = this

        return children(soundsRepository, tags)
    }
}

const mapStateToProps = (state: AppState) => ({
    sounds: getSoundsCollection(state),
    tags: getTagsByOrder(state),
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loadSounds: async () => {
        dispatch(loadSounds())
    },
    loadTags: async () => {
        dispatch(loadTags())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(SoundsContainer)