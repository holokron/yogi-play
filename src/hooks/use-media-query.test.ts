import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useMediaQuery from "./use-media-query";

type Listener = () => void;

function mockMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<Listener>();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_: string, l: Listener) => listeners.add(l),
      removeEventListener: (_: string, l: Listener) => listeners.delete(l),
    })),
  );
  return {
    set(value: boolean) {
      matches = value;
      listeners.forEach((l) => l());
    },
    listeners,
  };
}

describe("hooks/useMediaQuery", (): void => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when matchMedia is unavailable", (): void => {
    vi.stubGlobal("matchMedia", undefined);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);
  });

  it("returns the current match and updates on change", (): void => {
    const media = mockMatchMedia(false);
    const { result, unmount } = renderHook(() =>
      useMediaQuery("(min-width: 768px)"),
    );

    expect(result.current).toBe(false);

    act(() => media.set(true));
    expect(result.current).toBe(true);

    unmount();
    expect(media.listeners.size).toBe(0);
  });
});
