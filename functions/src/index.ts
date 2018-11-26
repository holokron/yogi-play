import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import 'firebase-functions'
import { IncomingWebhook } from '@slack/client'
import * as faker from 'faker'

admin.initializeApp()

export const onCreateSound = functions.database.ref('/sounds/{soundId}')
    .onCreate((snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
        const sound = snapshot.val()
        const webhook = new IncomingWebhook(functions.config().slack.url)

       return  webhook.send(`Nowy dźwięk: *${sound.name}* w Yogi Play! --> https://yogi-play.pl`)
    })

export const onSignIn = functions.auth.user()
    .onCreate((user: functions.auth.UserRecord, context: functions.EventContext) => {
        console.log('on create user', user)

        return admin
            .database()
            .ref('/user')
            .child(user.uid)
            .once('value')
            .then(async (value: admin.database.DataSnapshot) => {
                if (!value.exists()) {
                    const firstName: string = faker.name.firstName()
                    const lastName: string = faker.name.lastName()
                    const displayName: string = faker.name.findName(firstName, lastName)
                    const email: string = faker.internet.email(firstName, lastName)

                    const newUser = {
                        id: user.uid,
                        displayName,
                        email,
                    }

                    console.log(`Creating user: ${user.uid}`, newUser)

                    admin
                        .database()
                        .ref('/users')
                        .child(user.uid)
                        .set(newUser)
                        .catch(error => {
                            console.error(`Error while creating user: ${user.uid}`, error)
                        })
                } else {
                    const existingUser = value.val()

                    const update = {
                        ...existingUser,
                        displayName: user.displayName || existingUser.displayName,
                        email: user.email || existingUser.displayName,
                    }

                    console.log(`User: ${user.uid} already exists, updating`, update)

                    admin
                        .database()
                        .ref(`/users/${user.uid}`)
                        .update(update)
                        .catch(error => {
                            console.error(`Error while updating user: ${user.uid}`, error)
                        })
                }
            })
            .catch(error => {
                console.error(`Error while checking if user: ${user.uid} exists`, error)
            })
    })

export const updateSoundPaths = functions.https.onRequest((request: functions.Request, response: functions.Response) => {
    return admin
        .database()
        .ref('/sounds')
        .once('value')
        .then((data: admin.database.DataSnapshot) => {
            const sounds = data.val()
            const updates = {}

            Object.values(sounds).forEach(async (sound: { id: string, path: string, fullPath?: string }) => {
                updates[`/sounds/${sound.id}/path`] = await admin.storage()
                    .bucket('yogi-play.appspot.com')
                    .file(sound.path)
                    .getSignedUrl({
                        action: 'READ',
                        expires: '2019-12-30',
                    })
            })

            response.send(JSON.stringify(updates))

        })
        .catch((error) => {
            console.error('Error while updating sound paths', error)

            response.sendStatus(500)
        })
})