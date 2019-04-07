import SoundsCollection from "../types/SoundsCollection";
import TagsCollection from "../types/TagsCollection";
import User from "../types/User";
import { SoundStateCollection } from "../types/SoundState";

export default interface AppState {
  sounds: SoundsCollection;
  soundStates: SoundStateCollection;
  tags: TagsCollection;
  chosenTagSlug: string;
  user: User;
}

export const initialState: AppState = {
  sounds: {},
  soundStates: {},
  tags: {},
  chosenTagSlug: "recent",
  user: {
    id: "",
    displayName: "",
    email: ""
  }
};
