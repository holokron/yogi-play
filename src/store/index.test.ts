import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from ".";
import { initialState } from "./state";

describe("store", () => {
  beforeEach(() => {
    useAppStore.setState(initialState);
  });

  it.each(["foo", null])("filterSounds(%o)", (query) => {
    useAppStore.getState().filterSounds(query);

    expect(useAppStore.getState().soundsFilter).toBe(query);
  });

  it("chooseTag", () => {
    useAppStore.getState().chooseTag("all");

    expect(useAppStore.getState().chosenTagSlug).toBe("all");
  });

  it("setCommandOpen / setNavMenuOpen", () => {
    useAppStore.getState().setCommandOpen(true);
    useAppStore.getState().setNavMenuOpen(true);

    expect(useAppStore.getState().command.open).toBe(true);
    expect(useAppStore.getState().navMenu.open).toBe(true);
  });
});
