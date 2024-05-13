export interface Props {
  children?: any;
}

export default function Container({ children }: Props): JSX.Element {
  return <div className="pt-4">{children}</div>;
}
