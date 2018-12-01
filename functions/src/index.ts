import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { IncomingWebhook } from '@slack/client'
import * as faker from 'faker/locale/pl'

admin.initializeApp()

export const onCreateSound = functions.database.ref('/sounds/{soundId}')
    .onCreate((snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
        const sound = snapshot.val()
        const webhook = new IncomingWebhook(functions.config().slack.url)

        return webhook.send(`Nowy dźwięk: *${sound.name}* w Yogi Play! --> https://yogi-play.pl`)
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
                    const newUser = {
                        id: user.uid,
                        displayName: faker.name.jobTitle(),
                        email: faker.internet.email(undefined, undefined, 'yogi-play.pl'),
                        isAnonymous: true,
                        createdAt: new Date().getTime(),
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