import { FC, PropsWithChildren, ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

type Props = PropsWithChildren & {
  header: ReactNode;
};

export const Content: FC<Props> = ({ header, children }) => {
  return (
    <div className="px-4 overflow-scroll h-lvh pb-48">
      <div className="sticky top-0 bg-slate-300 dark:bg-background pt-6 z-50">
        {header}
        <Separator className="my-6 w-full" />
      </div>
      {children}
    </div>
  );
};
