import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { default as firebase } from "../lib/app";
import "firebase/auth";
import "firebase/database";
import AppState from "./state";
import SoundsCollection from "../types/SoundsCollection";
import TagsCollection from "../types/TagsCollection";
import User from "../types/User";

export enum ACTIONS {
  LOAD_SOUNDS = "@app/LOAD_SOUNDS",
  LOAD_TAGS = "@app/LOAD_TAGS",
  CHOOSE_TAG = "@app/CHOOSE_TAG",
  LOAD_USER = "@app/LOAD_USER",
  ADD_USER_SOUND = "@app/ADD_USER_SOUND",
  REMOVE_USER_SOUND = "@app/REMOVE_USER_SOUND",
  FILTER_SOUNDS = "@app/FILTER_SOUNDS"
}

export interface LoadSoundsAction {
  type: ACTIONS.LOAD_SOUNDS;
  payload: {
    sounds: SoundsCollection;
  };
}

export interface LoadTagsAction {
  type: ACTIONS.LOAD_TAGS;
  payload: {
    tags: TagsCollection;
  };
}

export interface ChooseTagAction {
  type: ACTIONS.CHOOSE_TAG;
  payload: {
    tagSlug: string;
  };
}

export interface LoadUserAction {
  type: ACTIONS.LOAD_USER;
  payload: {
    user: User;
  };
}

export interface UserSoundAction {
  type: ACTIONS.ADD_USER_SOUND | ACTIONS.REMOVE_USER_SOUND;
  payload: {
    soundId: string;
  };
}

export interface FilterSoundsAction {
  type: ACTIONS.FILTER_SOUNDS;
  payload: {
    query: string | null;
  };
}

export type AppAction =
  | LoadSoundsAction
  | LoadTagsAction
  | ChooseTagAction
  | LoadUserAction
  | UserSoundAction
  | FilterSoundsAction;

export type AppDispatch = ThunkDispatch<AppState, any, AppAction>;

export function createLoadSoundsAction(
  sounds: SoundsCollection
): LoadSoundsAction {
  return {
    type: ACTIONS.LOAD_SOUNDS,
    payload: {
      sounds
    }
  };
}

export function createLoadTagsAction(tags: TagsCollection): LoadTagsAction {
  return {
    type: ACTIONS.LOAD_TAGS,
    payload: {
      tags
    }
  };
}

export function createChooseTagAction(tagSlug: string): ChooseTagAction {
  return {
    type: ACTIONS.CHOOSE_TAG,
    payload: {
      tagSlug
    }
  };
}

export function createLoadUserAction(user: User): LoadUserAction {
  return {
    type: ACTIONS.LOAD_USER,
    payload: {
      user
    }
  };
}

export function createAddUserSoundAction(soundId: string): UserSoundAction {
  return {
    type: ACTIONS.ADD_USER_SOUND,
    payload: {
      soundId
    }
  };
}

export function createRemoveUserSoundAction(soundId: string): UserSoundAction {
  return {
    type: ACTIONS.REMOVE_USER_SOUND,
    payload: {
      soundId
    }
  };
}

export function createFilterSoundsAction(
  query: string | null
): FilterSoundsAction {
  return {
    type: ACTIONS.FILTER_SOUNDS,
    payload: {
      query
    }
  };
}

let soundsLoaded: boolean = false;

export function loadSounds(): ThunkAction<
  void,
  AppState,
  any,
  LoadSoundsAction
> {
  return dispatch => {
    if (soundsLoaded) {
      return;
    }

    const soundsUrl: string = `${process.env.REACT_APP_FIREBASE_DATABASE_URL}/sounds.json`;

    fetch(soundsUrl)
      .then((response): Promise<SoundsCollection> => response.json())
      .then(
        async (sounds: SoundsCollection): Promise<void> => {
          dispatch(createLoadSoundsAction(sounds));
        }
      );

    soundsLoaded = true;
  };
}

let tagsLoaded: boolean = false;

export function loadTags(): ThunkAction<void, AppState, any, LoadTagsAction> {
  return dispatch => {
    if (tagsLoaded) {
      return;
    }

    const tagsUrl: string = `${process.env.REACT_APP_FIREBASE_DATABASE_URL}/tags.json`;

    fetch(tagsUrl)
      .then((response): Promise<TagsCollection> => response.json())
      .then((tags: TagsCollection): void => {
        dispatch(createLoadTagsAction(tags));
      });

    tagsLoaded = true;
  };
}

export function chooseTag(
  tagSlug: string
): ThunkAction<void, AppState, any, ChooseTagAction> {
  return dispatch => {
    dispatch(createChooseTagAction(tagSlug));
  };
}

export function authenticate(): ThunkAction<
  void,
  AppState,
  any,
  LoadUserAction
> {
  return dispatch => {
    const currentUser: firebase.User | null = firebase.auth().currentUser;
    console.log("currentUser", currentUser);
    if (!currentUser) {
      console.log("No user in localstorage, signing in anonymously");

      firebase
        .auth()
        .signInAnonymously()
        .then((value: firebase.auth.UserCredential) => {
          if (!value.user) {
            console.log("No user credentials");

            return;
          }
        });
    }

    firebase.auth().onAuthStateChanged(
      async (user: firebase.User | null): Promise<void> => {
        if (!user) {
          console.log("User did not sign in or logout");

          return;
        }

        console.log(`Getting user: ${user.uid} from database`);

        firebase
          .database()
          .ref(`/users/${user.uid}`)
          .on("value", (data: firebase.database.DataSnapshot | null) => {
            if (!data) {
              console.log(`no user: ${user.uid} found`);

              return;
            }

            console.log(`got user: ${user.uid} from database`);

            dispatch(createLoadUserAction(data.val()));
          });
      }
    );
  };
}

export function addUserSound(
  soundId: string
): ThunkAction<void, AppState, any, UserSoundAction> {
  return dispatch => {
    dispatch(createAddUserSoundAction(soundId));

    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }

    firebase
      .database()
      .ref(`/users/${user.uid}/sounds/${soundId}`)
      .set(true);
  };
}

export function removeUserSound(
  soundId: string
): ThunkAction<void, AppState, any, UserSoundAction> {
  return dispatch => {
    dispatch(createRemoveUserSoundAction(soundId));

    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }

    firebase
      .database()
      .ref(`/users/${user.uid}/sounds/${soundId}`)
      .remove();
  };
}
