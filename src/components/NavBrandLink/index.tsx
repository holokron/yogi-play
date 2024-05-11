import { Link } from "react-router-dom";

export default function NavBrandLink(): React.ReactElement<{}> {
  return (
    <Link to="/" className="navbar-brand">
      <img
        className="d-inline-block align-top"
        alt="Yogi PLAY"
        width={30}
        src="/icons/icon-64x64.png"
      />{" "}
      Yogi PLAY
    </Link>
  );
}
