import { describe, it, expect, beforeEach, vi } from "vitest";
import { initialState } from "./state";
import { type SoundsCollection, type TagsCollection } from "@/types";

const firebase = vi.hoisted(() => ({
  auth: { currentUser: null as { uid: string } | null },
  signInAnonymously: vi.fn<(auth: unknown) => Promise<unknown>>(),
  onAuthStateChanged:
    vi.fn<
      (auth: unknown, callback: (user: { uid: string } | null) => void) => void
    >(),
  ref: vi.fn<(db: unknown, path: string) => { path: string }>((_db, path) => ({
    path,
  })),
  set: vi.fn<(ref: unknown, value: unknown) => void>(),
  remove: vi.fn<(ref: unknown) => void>(),
  onValue:
    vi.fn<
      (ref: unknown, callback: (data: { val(): unknown }) => void) => void
    >(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: () => firebase.auth,
  signInAnonymously: firebase.signInAnonymously,
  onAuthStateChanged: firebase.onAuthStateChanged,
}));

vi.mock("firebase/database", () => ({
  getDatabase: () => ({}),
  ref: firebase.ref,
  set: firebase.set,
  remove: firebase.remove,
  onValue: firebase.onValue,
}));

const sounds: SoundsCollection = {
  a: { id: "a", name: "A", path: "/a.mp3" },
};

const tags: TagsCollection = {
  t: { id: "t", name: "T", slug: "t" },
};

// The store keeps "already loaded" flags at module level, so every test
// gets a freshly imported store.
async function loadStore() {
  vi.resetModules();
  const { useAppStore } = await import(".");
  useAppStore.setState(initialState);

  return useAppStore;
}

function mockFetch(body: unknown) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue({ json: () => body } as unknown as Response);
  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

describe("store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    firebase.auth.currentUser = null;
    firebase.signInAnonymously.mockResolvedValue({ user: { uid: "anon" } });
  });

  it("starts with the initial state", async () => {
    const store = await loadStore();

    expect(store.getState()).toMatchObject(initialState);
  });

  it.each(["foo", null])("filterSounds(%o)", async (query) => {
    const store = await loadStore();

    store.getState().filterSounds(query);

    expect(store.getState().soundsFilter).toBe(query);
  });

  it("chooseTag", async () => {
    const store = await loadStore();

    store.getState().chooseTag("all");

    expect(store.getState().chosenTagSlug).toBe("all");
  });

  it("setCommandOpen / setNavMenuOpen", async () => {
    const store = await loadStore();

    store.getState().setCommandOpen(true);
    store.getState().setNavMenuOpen(true);

    expect(store.getState().command.open).toBe(true);
    expect(store.getState().navMenu.open).toBe(true);

    store.getState().setCommandOpen(false);
    store.getState().setNavMenuOpen(false);

    expect(store.getState().command.open).toBe(false);
    expect(store.getState().navMenu.open).toBe(false);
  });

  describe("loadSounds", () => {
    it("fetches sounds and merges them into state", async () => {
      const fetchMock = mockFetch(sounds);
      const store = await loadStore();
      store.setState({
        sounds: { b: { id: "b", name: "B", path: "/b.mp3" } },
      });

      store.getState().loadSounds();

      await vi.waitFor(() =>
        expect(Object.keys(store.getState().sounds)).toEqual(["b", "a"]),
      );
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/sounds\.json$/),
      );
    });

    it("fetches only once", async () => {
      const fetchMock = mockFetch(sounds);
      const store = await loadStore();

      store.getState().loadSounds();
      store.getState().loadSounds();

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("loadTags", () => {
    it("fetches tags and merges them into state", async () => {
      const fetchMock = mockFetch(tags);
      const store = await loadStore();

      store.getState().loadTags();

      await vi.waitFor(() => expect(store.getState().tags).toEqual(tags));
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/tags\.json$/),
      );
    });

    it("fetches only once", async () => {
      const fetchMock = mockFetch(tags);
      const store = await loadStore();

      store.getState().loadTags();
      store.getState().loadTags();

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("authenticate", () => {
    it("signs in anonymously when there is no current user", async () => {
      const store = await loadStore();

      store.getState().authenticate();

      expect(firebase.signInAnonymously).toHaveBeenCalledWith(firebase.auth);
    });

    it("does not sign in when a user is already signed in", async () => {
      firebase.auth.currentUser = { uid: "u1" };
      const store = await loadStore();

      store.getState().authenticate();

      expect(firebase.signInAnonymously).not.toHaveBeenCalled();
    });

    it("loads the signed-in user from the database", async () => {
      const user = {
        id: "u1",
        displayName: "",
        email: "",
        sounds: { a: true },
      };
      firebase.onAuthStateChanged.mockImplementation((_auth, callback) =>
        callback({ uid: "u1" }),
      );
      firebase.onValue.mockImplementation((_ref, callback) =>
        callback({ val: () => user }),
      );
      const store = await loadStore();

      store.getState().authenticate();

      expect(firebase.ref).toHaveBeenCalledWith(expect.anything(), "/users/u1");
      expect(store.getState().user).toEqual(user);
    });

    it("leaves the user untouched when signed out", async () => {
      firebase.onAuthStateChanged.mockImplementation((_auth, callback) =>
        callback(null),
      );
      const store = await loadStore();

      store.getState().authenticate();

      expect(firebase.onValue).not.toHaveBeenCalled();
      expect(store.getState().user).toEqual(initialState.user);
    });
  });

  describe("user sounds", () => {
    it("addUserSound updates state and the database", async () => {
      firebase.auth.currentUser = { uid: "u1" };
      const store = await loadStore();

      store.getState().addUserSound("a");

      expect(store.getState().user.sounds).toEqual({ a: true });
      expect(firebase.set).toHaveBeenCalledWith(
        { path: "/users/u1/sounds/a" },
        true,
      );
    });

    it("removeUserSound updates state and the database", async () => {
      firebase.auth.currentUser = { uid: "u1" };
      const store = await loadStore();
      store.setState({
        user: { ...initialState.user, sounds: { a: true, b: true } },
      });

      store.getState().removeUserSound("a");

      expect(store.getState().user.sounds).toEqual({ b: true });
      expect(firebase.remove).toHaveBeenCalledWith({
        path: "/users/u1/sounds/a",
      });
    });

    it("only updates local state when nobody is signed in", async () => {
      const store = await loadStore();

      store.getState().addUserSound("a");
      expect(store.getState().user.sounds).toEqual({ a: true });

      store.getState().removeUserSound("a");
      expect(store.getState().user.sounds).toEqual({});

      expect(firebase.set).not.toHaveBeenCalled();
      expect(firebase.remove).not.toHaveBeenCalled();
    });
  });
});
