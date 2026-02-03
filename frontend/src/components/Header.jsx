import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import UserMenu from "./header/UserMenu";

export default function Header() {
  return (
    <header className="w-full fixed top-0 left-0 z-40">
      <div className="w-full backdrop-blur-sm border-gray-200 p-4 flex items-center justify-between shadow-md">
        <Logo />
        <Navigation />
        <UserMenu />
      </div>
    </header>
  );
}