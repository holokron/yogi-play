import app from '../app'
import * as firebase from 'firebase'

export interface Auth {
    register(email: string, password: string): Promise<any>
    login(email: string, password: string): Promise<any>
    loginAnonymously(): Promise<any>
    loginWithGoogle(): Promise<any>
    loginWithFacebook(): Promise<any>
    logout(): Promise<any>
    getAuth(): firebase.auth.Auth
}

const auth: Auth = {
    register: (email: string, password: string): Promise<any> => {
        return app.auth()
            .createUserWithEmailAndPassword(email, password)
    },
    login: (email: string, password: string): Promise<any> => {
        return app.auth()
            .signInWithEmailAndPassword(email, password)
    },
    loginAnonymously(): Promise<any> {
        return app.auth().signInAnonymously()
    },
    loginWithGoogle(): Promise<any> {
        const provider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()

        provider.addScope('https://www.googleapis.com/auth/contacts.readonly')

        return app.auth().signInWithPopup(provider)
    },
    loginWithFacebook(): Promise<any> {
        const provider: firebase.auth.FacebookAuthProvider = new firebase.auth.FacebookAuthProvider()

        provider.addScope('email')
        provider.addScope('user_friends')

        return app.auth().signInWithPopup(provider)
    },
    logout: (): Promise<any> => {
        return app.auth().signOut()
    },
    getAuth: (): firebase.auth.Auth => app.auth()
}

export default auth