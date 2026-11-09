import { Heart, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTags from "@/hooks/use-tags";
import { Link, useLocation, useNavigate } from "react-router";
import { FC, MouseEventHandler } from "react";
import { type Tag } from "@/types";
import useNavMenu from "@/hooks/use-nav-menu";

export function Sidebar() {
  const { tags } = useTags();

  const location = useLocation();
  const navigate = useNavigate();
  const { setOpen } = useNavMenu();

  const isOnFavourites = location.pathname === "/ulubione";

  const handleFavouritesClick: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    setOpen(false);
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
        <GithubIcon size={16} />
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
  const { setOpen } = useNavMenu();
  const isOnFavourites = location.pathname === "/ulubione";

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    setOpen(false);

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

// lucide-react v1 dropped brand icons, so the GitHub mark is inlined here.
const GithubIcon: FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
