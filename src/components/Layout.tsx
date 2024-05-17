import { FC, PropsWithChildren } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import NavBrandLink from "@/components/NavBrandLink";
import { Sidebar } from "@/components/Sidebar";
import { NavMenu } from "@/components/NavMenu";
import { SoundSearchInput } from "./SoundSearchInput";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-slate-300 dark:bg-background fixed w-full">
      <header className="flex justify-between items-center border-b px-4 p-2 gap-2">
        <NavBrandLink />
        <SoundSearchInput />
        <div className="flex gap-2">
          <ModeToggle />
          <NavMenu />
        </div>
      </header>
      <main className="grid grid-cols-16">
        <Sidebar className="hidden md:block md:col-span-4" />
        {children}
      </main>
    </div>
  );
};
