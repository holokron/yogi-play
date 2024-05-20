import { FC } from "react";
import { List } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import useNavMenu from "@/hooks/use-nav-menu";

export const NavMenu: FC = () => {
  const { open, setOpen } = useNavMenu();

  const handleClick = () => {
    setOpen(true);
  };

  const handleCloseClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open}>
      <SheetTrigger asChild onClick={handleClick}>
        <Button variant="ghost" size="icon" className="md:hidden">
          <List size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="bg-slate-900 text-background dark:text-foreground p-0"
        onClickClose={handleCloseClick}
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
