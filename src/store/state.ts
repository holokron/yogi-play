import SoundsCollection from "../types/SoundsCollection";
import TagsCollection from "../types/TagsCollection";
import User from "../types/User";

export default interface AppState {
  sounds: SoundsCollection;
  soundsFilter: string | null;
  tags: TagsCollection;
  chosenTagSlug: string;
  user: User;
}

export const initialState: AppState = {
  sounds: {},
  soundsFilter: null,
  tags: {},
  chosenTagSlug: "recent",
  user: {
    id: "",
    displayName: "",
    email: ""
  }
};
