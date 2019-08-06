import { getUser } from "../store/selectors";
import User from "../types/User";
import { useSelector } from "react-redux";
import { ReactElement } from "react";

interface Props {
  children: { (user: User | null): ReactElement<any> | null };
}

export default function UserContainer({
  children
}: Props): ReactElement<Props> | null {
  const user = useSelector(getUser);

  return children(user);
}
