import app from '../app'
import * as firebase from 'firebase'

export interface Database {
    getSoundsRef(): firebase.database.Reference
    getTagsRef(): firebase.database.Reference
}

const database: Database = {
    getSoundsRef: (): firebase.database.Reference => app.database().ref('/sounds'),
    getTagsRef: (): firebase.database.Reference => app.database().ref('/tags')
}

export default database