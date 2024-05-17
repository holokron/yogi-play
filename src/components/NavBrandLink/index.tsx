import { Link } from "react-router-dom";

export default function NavBrandLink(): React.ReactElement<{}> {
  return (
    <Link to="/" className=" flex items-center gap-2">
      <img alt="Yogi PLAY" width={30} src="/icons/icon-64x64.png" /> Yogi PLAY
    </Link>
  );
}
