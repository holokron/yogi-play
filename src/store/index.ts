import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ref, set, remove, onValue, getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import AppState, { initialState } from "./state";
import { type SoundsCollection, type TagsCollection } from "@/types";
import { config } from "@/lib/config";

export interface AppActions {
  loadSounds(): void;
  loadTags(): void;
  chooseTag(tagSlug: string): void;
  authenticate(): void;
  addUserSound(soundId: string): void;
  removeUserSound(soundId: string): void;
  filterSounds(query: string | null): void;
  setCommandOpen(open: boolean): void;
  setNavMenuOpen(open: boolean): void;
}

export type AppStore = AppState & AppActions;

let soundsLoaded = false;
let tagsLoaded = false;

export const useAppStore = create<AppStore>()(
  devtools(
    (setState) => ({
      ...initialState,

      loadSounds() {
        if (soundsLoaded) {
          return;
        }
        soundsLoaded = true;

        fetch(`${config.firebase.databaseURL}/sounds.json`)
          .then((response): Promise<SoundsCollection> => response.json())
          .then((sounds) => {
            setState(
              (state) => ({ sounds: { ...state.sounds, ...sounds } }),
              false,
              "loadSounds",
            );
          });
      },

      loadTags() {
        if (tagsLoaded) {
          return;
        }
        tagsLoaded = true;

        fetch(`${config.firebase.databaseURL}/tags.json`)
          .then((response): Promise<TagsCollection> => response.json())
          .then((tags) => {
            setState(
              (state) => ({ tags: { ...state.tags, ...tags } }),
              false,
              "loadTags",
            );
          });
      },

      chooseTag(tagSlug) {
        setState({ chosenTagSlug: tagSlug }, false, "chooseTag");
      },

      authenticate() {
        const auth = getAuth();

        if (!auth.currentUser) {
          console.log("No user in localstorage, signing in anonymously");

          signInAnonymously(auth).then((value) => {
            if (!value.user) {
              console.log("No user credentials");
            }
          });
        }

        onAuthStateChanged(auth, (user) => {
          if (!user) {
            console.log("User did not sign in or logout");

            return;
          }

          console.log(`Getting user: ${user.uid} from database`);

          onValue(ref(getDatabase(), `/users/${user.uid}`), (data) => {
            if (!data) {
              console.log(`no user: ${user.uid} found`);

              return;
            }

            console.log(`got user: ${user.uid} from database`);

            setState({ user: data.val() }, false, "loadUser");
          });
        });
      },

      addUserSound(soundId) {
        setState(
          (state) => ({
            user: {
              ...state.user,
              sounds: { ...state.user?.sounds, [soundId]: true },
            },
          }),
          false,
          "addUserSound",
        );

        const user = getAuth().currentUser;
        if (!user) {
          return;
        }

        set(ref(getDatabase(), `/users/${user.uid}/sounds/${soundId}`), true);
      },

      removeUserSound(soundId) {
        setState(
          (state) => {
            const { [soundId]: _removed, ...sounds } = state.user?.sounds ?? {};

            return { user: { ...state.user, sounds } };
          },
          false,
          "removeUserSound",
        );

        const user = getAuth().currentUser;
        if (!user) {
          return;
        }

        remove(ref(getDatabase(), `/users/${user.uid}/sounds/${soundId}`));
      },

      filterSounds(query) {
        setState({ soundsFilter: query }, false, "filterSounds");
      },

      setCommandOpen(open) {
        setState({ command: { open } }, false, "setCommandOpen");
      },

      setNavMenuOpen(open) {
        setState({ navMenu: { open } }, false, "setNavMenuOpen");
      },
    }),
    { name: "yogi-play", enabled: config.nodeEnv === "development" },
  ),
);
