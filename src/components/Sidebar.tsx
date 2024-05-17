import { Heart, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useTags from "@/hooks/useTags";
import { useLocation, useNavigate } from "react-router";

export function Sidebar({ className }: { className?: string }) {
  const { tags, currentTag, changeTag } = useTags();

  const location = useLocation();
  const navigate = useNavigate();

  const isOnFavourites = location.pathname === "/ulubione";

  return (
    <nav
      className={cn(
        "pb-12 bg-slate-900 text-background dark:text-foreground",
        className,
      )}
    >
      <div className="space-y-4 py-4 px-2">
        <div className="px-1 py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            Kategorie
          </h2>
          <ScrollArea className="h-lvh pb-16">
            <div className="space-y-1 py-2">
              <Button
                key="favourites"
                variant={isOnFavourites ? "default" : "ghost"}
                className="w-full justify-start font-semibold"
                onClick={(e) => {
                  e.preventDefault();

                  navigate("/ulubione");
                }}
              >
                <Heart className="mr-2" size={18} />
                Ulubione
              </Button>
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  variant={
                    !isOnFavourites && currentTag?.id === tag.id
                      ? "default"
                      : "ghost"
                  }
                  className="w-full justify-start font-semibold"
                  onClick={(e) => {
                    e.preventDefault();

                    if (isOnFavourites) {
                      navigate("/");
                    }

                    changeTag(tag.slug);
                  }}
                >
                  <ListMusic className="mr-2" size={18} />
                  {tag.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </nav>
  );
}
