import { FC, PropsWithChildren, ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Props = PropsWithChildren & {
  header: ReactNode;
};

export const Content: FC<Props> = ({ header, children }) => {
  return (
    <main className="md:border-l col-span-16 md:col-span-12 w-full">
      <div className="py-6 px-4">
        {header}
        <Separator className="my-4 w-full" />
        <ScrollArea className="h-lvh">{children}</ScrollArea>
      </div>
    </main>
  );
};
