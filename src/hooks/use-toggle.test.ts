import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useToggle from "./use-toggle";

describe("hooks/useToggle", (): void => {
  it("should toggle", (): void => {
    const { result } = renderHook(() => useToggle());

    expect(result.current[0]).toBeFalsy();

    act(() => result.current[1]());

    expect(result.current[0]).toBeTruthy();
  });

  it("should toggle off", (): void => {
    const { result } = renderHook(() => useToggle());

    expect(result.current[0]).toBeFalsy();

    act(() => result.current[2]());

    expect(result.current[0]).toBeFalsy();
  });
});
