import * as React from 'react'
import SoundsRow, { Props } from '../components/SoundsRow'
import AppState from '../store/state'
import { getChosenSounds } from '../store/selectors'
import { connect } from 'react-redux'

function SoundsRowContainer({ sounds }: Props): React.ReactElement<Props> {
    return (
        <SoundsRow sounds={sounds} />
    )
}

const mapStateToProps = (state: AppState) => ({
    sounds: getChosenSounds(state),
})

export default connect<Props, {}, {}, AppState>(mapStateToProps)(React.memo(SoundsRowContainer))