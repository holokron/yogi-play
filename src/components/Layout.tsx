import { FC, PropsWithChildren } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { Sidebar } from "@/components/Sidebar";
import { NavMenu } from "@/components/NavMenu";
import { Link } from "react-router-dom";
import { SoundSearchInput } from "@/components/SoundSearchInput";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-slate-300 dark:bg-background fixed w-full">
      <header className="bg-slate-900 flex justify-between items-center border-b px-4 p-2 gap-2 text-background dark:text-foreground border-foreground dark:border-background">
        <Link to="/" className=" flex items-center gap-2">
          <img alt="Yogi PLAY" width={30} src="/icons/icon-64x64.png" /> Yogi
          PLAY
        </Link>
        <SoundSearchInput />
        <div className="flex gap-2">
          <ModeToggle />
          <NavMenu />
        </div>
      </header>
      <main className="grid md:grid-cols-[216px_auto]">
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>
        <div className="md:border-l w-full h-full">{children}</div>
      </main>
    </div>
  );
};
