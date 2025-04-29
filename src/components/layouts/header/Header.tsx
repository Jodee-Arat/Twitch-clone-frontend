import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import Search from "./Search";

const Header = () => {
  return (
    <header className="border-border bg-card flex h-full items-center gap-x-4 border-b p-4">
      <Logo />
      <Search />
      <HeaderMenu />
    </header>
  );
};

export default Header;
