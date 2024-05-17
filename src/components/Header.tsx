import { FC, PropsWithChildren } from "react";

export const Header: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>
      </div>
    </div>
  );
};
