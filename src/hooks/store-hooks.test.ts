import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAppStore } from "@/store";
import AppState, { initialState } from "@/store/state";
import useChosenSounds from "./use-chosen-sounds";
import useCommand from "./use-command";
import useInitialize from "./use-initialize";
import useNavMenu from "./use-nav-menu";
import useSoundSearch from "./use-sound-search";
import useSounds from "./use-sounds";
import useTags from "./use-tags";
import useUserSoundManager from "./use-user-sound-manager";
import useUserSounds from "./use-user-sounds";

vi.mock("firebase/auth", () => ({
  getAuth: () => ({ currentUser: null }),
}));

const state: AppState = {
  ...initialState,
  sounds: {
    a: { id: "a", name: "Alpha", path: "/a.mp3", isNew: true },
    b: { id: "b", name: "Beta", path: "/b.mp3" },
  },
  tags: {
    all: { id: "all", name: "All", slug: "all" },
    recent: { id: "recent", name: "Recent", slug: "recent" },
  },
};

const ids = (items: { id: string }[]) => items.map((item) => item.id);

describe("store hooks", () => {
  beforeEach(() => {
    useAppStore.setState(state);
  });

  it("useSounds returns sorted sounds", () => {
    const { result } = renderHook(() => useSounds());

    expect(ids(result.current)).toEqual(["a", "b"]);
  });

  it("useChosenSounds follows the chosen tag", () => {
    const { result } = renderHook(() => useChosenSounds());

    expect(ids(result.current)).toEqual(["a"]);

    act(() => useAppStore.getState().chooseTag("all"));

    expect(ids(result.current)).toEqual(["a", "b"]);
  });

  it("useCommand reads and sets the open flag", () => {
    const { result } = renderHook(() => useCommand());

    expect(result.current.open).toBe(false);

    act(() => result.current.setOpen(true));

    expect(result.current.open).toBe(true);
    expect(useAppStore.getState().command.open).toBe(true);
  });

  it("useNavMenu reads and sets the open flag", () => {
    const { result } = renderHook(() => useNavMenu());

    act(() => result.current.setOpen(true));

    expect(result.current.open).toBe(true);
    expect(useAppStore.getState().navMenu.open).toBe(true);
  });

  it("useTags exposes tags and changes the current tag", () => {
    const { result } = renderHook(() => useTags());

    expect(result.current.currentTag?.slug).toBe("recent");
    expect(ids(result.current.tags)).toEqual(["all", "recent"]);

    act(() => result.current.changeTag("all"));

    expect(result.current.currentTag?.slug).toBe("all");
  });

  it("useSoundSearch filters and switches to the 'all' tag", () => {
    const { result } = renderHook(() => useSoundSearch());

    act(() => result.current.onChange("bet"));

    expect(useAppStore.getState().soundsFilter).toBe("bet");
    expect(useAppStore.getState().chosenTagSlug).toBe("all");
  });

  it("useSoundSearch keeps the tag when the query is cleared", () => {
    const { result } = renderHook(() => useSoundSearch());

    act(() => result.current.onChange(null));

    expect(useAppStore.getState().soundsFilter).toBeNull();
    expect(useAppStore.getState().chosenTagSlug).toBe("recent");
  });

  it("useUserSoundManager and useUserSounds track favourites", () => {
    const { result: manager } = renderHook(() => useUserSoundManager("b"));
    const { result: userSounds } = renderHook(() => useUserSounds());

    expect(manager.current.isInUserSounds).toBe(false);
    expect(userSounds.current).toEqual([]);

    act(() => manager.current.addUserSound());

    expect(manager.current.isInUserSounds).toBe(true);
    expect(ids(userSounds.current)).toEqual(["b"]);

    act(() => manager.current.removeUserSound());

    expect(manager.current.isInUserSounds).toBe(false);
    expect(userSounds.current).toEqual([]);
  });

  it("useInitialize loads tags, sounds and the user once", () => {
    const loadTags = vi.fn<() => void>();
    const loadSounds = vi.fn<() => void>();
    const authenticate = vi.fn<() => void>();
    useAppStore.setState({ loadTags, loadSounds, authenticate });

    const { rerender } = renderHook(() => useInitialize());
    rerender();

    expect(loadTags).toHaveBeenCalledTimes(1);
    expect(loadSounds).toHaveBeenCalledTimes(1);
    expect(authenticate).toHaveBeenCalledTimes(1);
  });
});
