import { FC } from "react";
import { List } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";

export const NavMenu: FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <List size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900 text-background dark:text-foreground p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
