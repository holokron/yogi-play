import { useState, useCallback } from "react";

type UseToggle = [boolean, { (): void }, { (): void }];

export default function useToggle(): UseToggle {
  const [toggled, setToggled] = useState<boolean>(false);

  const toggle = useCallback((): void => setToggled(!toggled), [toggled]);

  const toggleOf = useCallback((): void => setToggled(false), []);

  return [toggled, toggle, toggleOf];
}
