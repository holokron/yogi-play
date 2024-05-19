import { type SoundsCollection, type TagsCollection, type User } from "@/types";

export default interface AppState {
  sounds: SoundsCollection;
  soundsFilter: string | null;
  tags: TagsCollection;
  chosenTagSlug: string;
  user: User;
  command: {
    open: boolean;
  };
}

export const initialState: AppState = {
  sounds: {},
  soundsFilter: null,
  tags: {},
  chosenTagSlug: "recent",
  user: {
    id: "",
    displayName: "",
    email: "",
  },
  command: {
    open: false,
  },
};
