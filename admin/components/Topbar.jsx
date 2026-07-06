import Link from "next/link";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";

export default function Topbar() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || "DevHub";
  return (
    <header className="topbar">
      <div className="container inner">
        <Link href="/" className="brand">
          {site}<span className="dot">.</span> <small>Admin</small>
        </Link>
        <NavLinks />
        <span className="spacer" />
        <ProfileMenu />
      </div>
    </header>
  );
}
