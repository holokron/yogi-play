import { renderHook, act } from "@testing-library/react-hooks";
import useToggle from "./useToggle";

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
