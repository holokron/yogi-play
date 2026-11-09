import { FC } from "react";
import { List } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useNavMenu from "@/hooks/use-nav-menu";

export const NavMenu: FC = () => {
  const { open, setOpen } = useNavMenu();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <List size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="bg-slate-900 text-background dark:text-foreground p-0"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
