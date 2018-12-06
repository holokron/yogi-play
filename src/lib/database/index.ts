import app from '../app'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import User from '../../types/User'

export interface Database {
    getSoundsRef(): firebase.database.Reference
    getTagsRef(): firebase.database.Reference
    getUser(id: string): Promise<User>
    createUser(user: User): void
}

const database: Database = {
    getSoundsRef: (): firebase.database.Reference => app.database().ref('/sounds'),
    getTagsRef: (): firebase.database.Reference => app.database().ref('/tags'),
    getUser: async (id: string): Promise<User> => {
        return app.database()
            .ref(`/users/${id}`)
            .once('value')
            .then((snapshot: firebase.database.DataSnapshot) => snapshot.val())
    },
    createUser: (user: User): void => {
        app.database()
            .ref('/users')
            .child(user.id)
            .set(user)
    },
}

export default database