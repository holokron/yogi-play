import { describe, it, expect } from "vitest";
import AppState, { initialState } from "./state";
import * as selectors from "./selectors";

const state: AppState = {
  ...initialState,
  sounds: {
    b: { id: "b", name: "Beta", path: "/b.mp3", order: 1, tags: { t1: true } },
    a: { id: "a", name: "Alpha", path: "/a.mp3", order: 1 },
    n: { id: "n", name: "New", path: "/n.mp3", order: 5, isNew: true },
    z: { id: "z", name: "Zero", path: "/z.mp3", tags: { t2: true } },
  },
  tags: {
    t1: {
      id: "t1",
      name: "Second",
      slug: "second",
      order: 2,
      sounds: { b: true },
    },
    t2: {
      id: "t2",
      name: "First",
      slug: "first",
      order: 1,
      sounds: { z: true },
    },
    empty: { id: "empty", name: "Empty", slug: "empty", order: 0 },
    all: { id: "all", name: "All", slug: "all", order: 0 },
    recent: { id: "recent", name: "Recent", slug: "recent", order: 0 },
    misc: { id: "misc", name: "Misc", slug: "misc", order: 3 },
  },
  user: { ...initialState.user, sounds: { a: true, z: true } },
};

const ids = (items: { id: string }[]) => items.map((item) => item.id);

describe("store/selectors", () => {
  it("getSounds sorts new first, then by order, then by name", () => {
    expect(ids(selectors.getSounds(state))).toEqual(["n", "z", "a", "b"]);
  });

  it("getSounds is memoised", () => {
    expect(selectors.getSounds(state)).toBe(selectors.getSounds(state));
  });

  it("filterSounds returns everything without a filter", () => {
    expect(ids(selectors.filterSounds(state))).toEqual(["n", "z", "a", "b"]);
  });

  it("filterSounds matches names case-insensitively", () => {
    const result = selectors.filterSounds({ ...state, soundsFilter: "BET" });

    expect(ids(result)).toEqual(["b"]);
  });

  it("getSound", () => {
    expect(selectors.getSound(state, "a")?.name).toBe("Alpha");
    expect(selectors.getSound(state, "missing")).toBeNull();
  });

  it("getTagsByOrder sorts by order then name and drops empty tags", () => {
    expect(ids(selectors.getTagsByOrder(state))).toEqual([
      "all",
      "recent",
      "t2",
      "t1",
      "misc",
    ]);
  });

  it("getChosenTag", () => {
    expect(selectors.getChosenTag(state)?.id).toBe("recent");
    expect(
      selectors.getChosenTag({ ...state, chosenTagSlug: "nope" }),
    ).toBeNull();
  });

  it.each([
    ["all", ["n", "z", "a", "b"]],
    ["recent", ["n"]],
    ["misc", ["n", "a"]],
    ["second", ["b"]],
    ["nope", []],
  ])("getChosenSounds for tag %s", (chosenTagSlug, expected) => {
    expect(ids(selectors.getChosenSounds({ ...state, chosenTagSlug }))).toEqual(
      expected,
    );
  });

  it("hasUserSound", () => {
    expect(selectors.hasUserSound(state, "a")).toBe(true);
    expect(selectors.hasUserSound(state, "b")).toBe(false);
    expect(selectors.hasUserSound(initialState, "a")).toBe(false);
  });

  it("getUserSounds and getUserSoundsIds", () => {
    expect(ids(selectors.getUserSounds(state))).toEqual(["z", "a"]);
    expect(selectors.getUserSounds(initialState)).toEqual([]);
    expect(selectors.getUserSoundsIds(state)).toEqual(["a", "z"]);
    expect(selectors.getUserSoundsIds(initialState)).toEqual([]);
  });

  it("getIsCommandOpen / getIsNavMenuOpen", () => {
    const open = { ...state, command: { open: true }, navMenu: { open: true } };

    expect(selectors.getIsCommandOpen(state)).toBe(false);
    expect(selectors.getIsNavMenuOpen(state)).toBe(false);
    expect(selectors.getIsCommandOpen(open)).toBe(true);
    expect(selectors.getIsNavMenuOpen(open)).toBe(true);
  });
});
