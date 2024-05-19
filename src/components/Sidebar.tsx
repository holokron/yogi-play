import { Github, Heart, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTags from "@/hooks/useTags";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { FC, MouseEventHandler } from "react";
import Tag from "@/types/Tag";

export function Sidebar() {
  const { tags } = useTags();

  const location = useLocation();
  const navigate = useNavigate();

  const isOnFavourites = location.pathname === "/ulubione";

  const handleFavouritesClick: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    event.preventDefault();

    navigate("/ulubione");
  };

  return (
    <nav className="pb-12 bg-slate-900 text-background dark:text-foreground h-svh grid grid-rows-[auto_64px] ">
      <div className="space-y-4 pb-4 px-2 overflow-y-scroll">
        <div className="px-1 pb-2">
          <h2 className="px-4 text-lg pt-6 pb-2 font-semibold tracking-tigh sticky top-0 bg-slate-900">
            Kategorie
          </h2>
          <div className="space-y-1 pb-2">
            <Button
              key="favourites"
              variant={isOnFavourites ? "default" : "ghost"}
              className="w-full justify-start font-semibold"
              onClick={handleFavouritesClick}
            >
              <Heart className="mr-2" size={18} />
              Ulubione
            </Button>
            {tags.map((tag) => (
              <TagLink key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      </div>
      <div className="px-8 flex items-center gap-2">
        <Github size={16} />
        <Link to="https://github.com/holokron" target="_blank">
          Holokron
        </Link>
      </div>
    </nav>
  );
}

const TagLink: FC<{ tag: Tag }> = ({ tag }) => {
  const { changeTag, currentTag } = useTags();
  const location = useLocation();
  const navigate = useNavigate();
  const isOnFavourites = location.pathname === "/ulubione";

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    if (isOnFavourites) {
      navigate("/");
    }

    changeTag(tag.slug);
  };

  return (
    <Button
      key={tag.id}
      variant={
        !isOnFavourites && currentTag?.id === tag.id ? "default" : "ghost"
      }
      className="w-full justify-start font-semibold"
      data-slug={tag.slug}
      onClick={handleClick}
    >
      <ListMusic className="mr-2" size={18} />
      {tag.name}
    </Button>
  );
};
