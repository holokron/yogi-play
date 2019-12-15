import * as React from "react";

export interface Props {
  children?: any;
  fluid?: boolean;
}

export default function Container({
  children,
  fluid = false
}: Props): React.ReactElement<Props> {
  let className: string = "pt-4 container";

  if (fluid) {
    className += "-fluid";
  }

  return <div className={className}>{children}</div>;
}
